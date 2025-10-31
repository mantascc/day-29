import { GlassController } from './modules/GlassController.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    const glassElement = document.getElementById('glass');

    if (!glassElement) {
      console.error('Glass element not found');
      return;
    }

    const app = new GlassController(glassElement, {
      autoStart: true
    });

    const initialized = app.init();

    if (!initialized) {
      console.error('Failed to initialize Liquid Glass app');
      return;
    }

    // Expose to window for debugging
    window.glassApp = app;

    console.log('Liquid Glass app initialized successfully');

  } catch (error) {
    console.error('Failed to initialize Liquid Glass:', error);
  }
});
