"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { playClick } from "@/lib/audio";

// ─── Vertex shader ────────────────────────────────────────────────────────────
// Perlin Classic 3D (Stefan Gustavson) + wave displacement inlined
const VERT = /* glsl */ `
uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2  uBigWavesFrequency;
uniform float uBigWavesSpeed;
uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3  vNormal;
varying vec3  vPosition;

vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x,289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }
vec3 fade3(vec3 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlinClassic3D(vec3 P){
  vec3 Pi0=floor(P); vec3 Pi1=Pi0+vec3(1.0);
  Pi0=mod(Pi0,289.0); Pi1=mod(Pi1,289.0);
  vec3 Pf0=fract(P); vec3 Pf1=Pf0-vec3(1.0);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz; vec4 iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0); vec4 ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0/7.0; vec4 gy0=fract(floor(gx0)/7.0)-0.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.0));
  gx0-=sz0*(step(0.0,gx0)-0.5); gy0-=sz0*(step(0.0,gy0)-0.5);
  vec4 gx1=ixy1/7.0; vec4 gy1=fract(floor(gx1)/7.0)-0.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.0));
  gx1-=sz1*(step(0.0,gx1)-0.5); gy1-=sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x); vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z); vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x); vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z); vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 n0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=n0.x; g010*=n0.y; g100*=n0.z; g110*=n0.w;
  vec4 n1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=n1.x; g011*=n1.y; g101*=n1.z; g111*=n1.w;
  float n000=dot(g000,Pf0); float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)); float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)); float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz)); float n111=dot(g111,Pf1);
  vec3 f=fade3(Pf0);
  vec4 nz=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),f.z);
  vec2 nyz=mix(nz.xy,nz.zw,f.y);
  return 2.2*mix(nyz.x,nyz.y,f.x);
}

float waveElevation(vec3 pos){
  float e = sin(pos.x*uBigWavesFrequency.x + uTime*uBigWavesSpeed)
           *sin(pos.z*uBigWavesFrequency.y + uTime*uBigWavesSpeed)
           *uBigWavesElevation;
  for(float i=1.0; i<=uSmallIterations; i++){
    e -= abs(perlinClassic3D(vec3(pos.xz*uSmallWavesFrequency*i, uTime*uSmallWavesSpeed))
             *uSmallWavesElevation/i);
  }
  return e;
}

void main(){
  vec4 mPos = modelMatrix * vec4(position,1.0);
  float sh = 0.01;
  vec3 mA = mPos.xyz + vec3(sh,0.0,0.0);
  vec3 mB = mPos.xyz + vec3(0.0,0.0,-sh);
  float el  = waveElevation(mPos.xyz);
  float elA = waveElevation(mA);
  float elB = waveElevation(mB);
  mPos.y += el; mA.y += elA; mB.y += elB;
  vec3 computedNormal = cross(normalize(mA-mPos.xyz), normalize(mB-mPos.xyz));
  gl_Position = projectionMatrix * viewMatrix * mPos;
  vElevation = el;
  vNormal    = computedNormal;
  vPosition  = mPos.xyz;
}
`;

// ─── Fragment shader ──────────────────────────────────────────────────────────
const FRAG = /* glsl */ `
uniform vec3  uDepthColor;
uniform vec3  uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3  vNormal;
varying vec3  vPosition;

vec3 pointLight(vec3 lc, float li, vec3 n, vec3 lp, vec3 vd, float sp, vec3 pos, float ld){
  vec3 delta = lp-pos;
  float dist = length(delta);
  vec3 dir   = normalize(delta);
  vec3 refl  = reflect(-dir,n);
  float shade  = max(0.0, dot(n,dir));
  float spec   = pow(max(0.0,-dot(refl,vd)), sp);
  float decay  = max(0.0, 1.0-dist*ld);
  return lc*li*decay*(shade+spec);
}

void main(){
  vec3 vd     = normalize(vPosition - cameraPosition);
  vec3 n      = normalize(vNormal);
  float mix_s = smoothstep(0.0,1.0,(vElevation+uColorOffset)*uColorMultiplier);
  vec3 color  = mix(uDepthColor, uSurfaceColor, mix_s);
  color *= pointLight(vec3(1.0),10.0,n,vec3(0.0,0.25,0.0),vd,30.0,vPosition,0.95);
  gl_FragColor = vec4(color,1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const LIGHT = { bg: "#f8f8f8", depth: "#0a0a0a", surface: "#c8c8c8" };
const DARK  = { bg: "#0a0a0a", depth: "#0a0a0a", surface: "#d4d4d4" };

// ─── Main component ───────────────────────────────────────────────────────────
export function SeaCanvas({ isDark = false }: { isDark?: boolean }) {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // ── Setup ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const scene  = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 0.42, 1.25);
    camera.lookAt(0, -0.08, -0.25);

    const palette = isDark ? DARK : LIGHT;
    scene.background = new THREE.Color(palette.bg);

    const geometry = new THREE.PlaneGeometry(4, 4, 256, 256);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:               { value: 0 },
        uBigWavesElevation:  { value: 0.14 },
        uBigWavesFrequency:  { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed:      { value: 0.55 },
        uSmallWavesElevation:{ value: 0.12 },
        uSmallWavesFrequency:{ value: 3 },
        uSmallWavesSpeed:    { value: 0.18 },
        uSmallIterations:    { value: 4 },
        uDepthColor:         { value: new THREE.Color(palette.depth) },
        uSurfaceColor:       { value: new THREE.Color(palette.surface) },
        uColorOffset:        { value: 0.80 },
        uColorMultiplier:    { value: 2.0 },
      },
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.5;
    scene.add(mesh);

    // ── Resize ─────────────────────────────────────────────────────────────
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ── Animate ────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const tick  = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current    = null;
      materialRef.current = null;
    };
  }, []);

  // ── Live theme updates (no WebGL remount needed) ──────────────────────────
  useEffect(() => {
    const palette = isDark ? DARK : LIGHT;
    if (sceneRef.current)    (sceneRef.current.background as THREE.Color).set(palette.bg);
    if (materialRef.current) {
      materialRef.current.uniforms.uDepthColor.value.set(palette.depth);
      materialRef.current.uniforms.uSurfaceColor.value.set(palette.surface);
    }
  }, [isDark]);

  const bg = (isDark ? DARK : LIGHT).bg;

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full"
      onClick={playClick}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Heavy left fade — keeps text readable */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] z-10"
        style={{ background: `linear-gradient(to right, ${bg} 0%, ${bg}cc 40%, transparent 100%)` }} />
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 z-10"
        style={{ background: `linear-gradient(to bottom, ${bg}, transparent)` }} />
      {/* Bottom fade — dissolves into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] z-10"
        style={{ background: `linear-gradient(to top, ${bg}, transparent)` }} />
    </div>
  );
}
