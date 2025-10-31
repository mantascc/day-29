/**
 * Creates a standard button element
 * @param {Object} config - Configuration object
 * @param {string} config.id - Unique identifier
 * @param {string} config.text - Button text
 * @param {string} config.className - Additional CSS class (optional)
 * @param {Function} config.onClick - Click handler function
 * @returns {HTMLElement} The button element
 */
export function createButton(config) {
  const {
    id,
    text,
    className = '',
    onClick = null
  } = config;

  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;

  if (className) {
    button.className = className;
  }

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Expose public API
  button.setText = (newText) => {
    button.textContent = newText;
  };

  button.setEnabled = (enabled) => {
    button.disabled = !enabled;
  };

  return button;
}

/**
 * Creates an icon button element
 * @param {Object} config - Configuration object
 * @param {string} config.id - Unique identifier
 * @param {string} config.iconSvg - SVG markup for the icon
 * @param {string} config.title - Tooltip text
 * @param {string} config.ariaLabel - Accessibility label
 * @param {boolean} config.active - Whether button starts active
 * @param {Function} config.onClick - Click handler function
 * @returns {HTMLElement} The icon button element
 */
export function createIconButton(config) {
  const {
    id,
    iconSvg,
    title = '',
    ariaLabel = '',
    active = false,
    onClick = null
  } = config;

  const button = document.createElement('button');
  button.id = id;
  button.className = `icon-btn${active ? ' active' : ''}`;
  button.title = title;
  button.setAttribute('aria-label', ariaLabel);
  button.innerHTML = iconSvg;

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  // Expose public API
  button.setActive = (isActive) => {
    button.classList.toggle('active', isActive);
  };

  button.isActive = () => {
    return button.classList.contains('active');
  };

  return button;
}

/**
 * Creates a container for icon toggle buttons (play/pause style)
 * @param {Object} config - Configuration object
 * @param {Array<Object>} config.buttons - Array of button configs
 * @param {Function} config.onChange - Callback when selection changes
 * @returns {HTMLElement} The icon toggle container
 */
export function createIconToggle(config) {
  const {
    buttons = [],
    onChange = null
  } = config;

  const container = document.createElement('div');
  container.className = 'icon-toggle';
  container.setAttribute('aria-label', 'Animation controls');

  const buttonElements = buttons.map((btnConfig) => {
    const btn = createIconButton({
      ...btnConfig,
      onClick: () => {
        setActiveButton(btn);
        if (btnConfig.onClick) {
          btnConfig.onClick();
        }
      }
    });

    container.appendChild(btn);
    return btn;
  });

  function setActiveButton(activeBtn) {
    buttonElements.forEach(btn => {
      btn.setActive(btn === activeBtn);
    });

    if (onChange) {
      const index = buttonElements.indexOf(activeBtn);
      onChange(activeBtn, index);
    }
  }

  // Expose public API
  container.setActiveButton = (index) => {
    if (buttonElements[index]) {
      setActiveButton(buttonElements[index]);
    }
  };

  container.getButtons = () => buttonElements;

  return container;
}
