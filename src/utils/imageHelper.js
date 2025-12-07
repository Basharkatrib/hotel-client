/**
 * Get full image URL from API path
 * @param {string} imagePath - Image path from API (e.g., "hotels/01KBMBSAK95VCYFZ4K15C5PTBW.jpg")
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
  }
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, construct the full URL
  return `https://hotel-server.test/storage/${imagePath}`;
};

/**
 * Get multiple image URLs from API paths
 * @param {Array<string>} images - Array of image paths from API
 * @returns {Array<string>} Array of full image URLs
 */
export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'];
  }
  
  return images.map(getImageUrl);
};

