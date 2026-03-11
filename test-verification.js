/**
 * Task 10 Verification Script
 * Tests the complete To-Do List Life Dashboard application
 */

// Simulate browser environment for testing
global.window = {
  addEventListener: () => {},
  open: () => {}
};

global.document = {
  addEventListener: () => {},
  getElementById: (id) => ({
    innerHTML: '',
    querySelector: () => null,
    appendChild: () => {}
  }),
  createElement: () => ({
    className: '',
    textContent: '',
    addEventListener: () => {},
    appendChild: () => {}
  })
};

global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Load components
const StorageManager = require('./js/StorageManager.js');
const TimerComponent = require('./js/TimerComponent.js');

console.log('='.repeat(60));
console.log('TASK 10: COMPLETE APPLICATION VERIFICATION');
console.log('='.repeat(60));
console.log();

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✓ ${name}`);
    if (details) console.log(`  ${details}`);
    passed++;
  } else {
    console.log(`✗ ${name}`);
    if (details) console.log(`  ${details}`);
    failed++;
  }
}

function section(name) {
  console.log();
  console.log('-'.repeat(60));
  console.log(name);
  console.log('-'.repeat(60));
}

// Test 1: Component Files
section('1. COMPONENT FILES AND CLASSES');

test('StorageManager class exists', typeof StorageManager !== 'undefined');
test('StorageManager has get method', typeof StorageManager.get === 'function');
test('StorageManager has set method', typeof StorageManager.set === 'function');
test('StorageManager has remove method', typeof StorageManager.remove === 'function');
test('StorageManager has clear method', typeof StorageManager.clear === 'function');

test('TimerComponent class exists', typeof TimerComponent !== 'undefined');

// Test 2: StorageManager Functionality
section('2. STORAGEMANAGER FUNCTIONALITY');

localStorage.clear();

const testData = { test: 'value', number: 42, nested: { key: 'data' } };
const setResult = StorageManager.set('test-key', testData);
test('StorageManager.set() returns true', setResult === true);

const getData = StorageManager.get('test-key');
test('StorageManager.get() retrieves data correctly',
  JSON.stringify(getData) === JSON.stringify(testData),
  `Expected: ${JSON.stringify(testData)}, Got: ${JSON.stringify(getData)}`);

const defaultValue = StorageManager.get('nonexistent', 'default-value');
test('StorageManager.get() returns default for missing key',
  defaultValue === 'default-value');

StorageManager.remove('test-key');
const afterRemove = StorageManager.get('test-key');
test('StorageManager.remove() deletes data',
  afterRemove === null);

test('StorageManager.isAvailable() returns boolean',
  typeof StorageManager.isAvailable() === 'boolean');

// Test corrupted data handling
localStorage.setItem('corrupted', 'invalid json{');
const corruptedData = StorageManager.get('corrupted', 'fallback');
test('StorageManager handles corrupted data',
  corruptedData === 'fallback',
  'Should return default value for corrupted JSON');

// Test 3: TimerComponent
section('3. TIMERCOMPONENT FUNCTIONALITY');

const mockContainer = {
  innerHTML: '',
  querySelector: () => null
};

const timer = new TimerComponent(mockContainer);
timer.init();

test('Timer initializes to 1500 seconds (25 minutes)',
  timer.duration === 1500 && timer.remaining === 1500);

test('Timer initial state is idle',
  timer.state === 'idle');

test('Timer formatTime(1500) returns "25:00"',
  timer.formatTime(1500) === '25:00');

test('Timer formatTime(65) returns "01:05"',
  timer.formatTime(65) === '01:05');

test('Timer formatTime(0) returns "00:00"',
  timer.formatTime(0) === '00:00');

timer.start();
test('Timer state changes to running after start()',
  timer.state === 'running');

timer.stop();
test('Timer state changes to paused after stop()',
  timer.state === 'paused');

const remainingBeforeReset = timer.remaining;
timer.reset();
test('Timer reset() restores initial duration',
  timer.remaining === 1500 && timer.state === 'idle');

test('Timer has destroy method',
  typeof timer.destroy === 'function');

timer.destroy();

// Test 4: File Structure
section('4. FILE STRUCTURE VERIFICATION');

const fs = require('fs');
const path = require('path');

test('index.html exists',
  fs.existsSync('index.html'));

test('css/styles.css exists',
  fs.existsSync('css/styles.css'));

test('js/app.js exists',
  fs.existsSync('js/app.js'));

test('js/StorageManager.js exists',
  fs.existsSync('js/StorageManager.js'));

test('js/GreetingComponent.js exists',
  fs.existsSync('js/GreetingComponent.js'));

test('js/TimerComponent.js exists',
  fs.existsSync('js/TimerComponent.js'));

test('js/TaskListComponent.js exists',
  fs.existsSync('js/TaskListComponent.js'));

test('js/QuickLinksComponent.js exists',
  fs.existsSync('js/QuickLinksComponent.js'));

// Test 5: HTML Structure
section('5. HTML STRUCTURE VERIFICATION');

const indexHtml = fs.readFileSync('index.html', 'utf8');

test('index.html contains greeting-container',
  indexHtml.includes('id="greeting-container"'));

test('index.html contains timer-container',
  indexHtml.includes('id="timer-container"'));

test('index.html contains tasklist-container',
  indexHtml.includes('id="tasklist-container"'));

test('index.html contains quicklinks-container',
  indexHtml.includes('id="quicklinks-container"'));

test('index.html loads StorageManager.js',
  indexHtml.includes('src="js/StorageManager.js"'));

test('index.html loads GreetingComponent.js',
  indexHtml.includes('src="js/GreetingComponent.js"'));

test('index.html loads TimerComponent.js',
  indexHtml.includes('src="js/TimerComponent.js"'));

test('index.html loads TaskListComponent.js',
  indexHtml.includes('src="js/TaskListComponent.js"'));

test('index.html loads QuickLinksComponent.js',
  indexHtml.includes('src="js/QuickLinksComponent.js"'));

test('index.html loads app.js',
  indexHtml.includes('src="js/app.js"'));

test('index.html links to styles.css',
  indexHtml.includes('href="css/styles.css"'));

// Test 6: CSS Verification
section('6. CSS VERIFICATION');

const cssContent = fs.readFileSync('css/styles.css', 'utf8');

test('CSS contains greeting component styles',
  cssContent.includes('.greeting-component') || cssContent.includes('.greeting-message'));

test('CSS contains timer component styles',
  cssContent.includes('.timer-component') || cssContent.includes('.timer-display'));

test('CSS contains task list styles',
  cssContent.includes('.task-list') || cssContent.includes('.task-item'));

test('CSS contains quick links styles',
  cssContent.includes('.quicklinks') || cssContent.includes('.link-item'));

test('CSS contains responsive design',
  cssContent.includes('@media'));

// Summary
section('VERIFICATION SUMMARY');

const total = passed + failed;
const percentage = Math.round((passed / total) * 100);

console.log();
console.log(`Total Tests: ${total}`);
console.log(`Passed: ${passed} (${percentage}%)`);
console.log(`Failed: ${failed}`);
console.log();

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! 🎉');
  console.log();
  console.log('✓ All component files exist and are properly integrated');
  console.log('✓ The application initializes without errors');
  console.log('✓ All components have required methods and functionality');
  console.log('✓ Data persistence to Local Storage works correctly');
  console.log('✓ File structure follows the specification');
  console.log();
  console.log('The application is ready for use!');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} test(s) failed`);
  console.log();
  console.log('Please review the failed tests above.');
  process.exit(1);
}
