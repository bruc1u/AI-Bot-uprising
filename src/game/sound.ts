class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureCtx(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playArcSlash(isEmp: boolean) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isEmp ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(isEmp ? 720 : 520, now);
    osc.frequency.exponentialRampToValueAtTime(isEmp ? 110 : 160, now + (isEmp ? 0.24 : 0.11));

    gain.gain.setValueAtTime(isEmp ? 0.16 : 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isEmp ? 0.25 : 0.12));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isEmp ? 0.26 : 0.13));
  }

  public playChainsawRip() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.linearRampToValueAtTime(210, now + 0.07);
    osc.frequency.linearRampToValueAtTime(95, now + 0.18);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playPulseLaser() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1150, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.14);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playDisruptorCannon() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.34);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.37);
  }

  public playDash() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playLootPickup(isCore: boolean) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isCore ? 660 : 520, now);
    osc.frequency.setValueAtTime(isCore ? 990 : 780, now + 0.05);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playLogicBombGlitch() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(310, now + 0.05);
    osc.frequency.setValueAtTime(1240, now + 0.1);
    osc.frequency.setValueAtTime(220, now + 0.15);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playCaptureResult(success: boolean) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = success ? 'triangle' : 'sawtooth';
    if (success) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);
    } else {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.28);
    }
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  }

  public playHalloweenChime(isTreat: boolean) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = isTreat ? [587.33, 698.46, 880, 1174.66] : [440, 415.3, 369.99, 246.94];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isTreat ? 'triangle' : 'sawtooth';
      const t0 = now + i * 0.055;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.09, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.17);
    });
  }

  public playGhostWail() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.linearRampToValueAtTime(740, now + 0.11);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.28);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);
  }

  public playBloodMoonAwaken() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Gothic D-minor organ chord stinger
    const chord = [146.83, 220.0, 293.66, 349.23, 440.0];
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.015, now + 0.52);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.64);
    });
  }

  public playPlasmaScatter() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [480, 620, 340].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.012);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.16 + idx * 0.012);
      gain.gain.setValueAtTime(0.08, now + idx * 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.012);
      osc.stop(now + 0.19);
    });
  }

  public playTeslaArc() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1480, now);
    osc.frequency.setValueAtTime(920, now + 0.03);
    osc.frequency.setValueAtTime(1760, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.16);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playGaussRailgun() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    sub.type = 'triangle';
    osc.frequency.setValueAtTime(1650, now);
    osc.frequency.exponentialRampToValueAtTime(58, now + 0.34);
    sub.frequency.setValueAtTime(180, now);
    sub.frequency.exponentialRampToValueAtTime(38, now + 0.36);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    sub.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.39);
    sub.stop(now + 0.39);
  }

  public playSingularityBlast() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(420, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.42);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }
}

export const soundFX = new CyberAudioEngine();
