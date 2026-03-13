"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

// ─── GLSL ES 3.00 ─────────────────────────────────────────────────────────────

const VERT = /* glsl */ `#version 300 es
  in  vec2 a_position;
  in  vec2 a_texCoord;
  out vec2 v_uv;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = a_texCoord;
  }
`;

const FRAG = /* glsl */ `#version 300 es
  precision mediump float;

  uniform sampler2D u_image;
  uniform float     u_time;

  /* Up to 8 concurrent ripple events */
  uniform vec2  u_rpos[8];   /* UV origin (0-1)     */
  uniform float u_rtime[8];  /* birth time (seconds) */
  uniform float u_rstr[8];   /* strength  (0-1)      */
  uniform int   u_rcount;

  in  vec2 v_uv;
  out vec4 fragColor;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_uv;

    /* ── Cloth breath ─────────────────────────────────────────────────────────
       Perpetual low-amplitude undulation so the surface is never fully still,
       like paper held in air.  Two overlapping frequencies give an organic feel.
    */
    float bx = sin(uv.x * 3.1 + u_time * 0.38) * 0.0014
             + sin(uv.y * 2.4 + u_time * 0.27) * 0.0010;
    float by = sin(uv.y * 3.7 + u_time * 0.31) * 0.0012
             + sin(uv.x * 2.8 + u_time * 0.22) * 0.0009;
    uv += vec2(bx, by);

    /* ── Ripple displacement ──────────────────────────────────────────────────
       Each ripple is a circular wave expanding outward from its UV origin.
       The wavefront moves at `speed` UV/sec; a Gaussian envelope keeps energy
       concentrated near the front edge; an exponential ages it out over ~1.8s.
    */
    vec2 disp = vec2(0.0);
    for (int i = 0; i < 8; i++) {
      if (i >= u_rcount) break;

      float age  = u_time - u_rtime[i];
      if (age < 0.0 || age > 1.8) continue;

      vec2  delta = uv - u_rpos[i];
      float dist  = length(delta);
      if (dist < 0.001) continue;

      float speed     = 1.25;                      /* UV units / second      */
      float waveFront = dist - speed * age;
      float amplitude = u_rstr[i] * exp(-age * 2.4);
      float wave      = sin(waveFront * 26.0)      /* spatial frequency      */
                      * exp(-waveFront * waveFront * 48.0); /* front envelope */

      disp += normalize(delta) * wave * amplitude * 0.020;
    }

    uv  = clamp(uv + disp, 0.001, 0.999);
    vec4 col = texture(u_image, uv);

    /* ── Paper colour grade ───────────────────────────────────────────────────
       Desaturate toward a warm ivory tone — ivory shadows, slightly cool
       highlights — like a photograph printed on cream stock.
    */
    float lum  = dot(col.rgb, vec3(0.299, 0.587, 0.114));
    vec3  warm = vec3(lum * 1.07, lum * 1.02, lum * 0.87);
    col.rgb    = mix(col.rgb, warm,        0.22);
    col.rgb    = mix(col.rgb, vec3(lum),   0.12);

    /* ── Halide grain ─────────────────────────────────────────────────────────
       Two noise octaves (coarse paper fibre + fine photographic grain) both
       animated at different rates so the texture never stills.
    */
    float g1 = (rand(floor(uv * 280.0) + fract(u_time * 18.0)) - 0.5) * 0.050;
    float g2 = (rand(floor(uv * 680.0) + fract(u_time * 31.0)) - 0.5) * 0.020;
    col.rgb   = clamp(col.rgb + g1 + g2, 0.0, 1.0);

    /* ── Vignette ─────────────────────────────────────────────────────────────
       Smooth corner roll-off like a printed photograph.
    */
    vec2  vig = uv * (1.0 - uv.yx);
    col.rgb  *= mix(0.48, 1.0, pow(vig.x * vig.y * 22.0, 0.27));

    fragColor = col;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ripple {
  x: number;   // UV x (0-1) within image
  y: number;   // UV y (0-1) within image
  t: number;   // birth time in seconds from t0
  str: number; // strength 0-1
}

interface ShaderImageProps {
  src: string;
  type: "image" | "video";
  /** Horizontal cursor velocity in px/s — triggers ripple injection */
  velocityXMV: MotionValue<number>;
  /** Vertical cursor velocity in px/s */
  velocityYMV: MotionValue<number>;
  /** Cursor X position in image UV space (0 = left, 1 = right) */
  cursorUVXMV: MotionValue<number>;
  /** Cursor Y position in image UV space (0 = top, 1 = bottom) */
  cursorUVYMV: MotionValue<number>;
  width: number;
  height: number;
}

const MAX_RIPPLES   = 8;
const RIPPLE_TTL    = 1.8;  // seconds before a ripple expires
const MIN_INTERVAL  = 0.10; // minimum seconds between injections
const VEL_THRESHOLD = 120;  // px/s needed to trigger a ripple

// ─── Component ────────────────────────────────────────────────────────────────

export const ShaderImage = ({
  src,
  type,
  velocityXMV,
  velocityYMV,
  cursorUVXMV,
  cursorUVYMV,
  width,
  height,
}: ShaderImageProps) => {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const t0Ref           = useRef(Date.now());
  const rafRef          = useRef(0);
  const ripplesRef      = useRef<Ripple[]>([]);
  const lastInjectRef   = useRef(0);
  // live cursor / velocity state read each frame without triggering re-renders
  const velXRef         = useRef(0);
  const velYRef         = useRef(0);
  const cursorUVXRef    = useRef(0.5);
  const cursorUVYRef    = useRef(0.5);

  // ── Subscribe to MotionValues ──────────────────────────────────────────────
  useEffect(() => {
    const subs = [
      velocityXMV.on("change", (v) => { velXRef.current = v; }),
      velocityYMV.on("change", (v) => { velYRef.current = v; }),
      cursorUVXMV.on("change", (v) => { cursorUVXRef.current = v; }),
      cursorUVYMV.on("change", (v) => { cursorUVYRef.current = v; }),
    ];
    return () => subs.forEach((u) => u());
  }, [velocityXMV, velocityYMV, cursorUVXMV, cursorUVYMV]);

  // ── WebGL setup — re-runs on src / dimensions change ──────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width  = width;
    canvas.height = height;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    }) as WebGL2RenderingContext | null;
    if (!gl) return; // WebGL2 not available (very old browser)

    // ── Compile helpers ──────────────────────────────────────────────────────
    const mkShader = (kind: number, source: string) => {
      const s = gl.createShader(kind)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // ── Full-screen quad ─────────────────────────────────────────────────────
    const quad = (data: Float32Array, name: string, size: number) => {
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };

    // Positions (clip space) + UVs, UNPACK_FLIP_Y corrects HTML-image orientation
    quad(new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), "a_position", 2);
    quad(new Float32Array([ 0, 0, 1, 0,  0,1,  0,1, 1, 0, 1,1]), "a_texCoord", 2);

    // ── Uniform locations ────────────────────────────────────────────────────
    const uTime   = gl.getUniformLocation(prog, "u_time");
    const uCount  = gl.getUniformLocation(prog, "u_rcount");
    const uRpos   = Array.from({ length: MAX_RIPPLES }, (_, i) =>
      gl.getUniformLocation(prog, `u_rpos[${i}]`));
    const uRtime  = Array.from({ length: MAX_RIPPLES }, (_, i) =>
      gl.getUniformLocation(prog, `u_rtime[${i}]`));
    const uRstr   = Array.from({ length: MAX_RIPPLES }, (_, i) =>
      gl.getUniformLocation(prog, `u_rstr[${i}]`));

    // ── Texture ──────────────────────────────────────────────────────────────
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([215, 205, 188, 255])); // warm parchment placeholder
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const upload = (src: TexImageSource) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    };

    let videoEl: HTMLVideoElement | null = null;

    if (type === "video") {
      videoEl = document.createElement("video");
      Object.assign(videoEl, { src, autoplay: true, loop: true, muted: true, playsInline: true });
      videoEl.crossOrigin = "anonymous";
      videoEl.play().catch(() => {});
    } else {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => upload(img);
      img.src = src;
    }

    // Clear stale ripples from a previous project
    ripplesRef.current = [];
    // Inject a gentle entry ripple so the paper "arrives"
    const t0 = (Date.now() - t0Ref.current) / 1000;
    ripplesRef.current.push({ x: 0.5, y: 0.5, t: t0, str: 0.4 });

    // ── Ripple injection helper ──────────────────────────────────────────────
    const tryInject = (t: number) => {
      const speed = Math.sqrt(velXRef.current ** 2 + velYRef.current ** 2);
      if (speed < VEL_THRESHOLD) return;
      if (t - lastInjectRef.current < MIN_INTERVAL) return;
      lastInjectRef.current = t;

      const str = Math.min(1, speed / 600);
      const active = ripplesRef.current.filter((r) => t - r.t < RIPPLE_TTL);
      if (active.length >= MAX_RIPPLES) active.shift();
      active.push({
        x:   cursorUVXRef.current,
        y:   cursorUVYRef.current,
        t,
        str,
      });
      ripplesRef.current = active;
    };

    // ── Render loop ──────────────────────────────────────────────────────────
    const loop = () => {
      const t = (Date.now() - t0Ref.current) / 1000;

      // Update video texture every frame
      if (videoEl && videoEl.readyState >= 2) upload(videoEl);

      tryInject(t);

      // Prune expired ripples
      const alive = ripplesRef.current.filter((r) => t - r.t < RIPPLE_TTL);
      ripplesRef.current = alive;

      // Upload ripple uniforms
      gl.uniform1i(uCount, alive.length);
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = alive[i];
        if (r) {
          gl.uniform2fv(uRpos[i],  [r.x, r.y]);
          gl.uniform1f(uRtime[i],  r.t);
          gl.uniform1f(uRstr[i],   r.str);
        } else {
          gl.uniform2fv(uRpos[i],  [0, 0]);
          gl.uniform1f(uRtime[i],  -99);
          gl.uniform1f(uRstr[i],   0);
        }
      }

      gl.viewport(0, 0, width, height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      gl.deleteTexture(tex);
      gl.deleteProgram(prog);
      if (videoEl) { videoEl.pause(); videoEl.src = ""; }
    };
  }, [src, type, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width, height }}
    />
  );
};
