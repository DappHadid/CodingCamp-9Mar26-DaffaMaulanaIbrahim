/**
 * app.js - Main application entry point
 * Orchestrates component initialization and lifecycle management
 */

// Component instances
let greetingComponent = null;
let timerComponent = null;
let taskListComponent = null;
let quickLinksComponent = null;

/**
 * Initialize the application
 * Sets up all components and handles errors
 */
function initializeApp() {
  try {
    // Initialize theme first (before any components render)
    console.log('Initializing ThemeManager...');
    ThemeManager.init();
    console.log('ThemeManager initialized');
    
    // Run browser compatibility checks
    const compatibilityReport = BrowserCompatibility.initialize();
    
    // Continue with initialization even if not fully compatible
    // (warnings will be displayed to the user)
    
    // Get container elements
    const greetingContainer = document.getElementById('greeting-container');
    const timerContainer = document.getElementById('timer-container');
    const taskListContainer = document.getElementById('tasklist-container');
    const quickLinksContainer = document.getElementById('quicklinks-container');

    // Validate containers exist
    if (!greetingContainer) {
      console.error('App initialization error: greeting-container element not found');
    }
    if (!timerContainer) {
      console.error('App initialization error: timer-container element not found');
    }
    if (!taskListContainer) {
      console.error('App initialization error: tasklist-container element not found');
    }
    if (!quickLinksContainer) {
      console.error('App initialization error: quicklinks-container element not found');
    }

    // Initialize GreetingComponent
    if (greetingContainer) {
      greetingComponent = new GreetingComponent(greetingContainer);
      greetingComponent.init();
    }

    // Initialize TimerComponent
    if (timerContainer) {
      timerComponent = new TimerComponent(timerContainer);
      timerComponent.init();
    }

    // Initialize TaskListComponent
    if (taskListContainer) {
      taskListComponent = new TaskListComponent(taskListContainer);
      taskListComponent.init();
    }

    // Initialize QuickLinksComponent
    if (quickLinksContainer) {
      quickLinksComponent = new QuickLinksComponent(quickLinksContainer);
      quickLinksComponent.init();
    }

    // Add theme toggle button to header
    const header = document.querySelector('.dashboard-header');
    if (header) {
      console.log('Creating theme toggle button...');
      ThemeManager.createToggleButton(header);
      console.log('Theme toggle button created');
    } else {
      console.error('Dashboard header not found - cannot create theme toggle button');
    }

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Fatal error during application initialization:', error);
  }
}

/**
 * Cleanup and destroy all components
 * Called on page unload to prevent memory leaks
 */
function destroyApp() {
  try {
    if (greetingComponent && typeof greetingComponent.destroy === 'function') {
      greetingComponent.destroy();
    }
    if (timerComponent && typeof timerComponent.destroy === 'function') {
      timerComponent.destroy();
    }
    // TaskListComponent and QuickLinksComponent don't have destroy methods
    // as they don't use intervals or need cleanup

    console.log('Application cleanup completed');
  } catch (error) {
    console.error('Error during application cleanup:', error);
  }
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', initializeApp);

// Cleanup on page unload
window.addEventListener('beforeunload', destroyApp);
