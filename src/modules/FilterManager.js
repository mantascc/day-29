import { LIQUID_INTENSITIES } from '../utils/constants.js';

export class FilterManager {
  constructor(filterId = 'liquid') {
    this.filterId = filterId;
    this.currentIntensity = 'high';
    this.displacement = null;
    this.turbulence = null;
    this.baseline = { scale: 25, frequency: 0.012 };
  }

  init() {
    this.displacement = document.getElementById('displacement');
    this.turbulence = document.getElementById('turbulence');

    if (!this.displacement || !this.turbulence) {
      console.error('SVG filter elements not found');
      return false;
    }

    // Initialize with high intensity
    this.setIntensity('high');
    return true;
  }

  setIntensity(level) {
    if (!LIQUID_INTENSITIES[level]) {
      console.error(`Invalid intensity level: ${level}`);
      return;
    }

    this.currentIntensity = level;
    const settings = LIQUID_INTENSITIES[level];

    this.setScale(settings.scale);
    this.setFrequency(settings.frequency);

    // Update baseline for animation
    this.baseline = { scale: settings.scale, frequency: settings.frequency };
  }

  setScale(value) {
    if (this.displacement) {
      this.displacement.setAttribute('scale', value);
    }
  }

  setFrequency(value) {
    if (this.turbulence) {
      this.turbulence.setAttribute('baseFrequency', value);
    }
  }

  applyHueRotate(element, degrees) {
    if (!element) return;
    element.style.filter = `url(#${this.filterId}) hue-rotate(${degrees}deg)`;
  }

  getIntensity() {
    return this.currentIntensity;
  }

  getBaseline() {
    return { ...this.baseline };
  }
}
