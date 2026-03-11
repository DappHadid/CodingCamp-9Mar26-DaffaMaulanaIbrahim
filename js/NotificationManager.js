/**
 * NotificationManager - Displays user-facing notifications
 * Handles error messages, warnings, and success messages
 */
class NotificationManager {
  /**
   * Show a notification to the user
   * @param {string} message - Message to display
   * @param {string} type - Notification type: 'error', 'warning', 'success', 'info'
   * @param {number} duration - Duration in milliseconds (0 = persistent)
   */
  static show(message, type = 'info', duration = 5000) {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.addEventListener('click', () => {
      this.remove(notification);
    });
    notification.appendChild(closeBtn);

    // Add to container
    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('notification-show');
    }, 10);

    // Auto-remove after duration (if not persistent)
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  /**
   * Remove a notification
   * @param {HTMLElement} notification - Notification element to remove
   */
  static remove(notification) {
    notification.classList.remove('notification-show');
    notification.classList.add('notification-hide');

    // Remove from DOM after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  /**
   * Show error notification
   * @param {string} message - Error message
   * @param {number} duration - Duration in milliseconds
   */
  static error(message, duration = 7000) {
    return this.show(message, 'error', duration);
  }

  /**
   * Show warning notification
   * @param {string} message - Warning message
   * @param {number} duration - Duration in milliseconds
   */
  static warning(message, duration = 5000) {
    return this.show(message, 'warning', duration);
  }

  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {number} duration - Duration in milliseconds
   */
  static success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  /**
   * Show info notification
   * @param {string} message - Info message
   * @param {number} duration - Duration in milliseconds
   */
  static info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Clear all notifications
   */
  static clearAll() {
    const container = document.getElementById('notification-container');
    if (container) {
      container.innerHTML = '';
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationManager;
}
