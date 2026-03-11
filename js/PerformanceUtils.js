/**
 * PerformanceUtils - Utility functions for performance optimization
 * Provides debouncing, throttling, and other performance helpers
 */
class PerformanceUtils {
  /**
   * Debounce a function to limit how often it can be called
   * @param {Function} func - Function to debounce
   * @param {number} wait - Milliseconds to wait before calling function
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle a function to limit how often it can be called
   * @param {Function} func - Function to throttle
   * @param {number} limit - Minimum milliseconds between calls
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Schedule a function to run on the next animation frame
   * @param {Function} func - Function to schedule
   * @returns {number} Request ID that can be used to cancel
   */
  static scheduleAnimationFrame(func) {
    return requestAnimationFrame(func);
  }

  /**
   * Cancel a scheduled animation frame
   * @param {number} id - Request ID from scheduleAnimationFrame
   */
  static cancelAnimationFrame(id) {
    cancelAnimationFrame(id);
  }

  /**
   * Batch DOM updates using DocumentFragment for better performance
   * @param {HTMLElement} container - Container to append elements to
   * @param {Array<HTMLElement>} elements - Elements to append
   */
  static batchDOMUpdates(container, elements) {
    const fragment = document.createDocumentFragment();
    elements.forEach(element => fragment.appendChild(element));
    container.appendChild(fragment);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceUtils;
}
