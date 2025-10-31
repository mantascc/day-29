import { CONFIG } from '../config.js';

export class UnsplashManager {
  constructor(options = {}) {
    this.accessKey = options.accessKey || CONFIG.UNSPLASH_ACCESS_KEY;
    this.apiUrl = CONFIG.UNSPLASH_API_URL;
    this.imageQuality = options.imageQuality || CONFIG.IMAGE_QUALITY;

    // Callbacks
    this.onImageLoaded = options.onImageLoaded || (() => {});
    this.onError = options.onError || (() => {});
  }

  /**
   * Fetch a random photo by search query
   * @param {string} query - Search keyword (e.g., 'nature', 'ocean', 'mountain')
   * @returns {Promise<Object>} Photo data object
   */
  async fetchRandomPhoto(query) {
    if (!this.accessKey || this.accessKey === 'YOUR_ACCESS_KEY_HERE') {
      const error = 'Unsplash API key not configured. Please update src/config.js';
      console.error(error);
      this.onError(error);
      throw new Error(error);
    }

    const url = `${this.apiUrl}/photos/random?query=${encodeURIComponent(query)}&client_id=${this.accessKey}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Unsplash API key');
        } else if (response.status === 403) {
          throw new Error('Rate limit exceeded. Try again later.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatPhotoData(data);
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      this.onError(error.message);
      throw error;
    }
  }

  /**
   * Search for photos by keyword
   * @param {string} query - Search keyword
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Results per page (default: 10, max: 30)
   * @returns {Promise<Object>} Search results
   */
  async searchPhotos(query, page = 1, perPage = 10) {
    if (!this.accessKey || this.accessKey === 'YOUR_ACCESS_KEY_HERE') {
      throw new Error('Unsplash API key not configured');
    }

    const url = `${this.apiUrl}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${this.accessKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        total: data.total,
        totalPages: data.total_pages,
        results: data.results.map(photo => this.formatPhotoData(photo))
      };
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      this.onError(error.message);
      throw error;
    }
  }

  /**
   * Format photo data from API response
   * @param {Object} photo - Raw photo data from API
   * @returns {Object} Formatted photo data
   */
  formatPhotoData(photo) {
    return {
      id: photo.id,
      description: photo.description || photo.alt_description,
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb
      },
      author: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      links: {
        html: photo.links.html,
        download: photo.links.download
      },
      color: photo.color
    };
  }

  /**
   * Get the image URL based on configured quality
   * @param {Object} photoData - Formatted photo data
   * @returns {string} Image URL
   */
  getImageUrl(photoData) {
    return photoData.urls[this.imageQuality] || photoData.urls.regular;
  }

  /**
   * Apply background image to an element
   * @param {HTMLElement} element - Target element
   * @param {string} imageUrl - Image URL
   */
  applyBackground(element, imageUrl) {
    if (!element) {
      console.error('Target element not found');
      return;
    }

    element.style.backgroundImage = `url(${imageUrl})`;
    this.onImageLoaded(imageUrl);
  }

  /**
   * Fetch and apply random photo as background
   * @param {HTMLElement} element - Target element
   * @param {string} query - Search keyword
   */
  async setRandomBackground(element, query) {
    try {
      const photoData = await this.fetchRandomPhoto(query);
      const imageUrl = this.getImageUrl(photoData);
      this.applyBackground(element, imageUrl);
      return photoData;
    } catch (error) {
      console.error('Failed to set background:', error);
      throw error;
    }
  }
}
