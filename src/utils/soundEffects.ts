/**
 * SpendSwipe Arcade Sound Synthesizer & Procedural Synthwave BGM Engine.
 * Built with pure Web Audio API (zero external audio file dependencies).
 */

let audioCtx: AudioContext | null = null;
let sfxMuted = false;
let bgmMuted = false;
let bgmIntervalId: ReturnType<typeof setInterval> | null = null;
let isBgmPlaying = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  return sfxMuted;
}

export function setAudioMuted(isMuted: boolean): void {
  sfxMuted = isMuted;
  if (isMuted && isBgmPlaying) {
    stopSynthwaveBgm();
  }
}

export function toggleAudioMute(): boolean {
  sfxMuted = !sfxMuted;
  if (sfxMuted && isBgmPlaying) {
    stopSynthwaveBgm();
  }
  return sfxMuted;
}

export function isBgmActive(): boolean {
  return isBgmPlaying && !bgmMuted;
}

export function toggleBgm(): boolean {
  if (isBgmPlaying) {
    stopSynthwaveBgm();
    bgmMuted = true;
    return false;
  } else {
    bgmMuted = false;
    startSynthwaveBgm();
    return true;
  }
}

/**
 * 120 BPM Procedural Cyberpunk Synthwave Background Music Loop
 */
export function startSynthwaveBgm(): void {
  if (bgmMuted || sfxMuted || isBgmPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  isBgmPlaying = true;
  const bassNotes = [110, 110, 130.81, 110, 98, 98, 123.47, 98]; // A2 / C3 / G2 / B2 bassline
  const leadArp = [440, 523.25, 659.25, 880, 659.25, 523.25, 440, 392];
  let step = 0;

  // 120 BPM 16th notes = 125ms per step
  bgmIntervalId = setInterval(() => {
    if (!isBgmPlaying || sfxMuted || bgmMuted) return;
    const now = ctx.currentTime;

    // 1. Driving Synth Bass
    if (step % 2 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      const note = bassNotes[(step / 2) % bassNotes.length];

      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(note, now);

      bassGain.gain.setValueAtTime(0.08, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 0.18);
    }

    // 2. High Cyber Arpeggiator Lead
    if (step % 4 === 0) {
      const leadOsc = ctx.createOscillator();
      const leadGain = ctx.createGain();
      const leadNote = leadArp[(step / 4) % leadArp.length];

      leadOsc.type = 'square';
      leadOsc.frequency.setValueAtTime(leadNote, now);

      leadGain.gain.setValueAtTime(0.03, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      leadOsc.connect(leadGain);
      leadGain.connect(ctx.destination);

      leadOsc.start(now);
      leadOsc.stop(now + 0.22);
    }

    step = (step + 1) % 32;
  }, 125);
}

export function stopSynthwaveBgm(): void {
  isBgmPlaying = false;
  if (bgmIntervalId) {
    clearInterval(bgmIntervalId);
    bgmIntervalId = null;
  }
}

/**
 * Heavy Katana / Laser Blade Slice SFX with Metallic Resonance
 */
export function playSlashSound(): void {
  if (sfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Blade Whoosh (Sawtooth ramp)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(950, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.18);

  // 2. Metallic Hit / Thud
  const hitOsc = ctx.createOscillator();
  const hitGain = ctx.createGain();

  hitOsc.type = 'triangle';
  hitOsc.frequency.setValueAtTime(140, now);
  hitOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

  hitGain.gain.setValueAtTime(0.4, now);
  hitGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

  hitOsc.connect(hitGain);
  hitGain.connect(ctx.destination);

  hitOsc.start(now);
  hitOsc.stop(now + 0.12);
}

/**
 * Retro Arcade Coin Rattle & Chime (KEEP)
 */
export function playCoinSound(): void {
  if (sfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [987.77, 1318.51, 1567.98]; // B5 -> E6 -> G6

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    gain.gain.setValueAtTime(0.2, now + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.05 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.25);
  });
}

/**
 * Electric Lightning Zap / Power Surge (TAX WRITE-OFF)
 */
export function playTaxPowerUpSound(): void {
  if (sfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [220, 440, 659, 880, 1174];
  const step = 0.04;

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now + idx * step);

    gain.gain.setValueAtTime(0.18, now + idx * step);
    gain.gain.exponentialRampToValueAtTime(0.01, now + idx * step + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * step);
    osc.stop(now + idx * step + 0.14);
  });
}

/**
 * Arcade Combo Multiplier Surge Sound
 */
export function playComboSound(multiplier: number): void {
  if (sfxMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  const baseFreq = 520 * (1 + multiplier * 0.25);
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.15);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * Victory / Game Over Fanfare
 */
export function playVictorySound(): void {
  if (sfxMuted) return;
  stopSynthwaveBgm();
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.07);

    gain.gain.setValueAtTime(0.22, now + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.4);
  });
}
