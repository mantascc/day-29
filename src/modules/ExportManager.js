import { LIQUID_INTENSITIES } from '../utils/constants.js';

export class ExportManager {
  constructor(glassElement, filterManager) {
    this.glassElement = glassElement;
    this.filterManager = filterManager;
  }

  init() {
    const exportBtn = document.getElementById('export-btn');

    if (!exportBtn) {
      console.warn('Export button not found');
      return;
    }

    exportBtn.addEventListener('click', () => {
      this.exportCSS();
    });
  }

  exportCSS() {
    const css = this.generateCSS();

    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(css)
        .then(() => {
          alert('CSS copied to clipboard!');
        })
        .catch(() => {
          // Fallback to console
          console.log(css);
          alert('CSS exported to console!');
        });
    } else {
      // Fallback for older browsers
      console.log(css);
      alert('CSS exported to console!');
    }
  }

  generateCSS() {
    const styles = window.getComputedStyle(this.glassElement);
    const intensity = this.filterManager.getIntensity();
    const settings = LIQUID_INTENSITIES[intensity];

    const css = `.glass {
  background: ${styles.background};
  backdrop-filter: ${styles.backdropFilter};
  border: ${styles.border};
  border-radius: ${styles.borderRadius};
  box-shadow: ${styles.boxShadow};
  filter: url(#liquid);
}

/* Liquid distortion (${intensity}) */
/* Add this SVG filter to your HTML:
<filter id="liquid">
  <feTurbulence type="fractalNoise" baseFrequency="${settings.frequency}" numOctaves="3"/>
  <feDisplacementMap in="SourceGraphic" scale="${settings.scale}"/>
</filter>
*/`;

    return css;
  }

  getConfig() {
    const intensity = this.filterManager.getIntensity();
    const styles = window.getComputedStyle(this.glassElement);

    return {
      intensity,
      blur: styles.getPropertyValue('--blur'),
      saturation: styles.getPropertyValue('--saturation'),
      brightness: styles.getPropertyValue('--brightness'),
      contrast: styles.getPropertyValue('--contrast'),
      hue: styles.getPropertyValue('--hue'),
      bgAlpha: styles.getPropertyValue('--bg-alpha')
    };
  }
}
