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
