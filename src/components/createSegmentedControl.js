/**
 * Creates a segmented control (button group) with mutually exclusive selection
 * @param {Object} config - Configuration object
 * @param {string} config.id - Unique identifier
 * @param {string} config.label - Display label text
 * @param {Array<string>} config.options - Array of option labels
 * @param {number} config.selectedIndex - Initially selected index (default: 0)
 * @param {Function} config.onChange - Callback function(value, index, element)
 * @returns {HTMLElement} The control group element
 */
export function createSegmentedControl(config) {
  const {
    id,
    label,
    options = [],
    selectedIndex = 0,
    onChange = null
  } = config;

  // Create container
  const container = document.createElement('div');
  container.className = 'control-group';

  // Create label
  const labelElement = document.createElement('label');
  labelElement.textContent = label;

  // Create button group container
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'intensity-group';
  buttonGroup.id = id;

  // Create buttons
  const buttons = options.map((option, index) => {
    const button = document.createElement('button');
    button.className = 'intensity-btn';
    button.textContent = option;
    button.dataset.index = index;
    button.dataset.value = option.toLowerCase();

    if (index === selectedIndex) {
      button.classList.add('active');
    }

    // Click handler
    button.addEventListener('click', () => {
      setActiveButton(index);
    });

    return button;
  });

  // Append buttons to group
  buttons.forEach(btn => buttonGroup.appendChild(btn));

  // Assemble
  container.appendChild(labelElement);
  container.appendChild(buttonGroup);

  // Helper to set active button
  function setActiveButton(index) {
    buttons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    if (onChange) {
      const value = options[index]?.toLowerCase();
      onChange(value, index, buttons[index]);
    }
  }

  // Expose public API
  container.getValue = () => {
    const activeBtn = buttons.find(btn => btn.classList.contains('active'));
    return activeBtn ? activeBtn.dataset.value : null;
  };

  container.getSelectedIndex = () => {
    return buttons.findIndex(btn => btn.classList.contains('active'));
  };

  container.setSelectedIndex = (index) => {
    setActiveButton(index);
  };

  container.setSelectedValue = (value) => {
    const index = options.findIndex(opt => opt.toLowerCase() === value.toLowerCase());
    if (index !== -1) {
      setActiveButton(index);
    }
  };

  container.getButtons = () => buttons;

  return container;
}
