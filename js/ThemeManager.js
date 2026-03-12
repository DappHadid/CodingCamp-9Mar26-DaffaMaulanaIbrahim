/**
 * ThemeManager - Manages light/dark theme switching
 * Persists theme preference to Local Storage
 */
class ThemeManager {
  /**
   * Initialize theme manager
   */
  static init() {
    try {
      // Load saved theme or default to light
      const savedTheme = StorageManager.get('theme', 'light');
      console.log('ThemeManager: Loading saved theme:', savedTheme);
      this.setTheme(savedTheme, false);
      console.log('ThemeManager: Initialized successfully');
    } catch (error) {
      console.error('ThemeManager: Initialization error:', error);
      // Fallback to light theme
      this.setTheme('light', false);
    }
  }

  /**
   * Get current theme
   * @returns {string} 'light' or 'dark'
   */
  static getCurrentTheme() {
    return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  }

  /**
   * Set theme
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} save - Whether to save to storage (default: true)
   */
  static setTheme(theme, save = true) {
    try {
      console.log('ThemeManager: Setting theme to:', theme);
      
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }

      if (save) {
        const saved = StorageManager.set('theme', theme);
        console.log('ThemeManager: Theme saved to storage:', saved);
      }
    } catch (error) {
      console.error('ThemeManager: Error setting theme:', error);
    }
  }

  /**
   * Toggle between light and dark theme
   */
  static toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Create theme toggle button
   * @param {HTMLElement} container - Container to append button to
   * @returns {HTMLElement} Theme toggle button
   */
  static createToggleButton(container) {
    try {
      const button = document.createElement('button');
      button.className = 'theme-toggle-btn';
      button.setAttribute('aria-label', 'Toggle theme');
      
      const currentTheme = this.getCurrentTheme();
      button.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
      console.log('ThemeManager: Creating button with theme:', currentTheme);

      button.addEventListener('click', () => {
        const newTheme = this.toggleTheme();
        button.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
        console.log('ThemeManager: Toggled to:', newTheme);
      });

      container.appendChild(button);
      console.log('ThemeManager: Button created and appended');
      return button;
    } catch (error) {
      console.error('ThemeManager: Error creating toggle button:', error);
      return null;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
