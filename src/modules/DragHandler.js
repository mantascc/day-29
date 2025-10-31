export class DragHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.isDragging = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;

    // Callbacks
    this.onDragStart = options.onDragStart || (() => {});
    this.onDrag = options.onDrag || (() => {});
    this.onDragEnd = options.onDragEnd || (() => {});

    // Bind methods
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  enable() {
    if (!this.element) {
      console.error('Cannot enable drag - element not found');
      return;
    }

    this.element.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  disable() {
    if (!this.element) return;

    this.element.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  reset() {
    this.currentX = 0;
    this.currentY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.updateTransform(0, 0);
  }

  getPosition() {
    return { x: this.xOffset, y: this.yOffset };
  }

  setPosition(x, y) {
    this.xOffset = x;
    this.yOffset = y;
    this.currentX = x;
    this.currentY = y;
    this.updateTransform(x, y);
  }

  handleMouseDown(e) {
    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;

    if (e.target === this.element || e.target.closest('.drag-handle')) {
      this.isDragging = true;
      this.element.style.cursor = 'grabbing';
      this.onDragStart(this.getPosition());
    }
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();

    this.currentX = e.clientX - this.initialX;
    this.currentY = e.clientY - this.initialY;

    this.xOffset = this.currentX;
    this.yOffset = this.currentY;

    this.updateTransform(this.currentX, this.currentY);
    this.onDrag(this.getPosition());
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;

    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.isDragging = false;
    this.element.style.cursor = 'move';
    this.onDragEnd(this.getPosition());
  }

  updateTransform(x, y) {
    if (!this.element) return;
    this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }
}
