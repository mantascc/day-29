/**
 * Creates a range slider control with label and value display
 * @param {Object} config - Configuration object
 * @param {string} config.id - Unique identifier for the slider
 * @param {string} config.label - Display label text
 * @param {number} config.min - Minimum value
 * @param {number} config.max - Maximum value
 * @param {number} config.value - Initial value
 * @param {number} config.step - Step increment
 * @param {string} config.unit - Unit suffix (e.g., 'px', '%', 'deg')
 * @param {Function} config.onChange - Callback function(value, valueWithUnit)
 * @returns {HTMLElement} The control group element
 */
export function createRangeSlider(config) {
  const {
    id,
    label,
    min = 0,
    max = 100,
    value = 50,
    step = 1,
    unit = '',
    onChange = null
  } = config;

  // Create container
  const container = document.createElement('div');
  container.className = 'control-group';

  // Create label row (label + value on same line)
  const labelRow = document.createElement('div');
  labelRow.className = 'label-row';

  const labelElement = document.createElement('label');
  labelElement.textContent = label;

  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'value';
  valueDisplay.id = `${id}-value`;
  valueDisplay.textContent = value + unit;

  labelRow.appendChild(labelElement);
  labelRow.appendChild(valueDisplay);

  // Create input
  const input = document.createElement('input');
  input.type = 'range';
  input.id = id;
  input.min = min;
  input.max = max;
  input.value = value;
  input.step = step;

  // Assemble
  container.appendChild(labelRow);
  container.appendChild(input);

  // Add event listener
  input.addEventListener('input', (e) => {
    const val = e.target.value;
    const valueWithUnit = val + unit;
    valueDisplay.textContent = valueWithUnit;

    if (onChange) {
      onChange(val, valueWithUnit);
    }
  });

  // Expose public API
  container.getValue = () => input.value;
  container.setValue = (newValue) => {
    input.value = newValue;
    valueDisplay.textContent = newValue + unit;
  };
  container.getInput = () => input;
  container.getDisplay = () => valueDisplay;

  return container;
}
