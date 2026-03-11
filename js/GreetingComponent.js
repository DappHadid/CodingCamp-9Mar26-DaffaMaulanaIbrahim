/**
 * GreetingComponent
 * Displays current time, date, and time-based greeting message.
 * Updates every second to keep time display current.
 */
class GreetingComponent {
  constructor(containerElement) {
    this.container = containerElement;
    this.intervalId = null;
    this.lastUpdateTime = 0;
    
    // Throttle DOM updates to once per second max
    this.throttledUpdate = PerformanceUtils.throttle(() => {
      this.updateTime();
    }, 1000);
  }

  /**
   * Initialize component and start clock updates
   */
  init() {
    if (!this.container) {
      console.error('GreetingComponent: Container element not found');
      return;
    }

    // Initial update
    this.updateTime();

    // Update every second
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  /**
   * Update time display (called every second)
   */
  updateTime() {
    const now = new Date();
    const hour = now.getHours();

    const timeStr = this.formatTime(now);
    const dateStr = this.formatDate(now);
    const greeting = this.getGreeting(hour);

    // Update DOM
    this.container.innerHTML = `
      <div class="greeting-message">${greeting}</div>
      <div class="time-display">${timeStr}</div>
      <div class="date-display">${dateStr}</div>
    `;
  }

  /**
   * Get greeting based on current hour
   * @param {number} hour - Hour in 24-hour format (0-23)
   * @returns {string} Greeting message
   */
  getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  }

  /**
   * Format time for display
   * @param {Date} date - Date object to format
   * @returns {string} Formatted time string (12-hour format with AM/PM)
   */
  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    // Pad with zeros
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  }

  /**
   * Format date for display
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string (Day of week, Month Day)
   */
  formatDate(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${dayOfWeek}, ${month} ${day}`;
  }

  /**
   * Cleanup intervals on destroy
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
