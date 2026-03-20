"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { motion, AnimatePresence } from "framer-motion";
import { playStarHover, playClick, playWhooshDown } from "@/lib/audio";

export interface CommitData {
  sha: string;
  message: string;
  date: string;
  repoName: string;
}

function makeParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,    "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.9)");
  g.addColorStop(0.6,  "rgba(255,255,255,0.3)");
  g.addColorStop(1,    "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

// Warm galaxy-core glow — stacked as multiple sprites for a bloom effect
function makeCoreTexture(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const half = size / 2;
  const g = ctx.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0,    "rgba(255,245,210,1)");
  g.addColorStop(0.08, "rgba(255,220,140,0.95)");
  g.addColorStop(0.25, "rgba(255,160,60,0.55)");
  g.addColorStop(0.55, "rgba(200,100,30,0.18)");
  g.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function GithubUniverse({ commits }: { commits: CommitData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredIdx,  setHoveredIdx]  = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [labelPos,    setLabelPos]    = useState({ x: 0, y: 0 });
  const [showHint,    setShowHint]    = useState(true);

  const closeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !commits.length) return;

    /* ── Scene ──────────────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 12, 30);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0a, 1);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.06;
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.18;
    controls.minDistance     = 3;
    controls.maxDistance     = 60;
    controls.enablePan       = false;

    const texture = makeParticleTexture();
    const n = commits.length;

    /* ── Build galaxy particle positions ───────────────────────
         Oldest commits near core, newest near outer edge.
         Two logarithmic spiral arms + 28% scattered field stars.
         ────────────────────────────────────────────────────── */
    const positions = new Float32Array(n * 3);
    const colors    = new Float32Array(n * 3);
    const worldPos: THREE.Vector3[] = new Array(n);

    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0.5;

      // Base radius: older → centre, newer → edge, ±22% jitter per star
      const baseR = 0.5 + Math.pow(t, 0.48) * 17;
      const r     = baseR * (0.78 + Math.random() * 0.44);

      let angle: number;

      if (Math.random() < 0.72) {
        // ── Spiral arm star (2 arms, 180° apart) ────────────
        const arm       = Math.random() < 0.5 ? 0 : 1;
        const armOffset = arm * Math.PI;
        // Logarithmic spiral: angle ∝ ln(r) — arms curve naturally
        const spiralAngle = armOffset + Math.log(Math.max(r, 0.3)) * 3.8;
        // Physical arm width grows slightly with radius, converted to angular scatter
        const armWidth = 0.5 + r * 0.09;
        const angScatter = (armWidth / Math.max(r, 0.5)) * 2.2;
        angle = spiralAngle + (Math.random() - 0.5) * angScatter;
      } else {
        // ── Interarm / field star — fully random angle ───────
        angle = Math.random() * Math.PI * 2;
      }

      const x = Math.cos(angle) * r + (Math.random() - 0.5) * 0.18;
      const z = Math.sin(angle) * r + (Math.random() - 0.5) * 0.18;

      // Thin galactic disk — gaussian-ish height, thicker near core
      const diskH = 1.1 * Math.exp(-r * 0.055) + 0.12;
      const y     = (Math.random() + Math.random() - 1) * diskH;

      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      worldPos[i] = new THREE.Vector3(x, y, z);

      // Brightness: older = dim blue-white, newer = bright warm white
      const b        = 0.28 + Math.pow(t, 0.6) * 0.72;
      const warmth   = t * 0.18;
      const coolness = (1 - t) * 0.20;
      colors[i * 3]     = Math.min(1, b + warmth);
      colors[i * 3 + 1] = b;
      colors[i * 3 + 2] = Math.min(1, b + coolness);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: texture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 1.0,
      alphaTest: 0.001,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /* ── Background stars for depth (not interactive) ───────── */
    const bgCount = 1800;
    const bgPos   = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      // Concentrate toward galactic plane — narrow gaussian in y
      const r = 28 + Math.random() * 40;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      // Disk-like height distribution for background stars
      const yH = (Math.random() + Math.random() - 1) * (3 + Math.random() * 5);
      bgPos[i * 3]     = x;
      bgPos[i * 3 + 1] = yH;
      bgPos[i * 3 + 2] = z;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      size: 0.055, color: 0xffffff,
      blending: THREE.AdditiveBlending, depthWrite: false,
      transparent: true, opacity: 0.40, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    /* ── Galaxy core glow (layered sprites for bloom effect) ─── */
    const coreTex = makeCoreTexture();
    const coreSpriteMat = (scale: number, opacity: number) => {
      const mat = new THREE.SpriteMaterial({
        map: coreTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(scale, scale, 1);
      return sprite;
    };
    // Three layers: large diffuse halo → tight glow → bright core
    scene.add(coreSpriteMat(14, 0.18));
    scene.add(coreSpriteMat(6,  0.40));
    scene.add(coreSpriteMat(2,  0.75));

    /* ── Highlight mesh (single pulsing point at hovered/selected) */
    const hlGeo = new THREE.BufferGeometry();
    hlGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, -9999, 0]), 3));
    const hlMat = new THREE.PointsMaterial({
      size: 0.28, map: texture,
      color: 0xffffff,
      blending: THREE.AdditiveBlending, depthWrite: false,
      transparent: true, opacity: 0, sizeAttenuation: true,
    });
    const highlight = new THREE.Points(hlGeo, hlMat);
    scene.add(highlight);

    /* ── Raycaster ──────────────────────────────────────────── */
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.28 };
    const mouseNDC = new THREE.Vector2(-9, -9);

    let lastHoveredIdx  = -1;
    let currentSelected = -1;

    const moveHighlight = (idx: number) => {
      const hlPos = hlGeo.attributes.position as THREE.BufferAttribute;
      if (idx >= 0) {
        hlPos.setXYZ(0, worldPos[idx].x, worldPos[idx].y, worldPos[idx].z);
        hlMat.opacity = currentSelected >= 0 ? 1.0 : 0.85;
      } else {
        hlPos.setXYZ(0, 0, -9999, 0);
        hlMat.opacity = 0;
      }
      hlPos.needsUpdate = true;
    };

    closeRef.current = () => {
      playWhooshDown();
      currentSelected = -1;
      setSelectedIdx(null);
      moveHighlight(lastHoveredIdx); // revert to hover state
    };

    /* ── Mouse move — hover detection ───────────────────────── */
    const onMouseMove = (e: MouseEvent) => {
      mouseNDC.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      );

      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(points);
      const idx  = hits.length > 0 ? (hits[0].index ?? -1) : -1;

      if (idx !== lastHoveredIdx) {
        lastHoveredIdx = idx;
        setHoveredIdx(idx >= 0 ? idx : null);
        if (idx >= 0) playStarHover(idx % 10);
        if (currentSelected < 0) moveHighlight(idx);
      }

      if (idx >= 0) setLabelPos({ x: e.clientX, y: e.clientY });
    };

    /* ── Click — select / deselect ──────────────────────────── */
    let mouseDownPos = { x: 0, y: 0 };
    const onMouseDown = (e: MouseEvent) => { mouseDownPos = { x: e.clientX, y: e.clientY }; };
    const onMouseUp   = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y) > 5) return;

      const mx = (e.clientX / window.innerWidth)  * 2 - 1;
      const my = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
      const hits = raycaster.intersectObject(points);

      if (hits.length > 0 && hits[0].index != null) {
        const idx = hits[0].index;
        currentSelected = idx;
        setSelectedIdx(idx);
        moveHighlight(idx);
        playClick();
      } else if (currentSelected >= 0) {
        closeRef.current();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("keydown",   onKeyDown);
    window.addEventListener("resize",    onResize);

    /* ── Render loop ────────────────────────────────────────── */
    let rafId: number;
    const tick = () => {
      // Pulse the highlight when something is selected
      if (currentSelected >= 0) {
        hlMat.opacity = 0.65 + Math.sin(Date.now() * 0.0025) * 0.35;
      }
      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    /* ── Cleanup ────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("keydown",   onKeyDown);
      window.removeEventListener("resize",    onResize);
      geometry.dispose(); material.dispose();
      bgGeo.dispose();    bgMat.dispose();
      hlGeo.dispose();    hlMat.dispose();
      texture.dispose();  coreTex.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }, [commits]);

  const hovered  = hoveredIdx  != null ? commits[hoveredIdx]  : null;
  const selected = selectedIdx != null ? commits[selectedIdx] : null;

  const LABEL_W = 260;
  const clampX = typeof window !== "undefined"
    ? Math.min(labelPos.x + 20, window.innerWidth - LABEL_W - 16)
    : labelPos.x + 20;
  const clampY = Math.max(labelPos.y - 10, 56);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* ── Hover tooltip ──────────────────────────────────── */}
      {hovered && !selected && (
        <div
          className="fixed pointer-events-none z-10 flex flex-col gap-[5px]"
          style={{ left: clampX, top: clampY, maxWidth: LABEL_W }}
        >
          <span className="font-serif text-14 uppercase text-white leading-none tracking-tight">
            {hovered.message.length > 42
              ? hovered.message.slice(0, 42) + "…"
              : hovered.message}
          </span>
          <span className="font-sans text-9 uppercase tracking-widest text-white/40">
            {hovered.repoName.replace(/-/g, " ")}
          </span>
          <span className="font-sans text-8 uppercase tracking-widest text-white/25 mt-[2px]">
            {new Date(hovered.date).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}&nbsp;·&nbsp;{hovered.sha}
          </span>
        </div>
      )}

      {/* ── Selected commit panel ───────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.52, ease: EASE }}
            className="absolute top-40 right-0 bottom-0 w-[280px] lg:w-[320px] flex flex-col justify-center px-28 lg:px-32 pointer-events-auto"
          >
            <button
              onClick={() => closeRef.current()}
              className="font-sans text-9 uppercase tracking-widest text-white/30 hover:text-white/80 transition-colors duration-200 mb-28 text-left"
            >
              ← Close
            </button>

            <h2 className="font-serif text-18 lg:text-22 uppercase leading-[1.15] tracking-tight text-white mb-10">
              {selected.message}
            </h2>

            <p className="font-sans text-10 uppercase tracking-widest text-white/45 mb-20">
              {selected.repoName.replace(/-/g, " ")}
            </p>

            <div className="flex flex-col gap-10 border-t border-white/10 pt-16 mb-28">
              <div className="flex justify-between items-baseline gap-8">
                <span className="font-sans text-9 uppercase tracking-widest text-white/25 shrink-0">Date</span>
                <span className="font-sans text-9 uppercase tracking-widest text-white/60 text-right">
                  {new Date(selected.date).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-8">
                <span className="font-sans text-9 uppercase tracking-widest text-white/25 shrink-0">SHA</span>
                <span className="font-mono text-9 text-white/60">{selected.sha}</span>
              </div>
              <div className="flex justify-between items-baseline gap-8">
                <span className="font-sans text-9 uppercase tracking-widest text-white/25 shrink-0">Repo</span>
                <span className="font-sans text-9 uppercase tracking-widest text-white/60 text-right">{selected.repoName}</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hint ─────────────────────────────────────────────── */}
      <div
        className={`absolute bottom-16 right-16 lg:right-24 flex flex-col items-end gap-4 pointer-events-none transition-opacity duration-700 ${
          showHint && !selected ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="font-sans text-9 uppercase tracking-widest text-white/50">
          Click a star to see the commit
        </span>
        <span className="font-sans text-8 uppercase tracking-widest text-white/30">
          Drag to orbit · Scroll to zoom
        </span>
      </div>
    </div>
  );
}
