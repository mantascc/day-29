import { CONTROL_CONFIG, RANDOMIZE_RANGES } from '../utils/constants.js';

export class ControlsManager {
  constructor(glassElement, options = {}) {
    this.glassElement = glassElement;
    this.controls = {};
    this.intensityButtons = {};
    this.textInput = null;
    this.textSizeInput = null;
    this.textSizeDisplay = null;

    // Callbacks
    this.onChange = options.onChange || (() => {});
    this.onRandomize = options.onRandomize || (() => {});
    this.onIntensityChange = options.onIntensityChange || (() => {});
    this.onTextChange = options.onTextChange || (() => {});
    this.onTextSizeChange = options.onTextSizeChange || (() => {});
  }

  init() {
    this.initSliders();
    this.initIntensityButtons();
    this.initRandomizeButton();
    this.initTextInput();
    this.initTextSizeSlider();
  }

  initSliders() {
    Object.keys(CONTROL_CONFIG).forEach(key => {
      const config = CONTROL_CONFIG[key];
      const input = document.getElementById(config.id);
      const display = document.getElementById(`${config.id}-value`);

      if (!input || !display) {
        console.warn(`Control not found: ${config.id}`);
        return;
      }

      this.controls[key] = { input, display, config };

      input.addEventListener('input', (e) => {
        const value = e.target.value;
        const valueWithUnit = value + config.unit;

        this.glassElement.style.setProperty(config.prop, valueWithUnit);
        display.textContent = valueWithUnit;

        this.onChange({
          property: config.prop,
          value: valueWithUnit,
          rawValue: value,
          key: key
        });
      });
    });
  }

  initIntensityButtons() {
    const lowBtn = document.getElementById('intensity-low');
    const mediumBtn = document.getElementById('intensity-medium');
    const highBtn = document.getElementById('intensity-high');

    if (!lowBtn || !mediumBtn || !highBtn) {
      console.warn('Intensity buttons not found');
      return;
    }

    this.intensityButtons = { low: lowBtn, medium: mediumBtn, high: highBtn };

    Object.keys(this.intensityButtons).forEach(intensity => {
      const btn = this.intensityButtons[intensity];
      btn.addEventListener('click', () => {
        this.setActiveIntensity(intensity);
        this.onIntensityChange(intensity, btn);
      });
    });
  }

  setActiveIntensity(intensity) {
    Object.values(this.intensityButtons).forEach(btn => {
      btn.classList.remove('active');
    });

    if (this.intensityButtons[intensity]) {
      this.intensityButtons[intensity].classList.add('active');
    }
  }

  initRandomizeButton() {
    const randomizeBtn = document.getElementById('randomize-btn');

    if (!randomizeBtn) {
      console.warn('Randomize button not found');
      return;
    }

    randomizeBtn.addEventListener('click', () => {
      this.randomizeAll();
    });
  }

  randomizeAll() {
    Object.keys(RANDOMIZE_RANGES).forEach(key => {
      const range = RANDOMIZE_RANGES[key];
      const control = this.controls[key];

      if (!control) return;

      let randomValue;

      if (range.decimals !== undefined) {
        randomValue = Math.random() * (range.max - range.min) + range.min;
        randomValue = Math.round(randomValue * Math.pow(10, range.decimals)) / Math.pow(10, range.decimals);
      } else {
        randomValue = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      }

      this.updateControl(key, randomValue);
    });

    this.onRandomize();
  }

  updateControl(key, value) {
    const control = this.controls[key];
    if (!control) return;

    const { input, display, config } = control;
    const valueWithUnit = value + config.unit;

    input.value = value;
    display.textContent = valueWithUnit;
    this.glassElement.style.setProperty(config.prop, valueWithUnit);

    this.onChange({
      property: config.prop,
      value: valueWithUnit,
      rawValue: value,
      key: key
    });
  }

  getControlValue(key) {
    const control = this.controls[key];
    return control ? control.input.value : null;
  }

  initTextInput() {
    this.textInput = document.getElementById('text-input');

    if (!this.textInput) {
      console.warn('Text input not found');
      return;
    }

    this.textInput.addEventListener('input', (e) => {
      const text = e.target.value;
      this.onTextChange(text);
    });
  }

  getText() {
    return this.textInput ? this.textInput.value : '';
  }

  setText(text) {
    if (this.textInput) {
      this.textInput.value = text;
    }
  }

  initTextSizeSlider() {
    this.textSizeInput = document.getElementById('text-size');
    this.textSizeDisplay = document.getElementById('text-size-value');

    if (!this.textSizeInput || !this.textSizeDisplay) {
      console.warn('Text size slider not found');
      return;
    }

    this.textSizeInput.addEventListener('input', (e) => {
      const size = e.target.value;
      this.textSizeDisplay.textContent = size + 'px';
      this.onTextSizeChange(size);
    });
  }

  getTextSize() {
    return this.textSizeInput ? this.textSizeInput.value : '56';
  }

  setTextSize(size) {
    if (this.textSizeInput && this.textSizeDisplay) {
      this.textSizeInput.value = size;
      this.textSizeDisplay.textContent = size + 'px';
    }
  }
}
