/**
 * Configuration file for API keys and settings
 *
 * Environment variables are loaded from .env file
 * Add your API key to .env file (not committed to git)
 */

export const CONFIG = {
  // Unsplash API configuration
  UNSPLASH_ACCESS_KEY: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  UNSPLASH_API_URL: 'https://api.unsplash.com',

  // Default settings
  DEFAULT_SEARCH_QUERY: 'nature',
  IMAGE_QUALITY: 'regular' // Options: raw, full, regular, small, thumb
};
