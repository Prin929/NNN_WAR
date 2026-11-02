/**
 * Military Web Audio Synthesizer
 * Generates procedural tactical sound effects without external audio files
 */

let audioCtx: AudioContext | null = null;

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

/**
 * Military Crisp Salute Sound
 */
export function playSaluteSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Boot click / snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);

    // Secondary fabric / salute snap
    setTimeout(() => {
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      const snapTime = ctx.currentTime;

      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(880, snapTime);
      snapOsc.frequency.exponentialRampToValueAtTime(440, snapTime + 0.05);

      snapGain.gain.setValueAtTime(0.25, snapTime);
      snapGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.05);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(snapTime);
      snapOsc.stop(snapTime + 0.06);
    }, 40);
  } catch {
    // Ignore audio errors silently
  }
}

/**
 * Bugle "Taps" tribute for fallen comrades
 */
export function playBugleTaps() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Bugle notes in Hz (C4, E4, G4, C5)
    // Taps opening phrase: G3 (196), G3 (196), C4 (261.6), G3 (196), C4 (261.6), E4 (329.6)...
    const notes = [
      { f: 196.0, duration: 0.6, delay: 0.0 }, // Sol
      { f: 196.0, duration: 0.3, delay: 0.7 }, // Sol
      { f: 261.63, duration: 0.8, delay: 1.1 }, // Do
      { f: 196.0, duration: 0.4, delay: 2.0 }, // Sol
      { f: 261.63, duration: 0.4, delay: 2.5 }, // Do
      { f: 329.63, duration: 1.2, delay: 3.0 }, // Mi
    ];

    notes.forEach(({ f, duration, delay }) => {
      const start = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, start);

      // Low pass filter to simulate warm brass bugle
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  } catch {
    // Fallback
  }
}

/**
 * Emergency Alarm / Klaxon for Temptation Defusal Panic Button
 */
let sirenInterval: ReturnType<typeof setInterval> | null = null;

export function startEmergencySiren() {
  stopEmergencySiren();
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    let cycle = 0;
    const playWhoop = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const low = cycle % 2 === 0 ? 550 : 750;
      const high = cycle % 2 === 0 ? 950 : 1150;

      osc.frequency.setValueAtTime(low, now);
      osc.frequency.linearRampToValueAtTime(high, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
      cycle++;
    };

    playWhoop();
    sirenInterval = setInterval(playWhoop, 500);
  } catch {
    // Ignore
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
}

/**
 * Triumphant Medal of Honor Fanfare
 */
export function playMedalFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Brass notes: C4, G4, C5, E5, G5
    const fanfare = [
      { f: 261.63, start: 0.0, dur: 0.2 },
      { f: 329.63, start: 0.22, dur: 0.2 },
      { f: 392.0, start: 0.44, dur: 0.2 },
      { f: 523.25, start: 0.66, dur: 0.7 },
      { f: 659.25, start: 1.4, dur: 0.25 },
      { f: 783.99, start: 1.68, dur: 1.1 },
    ];

    fanfare.forEach(({ f, start, dur }) => {
      const startTime = now + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.05);
    });
  } catch {
    // Ignore
  }
}

/**
 * Military Radio Click / Comm Beep
 */
export function playRadioClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1800, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Ignore
  }
}
