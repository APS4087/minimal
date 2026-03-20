let ctx: AudioContext | null = null;
let reverb: ConvolverNode | null = null;
let master: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function getMaster(c: AudioContext): GainNode {
  if (master) return master;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value    =   6;
  comp.ratio.value   =   3;
  comp.attack.value  =   0.003;
  comp.release.value =   0.25;
  comp.connect(c.destination);
  master = c.createGain();
  master.gain.value = 0.65;
  master.connect(comp);
  return master;
}

// Concert hall reverb
function getReverb(c: AudioContext): ConvolverNode {
  if (reverb) return reverb;
  const len = c.sampleRate * 2.4;
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
  }
  reverb = c.createConvolver();
  reverb.buffer = buf;
  reverb.connect(getMaster(c));
  return reverb;
}

function tone(c: AudioContext, freq: number, dry: number, wet: number, attack: number, decay: number, delay = 0) {
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;

  const dg = c.createGain();
  dg.gain.setValueAtTime(0, t);
  dg.gain.linearRampToValueAtTime(dry, t + attack);
  dg.gain.exponentialRampToValueAtTime(0.001, t + decay);

  const wg = c.createGain();
  wg.gain.setValueAtTime(0, t);
  wg.gain.linearRampToValueAtTime(wet, t + attack);
  wg.gain.exponentialRampToValueAtTime(0.001, t + decay * 1.6);

  osc.connect(dg); dg.connect(getMaster(c));
  osc.connect(wg); wg.connect(getReverb(c));
  osc.start(t);
  osc.stop(t + decay * 1.8);
  osc.onended = () => { osc.disconnect(); dg.disconnect(); wg.disconnect(); };
}

// Soft hover — gentle high note
export function playTick() {
  const c = getCtx();
  if (!c) return;
  tone(c, 880, 0.028, 0.07, 0.008, 0.20);
}

// Organ chord — C major triad (C3 · E3 · G3)
// Major chord = bright, open, majestic — not minor/eerie
export function playClick() {
  const c = getCtx();
  if (!c) return;
  tone(c, 130.8, 0.16, 0.30, 0.014, 0.65); // C3
  tone(c, 164.8, 0.10, 0.20, 0.014, 0.58); // E3
  tone(c, 196.0, 0.07, 0.14, 0.014, 0.52); // G3
}

// Interstellar swell — slow organ build from C2
export function playWhooshUp() {
  const c = getCtx();
  if (!c) return;
  tone(c, 65.4,  0.18, 0.40, 0.8, 1.5);   // C2 — foundation
  tone(c, 130.8, 0.10, 0.22, 0.8, 1.2);   // C3
  tone(c, 196.0, 0.06, 0.12, 0.8, 1.0);   // G3
  tone(c, 261.6, 0.03, 0.06, 0.85, 0.85); // C4 — top
}

// Organ release — harmonics fall away
export function playWhooshDown() {
  const c = getCtx();
  if (!c) return;
  tone(c, 261.6, 0.08, 0.16, 0.008, 0.50); // C4 fades first
  tone(c, 196.0, 0.10, 0.20, 0.008, 0.62); // G3
  tone(c, 130.8, 0.13, 0.26, 0.008, 0.78); // C3
  tone(c, 65.4,  0.15, 0.32, 0.008, 0.95); // C2 lingers
}

// Single resolving note — navigate
export function playPage() {
  const c = getCtx();
  if (!c) return;
  tone(c, 261.6, 0.12, 0.28, 0.008, 0.42); // C4 — clean, resolved
}

// Star hover — FM synthesis + stellar noise. Each cluster index = distinct cosmic voice.
// No musical scale — these are sub-bass "stellar frequencies" that feel massive + distant.
export function playStarHover(index: number) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;

  // 10 sub-bass carrier frequencies (not musical — cosmic, low, vast)
  const STELLAR = [38.9, 43.7, 48.1, 51.9, 58.3, 65.4, 73.4, 82.4, 87.3, 97.9];
  const cf = STELLAR[index % STELLAR.length];

  // ── FM synthesis: inharmonic ratio → metallic / cosmic bell texture ──
  const mod = c.createOscillator();
  const modGain = c.createGain();
  const car = c.createOscillator();

  mod.type = "sine";
  mod.frequency.value = cf * 3.5; // non-integer ratio = inharmonic = not musical

  // Modulation index decays slowly — starts brash, settles to pure tone
  modGain.gain.setValueAtTime(0, t);
  modGain.gain.linearRampToValueAtTime(cf * 5, t + 0.25);
  modGain.gain.exponentialRampToValueAtTime(cf * 0.3, t + 2.4);

  car.type = "sine";
  car.frequency.value = cf;

  const wetGain = c.createGain();
  wetGain.gain.setValueAtTime(0, t);
  wetGain.gain.linearRampToValueAtTime(0.08, t + 0.3);
  wetGain.gain.exponentialRampToValueAtTime(0.001, t + 4.0);

  const dryGain = c.createGain();
  dryGain.gain.setValueAtTime(0, t);
  dryGain.gain.linearRampToValueAtTime(0.022, t + 0.3);
  dryGain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

  mod.connect(modGain);
  modGain.connect(car.frequency); // FM: modulator drives carrier pitch
  car.connect(wetGain); wetGain.connect(getReverb(c));
  car.connect(dryGain); dryGain.connect(getMaster(c));

  mod.start(t); mod.stop(t + 4.1);
  car.start(t); car.stop(t + 4.1);
  car.onended = () => {
    mod.disconnect(); modGain.disconnect();
    car.disconnect(); wetGain.disconnect(); dryGain.disconnect();
  };

  // ── Stellar static: filtered noise burst — like cosmic radiation ──
  const bufLen = Math.floor(c.sampleRate * 0.9);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const noise = c.createBufferSource();
  noise.buffer = buf;

  const bpf = c.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 900 + index * 120; // each cluster has a different "frequency band"
  bpf.Q.value = 5;

  const nGain = c.createGain();
  nGain.gain.setValueAtTime(0.022, t);
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

  noise.connect(bpf); bpf.connect(nGain); nGain.connect(getReverb(c));
  noise.start(t); noise.stop(t + 0.9);
  noise.onended = () => { noise.disconnect(); bpf.disconnect(); nGain.disconnect(); };
}

// Deep space warp — fly into a cluster
// Low foundation swell with rising harmonics, like entering hyperspace
export function playFlyIn() {
  const c = getCtx();
  if (!c) return;
  tone(c, 55.0,  0.20, 0.42, 1.1, 2.2);        // A1 — deep rumble
  tone(c, 82.4,  0.11, 0.24, 0.9, 1.8, 0.15);  // E2 — mid harmonic
  tone(c, 110.0, 0.07, 0.16, 0.7, 1.4, 0.3);   // A2
  tone(c, 164.8, 0.03, 0.09, 0.5, 1.0, 0.5);   // E3 — airy top arrives last
}
