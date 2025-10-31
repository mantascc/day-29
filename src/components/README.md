# Component Factory Functions

Factory functions for creating reusable UI components in the Liquid Glass app.

## Overview

This directory contains factory functions that create DOM elements with consistent styling and behavior. Each function returns a configured HTMLElement with a public API for programmatic control.

## Components

### 1. createRangeSlider

Creates a range slider control with label and value display.

**Import:**
```javascript
import { createRangeSlider } from './components/createRangeSlider.js';
```

**Usage:**
```javascript
const blurSlider = createRangeSlider({
  id: 'blur',
  label: 'Blur',
  min: 0,
  max: 50,
  value: 2,
  step: 1,
  unit: 'px',
  onChange: (value, valueWithUnit) => {
    console.log('Value changed:', value); // "2"
    console.log('With unit:', valueWithUnit); // "2px"
    glassElement.style.setProperty('--blur', valueWithUnit);
  }
});

// Append to DOM
document.getElementById('controls-content').appendChild(blurSlider);
```

**Public API:**
```javascript
blurSlider.getValue()           // Returns current value
blurSlider.setValue(10)         // Sets value programmatically
blurSlider.getInput()           // Returns input element
blurSlider.getDisplay()         // Returns value display element
```

**Parameters:**
- `id` (string, required) - Unique identifier
- `label` (string, required) - Display label
- `min` (number, default: 0) - Minimum value
- `max` (number, default: 100) - Maximum value
- `value` (number, default: 50) - Initial value
- `step` (number, default: 1) - Step increment
- `unit` (string, default: '') - Unit suffix
- `onChange` (function) - Callback: `(value, valueWithUnit) => {}`

---

### 2. createSegmentedControl

Creates a segmented control (mutually exclusive button group).

**Import:**
```javascript
import { createSegmentedControl } from './components/createSegmentedControl.js';
```

**Usage:**
```javascript
const intensityControl = createSegmentedControl({
  id: 'intensity-control',
  label: 'Liquid Distortion',
  options: ['Low', 'Medium', 'High'],
  selectedIndex: 2, // Start with 'High' selected
  onChange: (value, index, element) => {
    console.log('Selected:', value);      // "high"
    console.log('Index:', index);         // 2
    console.log('Button:', element);      // HTMLButtonElement
    filterManager.setIntensity(value);
  }
});

document.getElementById('controls-content').appendChild(intensityControl);
```

**Public API:**
```javascript
intensityControl.getValue()              // Returns current value (lowercase)
intensityControl.getSelectedIndex()      // Returns selected index
intensityControl.setSelectedIndex(1)     // Select by index
intensityControl.setSelectedValue('low') // Select by value (case-insensitive)
intensityControl.getButtons()            // Returns array of button elements
```

**Parameters:**
- `id` (string, required) - Unique identifier
- `label` (string, required) - Display label
- `options` (array, required) - Array of option labels
- `selectedIndex` (number, default: 0) - Initially selected index
- `onChange` (function) - Callback: `(value, index, element) => {}`

---

### 3. createButton

Creates a standard button.

**Import:**
```javascript
import { createButton } from './components/createButton.js';
```

**Usage:**
```javascript
const randomizeBtn = createButton({
  id: 'randomize-btn',
  text: 'Shuffle parameters',
  className: 'primary-btn', // Optional
  onClick: () => {
    console.log('Button clicked!');
    randomizeProperties();
  }
});

document.getElementById('controls-footer').appendChild(randomizeBtn);
```

**Public API:**
```javascript
randomizeBtn.setText('New Text')    // Update button text
randomizeBtn.setEnabled(false)      // Disable button
randomizeBtn.setEnabled(true)       // Enable button
```

**Parameters:**
- `id` (string, required) - Unique identifier
- `text` (string, required) - Button text
- `className` (string, optional) - Additional CSS class
- `onClick` (function, required) - Click handler

---

### 4. createIconButton

Creates an icon-only button (for play/pause style controls).

**Import:**
```javascript
import { createIconButton } from './components/createButton.js';
```

**Usage:**
```javascript
const playBtn = createIconButton({
  id: 'anim-play',
  iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>`,
  title: 'Play',
  ariaLabel: 'Play animation',
  active: true, // Start as active
  onClick: () => {
    animationController.play();
  }
});
```

**Public API:**
```javascript
playBtn.setActive(true)      // Set as active
playBtn.setActive(false)     // Remove active state
playBtn.isActive()           // Returns boolean
```

**Parameters:**
- `id` (string, required) - Unique identifier
- `iconSvg` (string, required) - SVG markup
- `title` (string) - Tooltip text
- `ariaLabel` (string) - Accessibility label
- `active` (boolean, default: false) - Initial active state
- `onClick` (function) - Click handler

---

### 5. createIconToggle

Creates a container for mutually exclusive icon buttons.

**Import:**
```javascript
import { createIconToggle } from './components/createButton.js';
```

**Usage:**
```javascript
const animControls = createIconToggle({
  buttons: [
    {
      id: 'anim-play',
      iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>`,
      title: 'Play',
      ariaLabel: 'Play animation',
      active: true,
      onClick: () => animationController.play()
    },
    {
      id: 'anim-pause',
      iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z"/>
                </svg>`,
      title: 'Pause',
      ariaLabel: 'Pause animation',
      onClick: () => animationController.pause()
    }
  ],
  onChange: (activeButton, index) => {
    console.log('Active button changed:', activeButton, index);
  }
});
```

**Public API:**
```javascript
animControls.setActiveButton(0)     // Activate button by index
animControls.getButtons()           // Returns array of buttons
```

**Parameters:**
- `buttons` (array, required) - Array of button configs (see createIconButton)
- `onChange` (function) - Callback: `(activeButton, index) => {}`

---

## Complete Example: Dynamic Controls

Here's how to build a complete control panel dynamically:

```javascript
import {
  createRangeSlider,
  createSegmentedControl,
  createButton,
  createIconToggle
} from './components/index.js';

// Container
const controlsContent = document.getElementById('controls-content');

// 1. Range sliders
const sliders = [
  { id: 'blur', label: 'Blur', min: 0, max: 50, value: 2, step: 1, unit: 'px' },
  { id: 'saturation', label: 'Saturation', min: 50, max: 300, value: 180, step: 10, unit: '%' },
  { id: 'brightness', label: 'Brightness', min: 50, max: 200, value: 110, step: 5, unit: '%' }
];

sliders.forEach(config => {
  const slider = createRangeSlider({
    ...config,
    onChange: (value, valueWithUnit) => {
      glassElement.style.setProperty(`--${config.id}`, valueWithUnit);
    }
  });
  controlsContent.appendChild(slider);
});

// 2. Separator
const hr = document.createElement('hr');
hr.style.opacity = '0.2';
controlsContent.appendChild(hr);

// 3. Segmented control
const intensityControl = createSegmentedControl({
  id: 'intensity',
  label: 'Liquid Distortion',
  options: ['Low', 'Medium', 'High'],
  selectedIndex: 2,
  onChange: (value) => {
    filterManager.setIntensity(value);
  }
});
controlsContent.appendChild(intensityControl);

// 4. Another separator
controlsContent.appendChild(hr.cloneNode());

// 5. Randomize button
const randomizeBtn = createButton({
  id: 'randomize-btn',
  text: 'Shuffle parameters',
  onClick: () => {
    sliders.forEach(slider => {
      const randomValue = Math.random() * (slider.max - slider.min) + slider.min;
      slider.setValue(Math.floor(randomValue));
    });
  }
});
controlsContent.appendChild(randomizeBtn);
```

## Benefits

1. **Consistency** - All components follow the same pattern
2. **Reusability** - Use across different parts of the app
3. **Maintainability** - Update component logic in one place
4. **Type Safety** - Clear parameter expectations (can add JSDoc)
5. **Testability** - Easy to test in isolation
6. **No Framework** - Pure vanilla JavaScript

## Best Practices

1. Always provide required parameters
2. Use meaningful IDs (unique across the app)
3. Keep onChange handlers simple (delegate to modules)
4. Cache component references if you need to update them later
5. Use the public API instead of directly manipulating DOM

## Migration Path

To migrate existing HTML controls to factory functions:

**Before:**
```html
<div class="control-group">
  <label>Blur</label>
  <input type="range" id="blur" min="0" max="50" value="2" step="1">
  <span class="value" id="blur-value">2px</span>
</div>
```

**After:**
```javascript
const blurSlider = createRangeSlider({
  id: 'blur',
  label: 'Blur',
  min: 0,
  max: 50,
  value: 2,
  step: 1,
  unit: 'px',
  onChange: (value, valueWithUnit) => {
    glassElement.style.setProperty('--blur', valueWithUnit);
  }
});

container.appendChild(blurSlider);
```
