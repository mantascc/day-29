export const DEFAULTS = {
  BLUR: 2,
  SATURATION: 180,
  BRIGHTNESS: 110,
  CONTRAST: 100,
  HUE: 0,
  BG_ALPHA: 0.1
};

export const LIQUID_INTENSITIES = {
  low: { scale: 8, frequency: 0.008 },
  medium: { scale: 15, frequency: 0.01 },
  high: { scale: 25, frequency: 0.012 }
};

export const ANIMATION_PROFILE = {
  scaleAmp: 10,
  freqAmp: 0.006,
  scaleSpeed: 1.2,
  freqSpeed: 0.9
};

export const MIN_FREQUENCY = 0.002;

export const CONTROL_CONFIG = {
  blur: { id: 'blur', prop: '--blur', unit: 'px' },
  saturation: { id: 'saturation', prop: '--saturation', unit: '%' },
  brightness: { id: 'brightness', prop: '--brightness', unit: '%' },
  contrast: { id: 'contrast', prop: '--contrast', unit: '%' },
  'bg-alpha': { id: 'bg-alpha', prop: '--bg-alpha', unit: '' },
  hue: { id: 'hue', prop: '--hue', unit: 'deg' }
};

export const RANDOMIZE_RANGES = {
  blur: { min: 0, max: 50 },
  saturation: { min: 50, max: 300 },
  brightness: { min: 50, max: 200 },
  contrast: { min: 50, max: 200 },
  'bg-alpha': { min: 0, max: 0.3, decimals: 2 }
};
