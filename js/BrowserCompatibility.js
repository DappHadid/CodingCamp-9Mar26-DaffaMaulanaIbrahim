/**
 * BrowserCompatibility - Browser detection and feature compatibility checks
 * Ensures the application works correctly in Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
 */
class BrowserCompatibility {
  /**
   * Minimum supported browser versions
   */
  static MINIMUM_VERSIONS = {
    chrome: 90,
    firefox: 88,
    edge: 90,
    safari: 14
  };

  /**
   * Detect browser type and version
   * @returns {Object} Browser information {name, version, isSupported}
   */
  static detectBrowser() {
    const userAgent = navigator.userAgent;
    let browserName = 'unknown';
    let browserVersion = 0;

    // Detect Edge (must check before Chrome as Edge contains "Chrome" in UA)
    if (userAgent.indexOf('Edg/') > -1) {
      browserName = 'edge';
      const match = userAgent.match(/Edg\/(\d+)/);
      browserVersion = match ? parseInt(match[1], 10) : 0;
    }
    // Detect Chrome
    else if (userAgent.indexOf('Chrome/') > -1 && userAgent.indexOf('Edg/') === -1) {
      browserName = 'chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserVersion = match ? parseInt(match[1], 10) : 0;
    }
    // Detect Firefox
    else if (userAgent.indexOf('Firefox/') > -1) {
      browserName = 'firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserVersion = match ? parseInt(match[1], 10) : 0;
    }
    // Detect Safari (must check after Chrome/Edge as they contain "Safari" in UA)
    else if (userAgent.indexOf('Safari/') > -1 && userAgent.indexOf('Chrome') === -1 && userAgent.indexOf('Edg') === -1) {
      browserName = 'safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserVersion = match ? parseInt(match[1], 10) : 0;
    }

    const minimumVersion = this.MINIMUM_VERSIONS[browserName] || 0;
    const isSupported = browserVersion >= minimumVersion;

    return {
      name: browserName,
      version: browserVersion,
      minimumVersion: minimumVersion,
      isSupported: isSupported
    };
  }

  /**
   * Check if Local Storage API is available
   * @returns {Object} {available, error}
   */
  static checkLocalStorage() {
    try {
      if (typeof localStorage === 'undefined') {
        return {
          available: false,
          error: 'Local Storage API is not available in this browser'
        };
      }

      // Test read/write access
      const testKey = '__ls_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);

      return {
        available: true,
        error: null
      };
    } catch (error) {
      let errorMessage = 'Local Storage is not accessible';
      
      if (error.name === 'SecurityError') {
        errorMessage = 'Local Storage is blocked (possibly private browsing mode)';
      } else if (error.name === 'QuotaExceededError') {
        errorMessage = 'Local Storage quota exceeded';
      }

      return {
        available: false,
        error: errorMessage
      };
    }
  }

  /**
   * Check if required JavaScript APIs are available
   * @returns {Object} {available, missing}
   */
  static checkRequiredAPIs() {
    const requiredAPIs = [
      { name: 'JSON', check: () => typeof JSON !== 'undefined' && typeof JSON.parse === 'function' && typeof JSON.stringify === 'function' },
      { name: 'Date', check: () => typeof Date !== 'undefined' },
      { name: 'Array.prototype.forEach', check: () => typeof Array.prototype.forEach === 'function' },
      { name: 'Array.prototype.map', check: () => typeof Array.prototype.map === 'function' },
      { name: 'Array.prototype.filter', check: () => typeof Array.prototype.filter === 'function' },
      { name: 'Array.prototype.find', check: () => typeof Array.prototype.find === 'function' },
      { name: 'Object.assign', check: () => typeof Object.assign === 'function' },
      { name: 'Promise', check: () => typeof Promise !== 'undefined' },
      { name: 'setInterval', check: () => typeof setInterval === 'function' },
      { name: 'setTimeout', check: () => typeof setTimeout === 'function' },
      { name: 'addEventListener', check: () => typeof document.addEventListener === 'function' },
      { name: 'querySelector', check: () => typeof document.querySelector === 'function' },
      { name: 'classList', check: () => {
        const testEl = document.createElement('div');
        return typeof testEl.classList !== 'undefined';
      }}
    ];

    const missing = [];
    
    for (const api of requiredAPIs) {
      try {
        if (!api.check()) {
          missing.push(api.name);
        }
      } catch (error) {
        missing.push(api.name);
      }
    }

    return {
      available: missing.length === 0,
      missing: missing
    };
  }

  /**
   * Run all compatibility checks
   * @returns {Object} Complete compatibility report
   */
  static runCompatibilityChecks() {
    const browser = this.detectBrowser();
    const localStorage = this.checkLocalStorage();
    const apis = this.checkRequiredAPIs();

    const isFullyCompatible = browser.isSupported && localStorage.available && apis.available;

    return {
      browser: browser,
      localStorage: localStorage,
      apis: apis,
      isFullyCompatible: isFullyCompatible
    };
  }

  /**
   * Display compatibility warnings to the user
   * @param {Object} compatibilityReport - Report from runCompatibilityChecks()
   */
  static displayCompatibilityWarnings(compatibilityReport) {
    const warnings = [];

    // Browser version warning
    if (!compatibilityReport.browser.isSupported) {
      const browserName = compatibilityReport.browser.name.charAt(0).toUpperCase() + 
                         compatibilityReport.browser.name.slice(1);
      const currentVersion = compatibilityReport.browser.version;
      const minVersion = compatibilityReport.browser.minimumVersion;
      
      if (compatibilityReport.browser.name === 'unknown') {
        warnings.push({
          level: 'warning',
          message: 'Your browser may not be fully supported. For the best experience, please use Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+.'
        });
      } else {
        warnings.push({
          level: 'warning',
          message: `Your ${browserName} version (${currentVersion}) is below the recommended version (${minVersion}). Some features may not work correctly.`
        });
      }
    }

    // Local Storage warning
    if (!compatibilityReport.localStorage.available) {
      warnings.push({
        level: 'error',
        message: `${compatibilityReport.localStorage.error}. Your data will not be saved between sessions.`
      });
    }

    // Missing APIs warning
    if (!compatibilityReport.apis.available) {
      warnings.push({
        level: 'error',
        message: `Missing required features: ${compatibilityReport.apis.missing.join(', ')}. The application may not function correctly.`
      });
    }

    // Display warnings using NotificationManager if available
    if (typeof NotificationManager !== 'undefined') {
      warnings.forEach(warning => {
        if (warning.level === 'error') {
          NotificationManager.error(warning.message, 10000);
        } else {
          NotificationManager.warning(warning.message, 8000);
        }
      });
    } else {
      // Fallback to console if NotificationManager not available
      warnings.forEach(warning => {
        if (warning.level === 'error') {
          console.error('Compatibility Error:', warning.message);
        } else {
          console.warn('Compatibility Warning:', warning.message);
        }
      });
    }

    return warnings;
  }

  /**
   * Initialize compatibility checking
   * Should be called before app initialization
   * @returns {Object} Compatibility report
   */
  static initialize() {
    console.log('Running browser compatibility checks...');
    
    const report = this.runCompatibilityChecks();
    
    // Log detailed report
    console.log('Browser:', report.browser.name, report.browser.version);
    console.log('Minimum version:', report.browser.minimumVersion);
    console.log('Browser supported:', report.browser.isSupported);
    console.log('Local Storage available:', report.localStorage.available);
    console.log('Required APIs available:', report.apis.available);
    
    if (!report.apis.available) {
      console.log('Missing APIs:', report.apis.missing);
    }
    
    console.log('Fully compatible:', report.isFullyCompatible);

    // Display warnings if needed
    if (!report.isFullyCompatible) {
      this.displayCompatibilityWarnings(report);
    } else {
      console.log('✓ All compatibility checks passed');
    }

    return report;
  }

  /**
   * Get a human-readable compatibility summary
   * @returns {string} Summary text
   */
  static getCompatibilitySummary() {
    const report = this.runCompatibilityChecks();
    const browser = report.browser;
    
    if (report.isFullyCompatible) {
      return `✓ ${browser.name.charAt(0).toUpperCase() + browser.name.slice(1)} ${browser.version} - Fully compatible`;
    } else {
      const issues = [];
      if (!browser.isSupported) issues.push('outdated browser');
      if (!report.localStorage.available) issues.push('no storage');
      if (!report.apis.available) issues.push('missing APIs');
      return `⚠ Compatibility issues: ${issues.join(', ')}`;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrowserCompatibility;
}
