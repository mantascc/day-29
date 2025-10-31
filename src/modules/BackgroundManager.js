/**
 * BackgroundManager
 * Manages local background images and shuffling
 */
export class BackgroundManager {
  constructor(images = []) {
    // Default to images in /backgrounds/ folder
    // Users can add more images to this array
    // Using relative paths (without leading /) for GitHub Pages compatibility
    this.images = images.length > 0 ? images : [
      'backgrounds/1.avif',
      'backgrounds/2.jpg',
      'backgrounds/3.jpg',
      'backgrounds/4.jpg'
    ];

    this.currentIndex = -1;
    this.lastShuffledIndexes = [];
  }

  /**
   * Get next random image (avoids immediate repeats)
   * @returns {string} Image path
   */
  getRandomImage() {
    if (this.images.length === 0) {
      console.warn('No background images available');
      return null;
    }

    if (this.images.length === 1) {
      return this.images[0];
    }

    // Get available indexes (exclude recently used ones)
    const recentlyUsedCount = Math.min(3, Math.floor(this.images.length / 2));
    const availableIndexes = this.images
      .map((_, index) => index)
      .filter(index => !this.lastShuffledIndexes.slice(-recentlyUsedCount).includes(index));

    // If all indexes are in recent history, reset and allow any
    const candidates = availableIndexes.length > 0 ? availableIndexes :
      this.images.map((_, index) => index);

    // Pick random from candidates
    const randomIndex = candidates[Math.floor(Math.random() * candidates.length)];

    // Track this index
    this.lastShuffledIndexes.push(randomIndex);
    this.currentIndex = randomIndex;

    return this.images[randomIndex];
  }

  /**
   * Apply background image to element
   * @param {HTMLElement} element - Element to apply background to
   * @param {string} imagePath - Path to image
   */
  applyBackground(element, imagePath) {
    if (!element) {
      console.warn('No element provided to applyBackground');
      return;
    }

    if (!imagePath) {
      console.warn('No image path provided');
      return;
    }

    element.style.backgroundImage = `url('${imagePath}')`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
  }

  /**
   * Shuffle to random background
   * @param {HTMLElement} element - Element to apply background to
   * @returns {string} The applied image path
   */
  shuffle(element) {
    const imagePath = this.getRandomImage();
    if (imagePath) {
      this.applyBackground(element, imagePath);
    }
    return imagePath;
  }

  /**
   * Add new image path to collection
   * @param {string} imagePath - Path to image
   */
  addImage(imagePath) {
    if (!this.images.includes(imagePath)) {
      this.images.push(imagePath);
    }
  }

  /**
   * Get all available images
   * @returns {string[]} Array of image paths
   */
  getImages() {
    return [...this.images];
  }
}
