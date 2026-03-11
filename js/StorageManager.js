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
        // Could emit an event or call a callback here for UI notification
      } 
      // Handle SecurityError
      else if (error.name === 'SecurityError') {
        console.error('Local Storage access denied (possibly private browsing mode).');
      } 
      // Handle other errors
      else {
        console.error(`Error writing to Local Storage (key: "${key}"):`, error);
      }
      return false;
    }
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
