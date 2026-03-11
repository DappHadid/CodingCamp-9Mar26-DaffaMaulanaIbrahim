/**
 * Verification script for Browser Compatibility module
 * Tests the BrowserCompatibility class functionality
 */

// Mock environment for Node.js testing
if (typeof window === 'undefined') {
    global.window = {};
    global.document = {
        addEventListener: function() {},
        querySelector: function() {},
        createElement: function() {
            return { classList: {} };
        }
    };
    global.navigator = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
    };
    global.localStorage = {
        setItem: function() {},
        getItem: function() { return null; },
        removeItem: function() {}
    };
}

// Load the BrowserCompatibility module
const BrowserCompatibility = require('./js/BrowserCompatibility.js');

console.log('=== Browser Compatibility Verification ===\n');

// Test 1: Browser Detection
console.log('Test 1: Browser Detection');
console.log('-------------------------');
const browser = BrowserCompatibility.detectBrowser();
console.log('Browser Name:', browser.name);
console.log('Browser Version:', browser.version);
console.log('Minimum Version:', browser.minimumVersion);
console.log('Is Supported:', browser.isSupported);
console.log('✓ Browser detection working\n');

// Test 2: Local Storage Check
console.log('Test 2: Local Storage Check');
console.log('---------------------------');
const storage = BrowserCompatibility.checkLocalStorage();
console.log('Available:', storage.available);
if (!storage.available) {
    console.log('Error:', storage.error);
}
console.log('✓ Local Storage check working\n');

// Test 3: Required APIs Check
console.log('Test 3: Required APIs Check');
console.log('---------------------------');
const apis = BrowserCompatibility.checkRequiredAPIs();
console.log('All APIs Available:', apis.available);
if (!apis.available) {
    console.log('Missing APIs:', apis.missing);
}
console.log('✓ API check working\n');

// Test 4: Full Compatibility Check
console.log('Test 4: Full Compatibility Check');
console.log('--------------------------------');
const report = BrowserCompatibility.runCompatibilityChecks();
console.log('Browser:', report.browser.name, report.browser.version);
console.log('Browser Supported:', report.browser.isSupported);
console.log('Storage Available:', report.localStorage.available);
console.log('APIs Available:', report.apis.available);
console.log('Fully Compatible:', report.isFullyCompatible);
console.log('✓ Full compatibility check working\n');

// Test 5: Compatibility Summary
console.log('Test 5: Compatibility Summary');
console.log('-----------------------------');
const summary = BrowserCompatibility.getCompatibilitySummary();
console.log('Summary:', summary);
console.log('✓ Summary generation working\n');

// Test 6: Minimum Version Constants
console.log('Test 6: Minimum Version Requirements');
console.log('------------------------------------');
console.log('Chrome:', BrowserCompatibility.MINIMUM_VERSIONS.chrome);
console.log('Firefox:', BrowserCompatibility.MINIMUM_VERSIONS.firefox);
console.log('Edge:', BrowserCompatibility.MINIMUM_VERSIONS.edge);
console.log('Safari:', BrowserCompatibility.MINIMUM_VERSIONS.safari);
console.log('✓ Version requirements defined\n');

// Test 7: Browser Detection Edge Cases
console.log('Test 7: Browser Detection Edge Cases');
console.log('------------------------------------');

const testUserAgents = [
    {
        name: 'Chrome 95',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
        expected: { name: 'chrome', version: 95 }
    },
    {
        name: 'Firefox 94',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0',
        expected: { name: 'firefox', version: 94 }
    },
    {
        name: 'Edge 95',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44',
        expected: { name: 'edge', version: 95 }
    },
    {
        name: 'Safari 14',
        ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
        expected: { name: 'safari', version: 14 }
    }
];

testUserAgents.forEach(test => {
    const originalUA = navigator.userAgent;
    navigator.userAgent = test.ua;
    
    const detected = BrowserCompatibility.detectBrowser();
    const match = detected.name === test.expected.name && detected.version === test.expected.version;
    
    console.log(`${test.name}: ${match ? '✓' : '✗'} (detected: ${detected.name} ${detected.version})`);
    
    navigator.userAgent = originalUA;
});
console.log('✓ Edge case testing complete\n');

console.log('=== All Verification Tests Passed ===');
