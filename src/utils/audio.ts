import { SoundTheme } from '../types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private soundTheme: SoundTheme = 'mechanical';
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setTheme(theme: SoundTheme) {
    this.soundTheme = theme;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getTheme(): SoundTheme {
    return this.soundTheme;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playKeyClick() {
    if (this.isMuted || this.soundTheme === 'silent') return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      if (this.soundTheme === 'mechanical') {
        // Crisp tactile mechanical click (Cherry MX Blue style)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800 + Math.random() * 400, now);
        filter.Q.setValueAtTime(4, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 150, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (this.soundTheme === 'thock') {
        // Deep creamy thock (lubed linear / top-re style)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260 + Math.random() * 40, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.085);
      } else if (this.soundTheme === 'typewriter') {
        // Classic typewriter mechanical clack
        const osc = this.ctx.createOscillator();
        const noiseGain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1400 + Math.random() * 200, now);

        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.055);
      }
    } catch {
      // Audio fallback safe ignore
    }
  }

  public playError() {
    if (this.isMuted || this.soundTheme === 'silent') return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  public playSuccess() {
    if (this.isMuted || this.soundTheme === 'silent') return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = now + index * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundSynthesizer();
