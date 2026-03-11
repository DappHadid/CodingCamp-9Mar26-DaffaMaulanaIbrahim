/**
 * Simple component verification script
 * Tests that all components can be loaded and basic functionality works
 */

// Mock DOM environment for Node.js testing
class MockElement {
    constructor() {
        this.innerHTML = '';
        this.children = [];
        this.classList = {
            add: () => {},
            remove: () => {},
            contains: () => false
        };
    }
    
    querySelector() {
        return new MockElement();
    }
    
    querySelectorAll() {
        return [];
    }
    
    appendChild() {}
    addEventListener() {}
    focus() {}
}

global.document = {
    createElement: () => new MockElement(),
    getElementById: () => new MockElement(),
    querySelector: () => new MockElement(),
    addEventListener: () => {}
};

global.window = {
    addEventListener: () => {},
    open: () => {}
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
const TaskListComponent = require('./js/TaskListComponent.js');
const QuickLinksComponent = require('./js/QuickLinksComponent.js');

// Make StorageManager globally available for components that use it
global.StorageManager = StorageManager;

console.log('=== Component Verification Tests ===\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// StorageManager Tests
console.log('StorageManager Tests:');
test('StorageManager.set and get work', () => {
    StorageManager.set('test', { value: 42 });
    const result = StorageManager.get('test');
    assert(result.value === 42, 'Value should be 42');
});

test('StorageManager.get returns default for missing key', () => {
    const result = StorageManager.get('nonexistent', 'default');
    assert(result === 'default', 'Should return default value');
});

test('StorageManager.remove works', () => {
    StorageManager.set('toRemove', 'value');
    StorageManager.remove('toRemove');
    const result = StorageManager.get('toRemove');
    assert(result === null, 'Should return null after removal');
});

test('StorageManager handles corrupted data', () => {
    localStorage.setItem('corrupted', 'not valid json{');
    const result = StorageManager.get('corrupted', 'fallback');
    assert(result === 'fallback', 'Should return fallback for corrupted data');
});

// TimerComponent Tests
console.log('\nTimerComponent Tests:');
test('TimerComponent initializes with 1500 seconds', () => {
    const timer = new TimerComponent(new MockElement());
    timer.init();
    assert(timer.duration === 1500, 'Duration should be 1500');
    assert(timer.remaining === 1500, 'Remaining should be 1500');
    assert(timer.state === 'idle', 'State should be idle');
});

test('TimerComponent.formatTime works correctly', () => {
    const timer = new TimerComponent(new MockElement());
    assert(timer.formatTime(1500) === '25:00', 'Should format 1500 as 25:00');
    assert(timer.formatTime(65) === '01:05', 'Should format 65 as 01:05');
    assert(timer.formatTime(0) === '00:00', 'Should format 0 as 00:00');
});

test('TimerComponent.start changes state to running', () => {
    const timer = new TimerComponent(new MockElement());
    timer.init();
    timer.start();
    assert(timer.state === 'running', 'State should be running');
});

test('TimerComponent.stop changes state to paused', () => {
    const timer = new TimerComponent(new MockElement());
    timer.init();
    timer.start();
    timer.stop();
    assert(timer.state === 'paused', 'State should be paused');
});

test('TimerComponent.reset restores initial duration', () => {
    const timer = new TimerComponent(new MockElement());
    timer.init();
    timer.remaining = 100;
    timer.reset();
    assert(timer.remaining === 1500, 'Should reset to 1500');
    assert(timer.state === 'idle', 'State should be idle');
});

// TaskListComponent Tests
console.log('\nTaskListComponent Tests:');
test('TaskListComponent.addTask creates a task', () => {
    localStorage.clear();
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const taskList = new TaskListComponent(container);
    taskList.init();
    
    const task = taskList.addTask('Test task');
    assert(task !== null, 'Should create task');
    assert(task.description === 'Test task', 'Description should match');
    assert(task.completed === false, 'Should not be completed');
    assert(taskList.tasks.length === 1, 'Should have 1 task');
});

test('TaskListComponent.addTask rejects empty string', () => {
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const taskList = new TaskListComponent(container);
    taskList.init();
    
    const result = taskList.addTask('');
    assert(result === null, 'Should reject empty string');
});

test('TaskListComponent.addTask rejects whitespace', () => {
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const taskList = new TaskListComponent(container);
    taskList.init();
    
    const result = taskList.addTask('   ');
    assert(result === null, 'Should reject whitespace');
});

test('TaskListComponent.toggleTask changes completion status', () => {
    localStorage.clear();
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const taskList = new TaskListComponent(container);
    taskList.init();
    
    const task = taskList.addTask('Test task');
    taskList.toggleTask(task.id);
    assert(task.completed === true, 'Should be completed');
    taskList.toggleTask(task.id);
    assert(task.completed === false, 'Should be uncompleted');
});

test('TaskListComponent.deleteTask removes task', () => {
    localStorage.clear();
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const taskList = new TaskListComponent(container);
    taskList.init();
    
    const task = taskList.addTask('Test task');
    const result = taskList.deleteTask(task.id);
    assert(result === true, 'Should return true');
    assert(taskList.tasks.length === 0, 'Should have 0 tasks');
});

test('TaskListComponent.editTask updates description', () => {
    localStorage.clear();
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const taskList = new TaskListComponent(container);
    taskList.init();
    
    const task = taskList.addTask('Original');
    const result = taskList.editTask(task.id, 'Updated');
    assert(result === true, 'Should return true');
    assert(task.description === 'Updated', 'Description should be updated');
});

// QuickLinksComponent Tests
console.log('\nQuickLinksComponent Tests:');
test('QuickLinksComponent.validateUrl accepts valid URLs', () => {
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const links = new QuickLinksComponent(container);
    
    assert(links.validateUrl('https://example.com') === true, 'Should accept HTTPS');
    assert(links.validateUrl('http://example.com') === true, 'Should accept HTTP');
});

test('QuickLinksComponent.validateUrl rejects invalid URLs', () => {
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const links = new QuickLinksComponent(container);
    
    assert(links.validateUrl('example.com') === false, 'Should reject no protocol');
    assert(links.validateUrl('') === false, 'Should reject empty');
    assert(links.validateUrl('not a url') === false, 'Should reject invalid');
});

test('QuickLinksComponent.addLink creates a link', () => {
    localStorage.clear();
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const links = new QuickLinksComponent(container);
    links.init();
    
    const link = links.addLink('Test', 'https://example.com');
    assert(link !== null, 'Should create link');
    assert(link.name === 'Test', 'Name should match');
    assert(link.url === 'https://example.com', 'URL should match');
    assert(links.links.length === 1, 'Should have 1 link');
});

test('QuickLinksComponent.addLink rejects empty name', () => {
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const links = new QuickLinksComponent(container);
    links.init();
    
    const result = links.addLink('', 'https://example.com');
    assert(result === null, 'Should reject empty name');
});

test('QuickLinksComponent.addLink rejects invalid URL', () => {
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const links = new QuickLinksComponent(container);
    links.init();
    
    const result = links.addLink('Test', 'not a url');
    assert(result === null, 'Should reject invalid URL');
});

test('QuickLinksComponent.deleteLink removes link', () => {
    localStorage.clear();
    const container = new MockElement();
    container.querySelector = () => new MockElement();
    const links = new QuickLinksComponent(container);
    links.init();
    
    const link = links.addLink('Test', 'https://example.com');
    const result = links.deleteLink(link.id);
    assert(result === true, 'Should return true');
    assert(links.links.length === 0, 'Should have 0 links');
});

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
} else {
    console.log(`\n✗ ${failed} test(s) failed`);
    process.exit(1);
}
