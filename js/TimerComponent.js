/**
 * TimerComponent
 * Manages a countdown timer with start, stop, and reset controls.
 * Default duration is 25 minutes (1500 seconds) for Pomodoro-style focus sessions.
 */
class TimerComponent {
  constructor(containerElement) {
    this.container = containerElement;
    this.duration = 1500; // 25 minutes in seconds
    this.remaining = 1500;
    this.state = 'idle'; // 'idle' | 'running' | 'paused' | 'complete'
    this.intervalId = null;
    this.animationFrameId = null;
    this.startTime = null;
    this.lastRenderTime = 0;
  }

  /**
   * Initialize timer with default duration (25 minutes)
   */
  init() {
    if (!this.container) {
      console.error('TimerComponent: Container element not found');
      return;
    }

    // Set default duration
    this.duration = 1500;
    this.remaining = 1500;
    this.state = 'idle';

    // Initial render
    this.render();
  }

  /**
   * Start countdown
   */
  start() {
    // Ignore if already running
    if (this.state === 'running') {
      return;
    }

    // Can't start if complete, must reset first
    if (this.state === 'complete') {
      return;
    }

    this.state = 'running';
    this.startTime = Date.now();

    // Start interval to tick every second
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    // Use requestAnimationFrame for smooth rendering
    this.scheduleRender();

    this.render();
  }

  /**
   * Schedule render using requestAnimationFrame for smooth updates
   */
  scheduleRender() {
    if (this.state === 'running') {
      this.animationFrameId = requestAnimationFrame(() => {
        const now = Date.now();
        // Throttle renders to ~60fps (16ms between frames)
        if (now - this.lastRenderTime >= 16) {
          this.render();
          this.lastRenderTime = now;
        }
        this.scheduleRender();
      });
    }
  }

  /**
   * Cancel scheduled render
   */
  cancelRender() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Stop/pause countdown
   */
  stop() {
    console.log('TimerComponent: stop() called, current state:', this.state);
    
    // Ignore if not running
    if (this.state !== 'running') {
      console.log('TimerComponent: stop() ignored - timer not running');
      return;
    }

    this.state = 'paused';

    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Cancel animation frame
    this.cancelRender();

    console.log('TimerComponent: Timer stopped/paused');
    this.render();
  }

  /**
   * Reset to initial duration
   */
  reset() {
    console.log('TimerComponent: reset() called, current state:', this.state);
    
    // Stop timer if running
    if (this.state === 'running') {
      this.stop();
    }

    // Reset to initial state
    this.remaining = this.duration;
    this.state = 'idle';
    this.startTime = null;

    console.log('TimerComponent: Timer reset to', this.duration, 'seconds');
    this.render();
  }

  /**
   * Update display (called every second while running)
   */
  tick() {
    if (this.state !== 'running') {
      return;
    }

    // Decrease remaining time
    this.remaining--;

    // Check if timer completed
    if (this.remaining <= 0) {
      this.remaining = 0;
      this.onComplete();
    }

    this.render();
  }

  /**
   * Handle timer completion
   */
  onComplete() {
    this.state = 'complete';

    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Cancel animation frame
    this.cancelRender();

    this.render();
  }

  /**
   * Format seconds as MM:SS
   * @param {number} seconds - Seconds to format
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const minutesStr = String(minutes).padStart(2, '0');
    const secsStr = String(secs).padStart(2, '0');

    return `${minutesStr}:${secsStr}`;
  }

  /**
   * Render timer display and controls
   */
  render() {
    if (!this.container) {
      return;
    }

    const timeDisplay = this.formatTime(this.remaining);
    const stateClass = `timer-${this.state}`;

    this.container.innerHTML = `
      <div class="timer ${stateClass}">
        <div class="timer-display">${timeDisplay}</div>
        <div class="timer-controls">
          <button class="timer-btn timer-start" ${this.state === 'running' || this.state === 'complete' ? 'disabled' : ''}>Start</button>
          <button class="timer-btn timer-stop" ${this.state !== 'running' ? 'disabled' : ''}>Stop</button>
          <button class="timer-btn timer-reset">Reset</button>
        </div>
        ${this.state === 'complete' ? '<div class="timer-complete-message">Time\'s up!</div>' : ''}
      </div>
    `;

    // Attach event listeners
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to timer controls
   */
  attachEventListeners() {
    const startBtn = this.container.querySelector('.timer-start');
    const stopBtn = this.container.querySelector('.timer-stop');
    const resetBtn = this.container.querySelector('.timer-reset');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('TimerComponent: Start button clicked');
        this.start();
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        console.log('TimerComponent: Stop button clicked');
        this.stop();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        console.log('TimerComponent: Reset button clicked');
        this.reset();
      });
    }
    
    console.log('TimerComponent: Event listeners attached', {
      startBtn: !!startBtn,
      stopBtn: !!stopBtn,
      resetBtn: !!resetBtn
    });
  }

  /**
   * Cleanup intervals on destroy
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.cancelRender();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimerComponent;
}
