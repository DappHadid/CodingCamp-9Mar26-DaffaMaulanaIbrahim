/**
 * StorageManager - Centralized interface for Local Storage operations
 * Handles error conditions, JSON serialization, and provides fallback behavior
 */
class StorageManager {
  /**
   * Get data from Local Storage with fallback
   * @param {string} key - Storage key to retrieve
   * @param {*} defaultValue - Value to return if key doesn't exist or error occurs
   * @returns {*} Retrieved value or defaultValue
   */
  static get(key, defaultValue = null) {
    try {
      // Check if Local Storage is available
      if (!this.isAvailable()) {
        console.warn('Local Storage is not available');
        return defaultValue;
      }

      const item = localStorage.getItem(key);
      
      // Return default if key doesn't exist
      if (item === null) {
        return defaultValue;
      }

      // Parse JSON data
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // Handle corrupted data
        console.error(`Data corruption detected for key "${key}":`, parseError);
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.warning(
            'Some saved data was corrupted and has been reset. Starting fresh.',
            6000
          );
        }
        // Clear corrupted data
        this.remove(key);
        return defaultValue;
      }
    } catch (error) {
      // Handle SecurityError or other access errors
      console.error(`Error reading from Local Storage (key: "${key}"):`, error);
      return defaultValue;
    }
  }

  /**
   * Save data to Local Storage with error handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON serialized)
   * @returns {boolean} True if successful, false otherwise
   */
  static set(key, value) {
    try {
      // Check if Local Storage is available
      if (!this.isAvailable()) {
        console.warn('Local Storage is not available');
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.warning(
            'Unable to save data. Your browser may be in private browsing mode or Local Storage is disabled.',
            7000
          );
        }
        return false;
      }

      // Serialize to JSON
      const serialized = JSON.stringify(value);
      
      // Save to Local Storage
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // Handle QuotaExceededError
      if (error.name === 'QuotaExceededError') {
        console.error('Local Storage quota exceeded. Consider deleting old data.');
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.error(
            'Storage limit reached! Please delete some tasks or quick links to free up space.',
            10000
          );
        }
      } 
      // Handle SecurityError
      else if (error.name === 'SecurityError') {
        console.error('Local Storage access denied (possibly private browsing mode).');
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.error(
            'Cannot access storage. Your browser settings may be blocking data storage.',
            7000
          );
        }
      } 
      // Handle other errors
      else {
        console.error(`Error writing to Local Storage (key: "${key}"):`, error);
        if (typeof NotificationManager !== 'undefined') {
          NotificationManager.error(
            'Failed to save data. Please try again.',
            5000
          );
        }
      }
      return false;
    }
  }

  /**
   * Save data to Local Storage asynchronously (non-blocking)
   * Uses setTimeout to defer the operation to the next event loop tick
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON serialized)
   * @returns {Promise<boolean>} Promise that resolves to true if successful, false otherwise
   */
  static setAsync(key, value) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.set(key, value);
        resolve(result);
      }, 0);
    });
  }

  /**
   * Remove data from Local Storage
   * @param {string} key - Storage key to remove
   * @returns {boolean} True if successful, false otherwise
   */
  static remove(key) {
    try {
      // Check if Local Storage is available
      if (!this.isAvailable()) {
        console.warn('Local Storage is not available');
        return false;
      }

      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from Local Storage (key: "${key}"):`, error);
      return false;
    }
  }

  /**
   * Clear all application data from Local Storage
   * @returns {boolean} True if successful, false otherwise
   */
  static clear() {
    try {
      // Check if Local Storage is available
      if (!this.isAvailable()) {
        console.warn('Local Storage is not available');
        return false;
      }

      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing Local Storage:', error);
      return false;
    }
  }

  /**
   * Check if Local Storage is available
   * @returns {boolean} True if available, false otherwise
   */
  static isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
