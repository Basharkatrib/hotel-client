/**
 * Get full image URL from API path with optimization
 * @param {string} imagePath - Image path from API (e.g., "hotels/01KBMBSAK95VCYFZ4K15C5PTBW.jpg")
 * @param {Object} options - Optimization options
 * @param {number} options.width - Desired image width for optimization
 * @param {number} options.height - Desired image height for optimization
 * @param {number} options.quality - Image quality (1-100)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath, options = {}) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
  }
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construct the full URL
  const baseUrl = `http://localhost:8000${imagePath}`;
  
  // Add optimization parameters if backend supports them
  // Note: This requires backend support for image optimization
  // For now, return base URL
  return baseUrl;
};

/**
 * Get multiple image URLs from API paths - optimized
 * @param {Array<string>} images - Array of image paths from API
 * @param {Object} options - Optimization options
 * @returns {Array<string>} Array of full image URLs
 */
export const getImageUrls = (images, options = {}) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'];
  }
  
  // Limit images array to first 5 for performance
  const limitedImages = images.slice(0, 5);
  
  return limitedImages.map(img => getImageUrl(img, options));
};

