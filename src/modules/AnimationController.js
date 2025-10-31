import { ANIMATION_PROFILE, MIN_FREQUENCY } from '../utils/constants.js';

export class AnimationController {
  constructor(filterManager, options = {}) {
    this.filterManager = filterManager;
    this.isPlaying = false;
    this.speed = 1.0;
    this.rafId = null;
    this.startTime = 0;

    // Callbacks
    this.onPlay = options.onPlay || (() => {});
    this.onPause = options.onPause || (() => {});

    // Bind method
    this.animationFrame = this.animationFrame.bind(this);
  }

  play() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.startTime = 0;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(this.animationFrame);
    this.onPlay();
  }

  pause() {
    if (!this.isPlaying) return;

    this.isPlaying = false;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.onPause();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setSpeed(multiplier) {
    this.speed = multiplier;
  }

  getSpeed() {
    return this.speed;
  }

  isAnimating() {
    return this.isPlaying;
  }

  animationFrame(nowMs) {
    if (!this.isPlaying) return;

    if (!this.startTime) {
      this.startTime = nowMs;
    }

    const t = ((nowMs - this.startTime) / 1000) * this.speed;
    const { scaleAmp, freqAmp, scaleSpeed, freqSpeed } = ANIMATION_PROFILE;
    const baseline = this.filterManager.getBaseline();

    const scale = baseline.scale + Math.sin(t * scaleSpeed) * scaleAmp;
    const freq = Math.max(
      MIN_FREQUENCY,
      baseline.frequency + Math.cos(t * freqSpeed) * freqAmp
    );

    this.filterManager.setScale(scale.toFixed(2));
    this.filterManager.setFrequency(freq.toFixed(4));

    this.rafId = requestAnimationFrame(this.animationFrame);
  }

  destroy() {
    this.pause();
  }
}
