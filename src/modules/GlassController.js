import { DragHandler } from './DragHandler.js';
import { FilterManager } from './FilterManager.js';
import { AnimationController } from './AnimationController.js';
import { ControlsManager } from './ControlsManager.js';
import { UnsplashManager } from './UnsplashManager.js';
import { BackgroundManager } from './BackgroundManager.js';

export class GlassController {
  constructor(glassElement, options = {}) {
    this.glassElement = glassElement;
    this.options = options;

    // Module instances
    this.glassDragHandler = null;
    this.textDragHandler = null;
    this.filterManager = null;
    this.animationController = null;
    this.controlsManager = null;
    this.unsplashManager = null;
    this.backgroundManager = null;

    // UI elements
    this.playBtn = null;
    this.pauseBtn = null;
    this.speedInput = null;
    this.speedDisplay = null;
    this.speedGroup = null;
    this.textOverlay = null;
  }

  init() {
    if (!this.glassElement) {
      console.error('Glass element not provided');
      return false;
    }

    // Initialize FilterManager first (no dependencies)
    this.filterManager = new FilterManager('liquid');
    const filterInitialized = this.filterManager.init();

    if (!filterInitialized) {
      console.error('Failed to initialize FilterManager');
      return false;
    }

    // Apply initial filter to glass
    this.glassElement.style.filter = 'url(#liquid)';
    this.filterManager.applyHueRotate(this.glassElement, 0);

    // Initialize DragHandler for glass pane
    this.glassDragHandler = new DragHandler(this.glassElement, {
      onDragStart: (position) => {
        // Optional: Add feedback when dragging starts
      },
      onDrag: (position) => {
        // Optional: Track position changes
      },
      onDragEnd: (position) => {
        // Optional: Save position or provide feedback
      }
    });
    this.glassDragHandler.enable();

    // Initialize DragHandler for text overlay
    this.textOverlay = document.querySelector('.text-overlay');
    if (this.textOverlay) {
      this.textDragHandler = new DragHandler(this.textOverlay, {});
      this.textDragHandler.enable();
    }

    // Initialize AnimationController
    this.animationController = new AnimationController(this.filterManager, {
      onPlay: () => {
        this.updateAnimationUI(true);
      },
      onPause: () => {
        this.updateAnimationUI(false);
      }
    });

    // Initialize ControlsManager
    this.controlsManager = new ControlsManager(this.glassElement, {
      onChange: ({ property, value, rawValue, key }) => {
        // Handle hue changes specially
        if (key === 'hue') {
          this.filterManager.applyHueRotate(this.glassElement, rawValue);
        }
      },
      onRandomize: () => {
        // Randomize intensity as well
        const intensities = ['low', 'medium', 'high'];
        const randomIntensity = intensities[Math.floor(Math.random() * 3)];
        this.filterManager.setIntensity(randomIntensity);
        this.controlsManager.setActiveIntensity(randomIntensity);
      },
      onIntensityChange: (intensity, element) => {
        this.filterManager.setIntensity(intensity);
      },
      onTextChange: (text) => {
        // Update the text overlay
        if (this.textOverlay) {
          this.textOverlay.textContent = text;
        }
      },
      onTextSizeChange: (size) => {
        // Update the text overlay size
        if (this.textOverlay) {
          this.textOverlay.style.fontSize = size + 'px';
        }
      }
    });
    this.controlsManager.init();

    // Initialize UnsplashManager
    const sceneElement = document.querySelector('.scene');
    this.unsplashManager = new UnsplashManager({
      onImageLoaded: (imageUrl) => {
        console.log('Background image loaded:', imageUrl);
      },
      onError: (error) => {
        alert(`Failed to load image: ${error}`);
      }
    });

    // Initialize BackgroundManager
    this.backgroundManager = new BackgroundManager();

    // Setup background controls
    this.setupBackgroundControls(sceneElement);

    // Setup animation controls
    this.setupAnimationControls();

    // Auto-start animation if specified
    if (this.options.autoStart) {
      this.animationController.play();
    }

    return true;
  }

  setupAnimationControls() {
    this.playBtn = document.getElementById('anim-play');
    this.pauseBtn = document.getElementById('anim-pause');
    this.speedInput = document.getElementById('anim-speed');
    this.speedDisplay = document.getElementById('anim-speed-value');
    this.speedGroup = document.getElementById('speed-group');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        this.animationController.play();
      });
    }

    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        this.animationController.pause();
      });
    }

    if (this.speedInput && this.speedDisplay) {
      this.speedInput.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        this.animationController.setSpeed(speed);
        this.speedDisplay.textContent = speed.toFixed(2) + '×';
      });
    }
  }

  updateAnimationUI(isPlaying) {
    if (this.playBtn && this.pauseBtn) {
      this.playBtn.classList.toggle('active', isPlaying);
      this.pauseBtn.classList.toggle('active', !isPlaying);
    }

    if (this.speedGroup) {
      this.speedGroup.classList.toggle('hidden', !isPlaying);
    }
  }

  setupBackgroundControls(sceneElement) {
    // Setup shuffle button for local images
    const shuffleBtn = document.getElementById('bg-shuffle');

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        this.backgroundManager.shuffle(sceneElement);
      });
    }

    // Setup Unsplash search (optional feature)
    const searchInput = document.getElementById('bg-search-input');
    const searchBtn = document.getElementById('bg-search-btn');

    if (searchBtn && searchInput) {
      const performSearch = async () => {
        const query = searchInput.value.trim();

        if (!query) {
          alert('Please enter a search keyword');
          return;
        }

        // Disable button during search
        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';

        try {
          await this.unsplashManager.setRandomBackground(sceneElement, query);
          searchBtn.textContent = 'Search image';
        } catch (error) {
          console.error('Search failed:', error);
          searchBtn.textContent = 'Search image';
        } finally {
          searchBtn.disabled = false;
        }
      };

      searchBtn.addEventListener('click', performSearch);

      // Also search on Enter key
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
    }
  }

  destroy() {
    if (this.glassDragHandler) {
      this.glassDragHandler.disable();
    }

    if (this.textDragHandler) {
      this.textDragHandler.disable();
    }

    if (this.animationController) {
      this.animationController.destroy();
    }

    // Clean up other resources if needed
  }

  // Public API methods
  getState() {
    return {
      glassPosition: this.glassDragHandler ? this.glassDragHandler.getPosition() : null,
      textPosition: this.textDragHandler ? this.textDragHandler.getPosition() : null,
      intensity: this.filterManager ? this.filterManager.getIntensity() : null,
      isAnimating: this.animationController ? this.animationController.isAnimating() : false,
      animationSpeed: this.animationController ? this.animationController.getSpeed() : 1.0
    };
  }

  reset() {
    if (this.glassDragHandler) {
      this.glassDragHandler.reset();
    }
    if (this.textDragHandler) {
      this.textDragHandler.reset();
    }
  }
}
