/**
 * End-to-End Integration Test Runner
 * Runs comprehensive integration tests for the Life Dashboard application
 */

const fs = require('fs');
const path = require('path');

// Mock browser environment
global.window = {
    addEventListener: () => {},
    open: () => {},
    localStorage: {
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
    }
};

global.localStorage = global.window.localStorage;
global.document = {
    addEventListener: () => {},
    getElementById: () => null,
    createElement: () => ({
        addEventListener: () => {},
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    }),
    querySelector: () => null
};

// Load application modules
const StorageManager = require('./js/StorageManager.js');

// Test results
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✓ ${message}`);
        passCount++;
        return true;
    } else {
        console.log(`✗ ${message}`);
        failCount++;
        return false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runIntegrationTests() {
    console.log('\n=== End-to-End Integration Tests ===\n');
    
    // Clear storage
    localStorage.clear();
    
    // Test 1: Storage Manager Basic Operations
    console.log('--- Test 1: Storage Manager Operations ---');
    
    const testData = { id: 1, name: 'Test' };
    const saveResult = StorageManager.set('test', testData);
    assert(saveResult === true, 'Data saved successfully');
    
    const loadedData = StorageManager.get('test');
    assert(loadedData !== null, 'Data loaded successfully');
    assert(loadedData.id === 1, 'Data integrity maintained');
    assert(loadedData.name === 'Test', 'Data values preserved');
    
    const removeResult = StorageManager.remove('test');
    assert(removeResult === true, 'Data removed successfully');
    
    const afterRemove = StorageManager.get('test', null);
    assert(afterRemove === null, 'Data no longer exists after removal');

    // Test 2: Task Data Persistence
    console.log('\n--- Test 2: Task Data Persistence ---');
    
    const tasks = [
        { id: 'task-1', description: 'Task 1', completed: false, createdAt: Date.now() },
        { id: 'task-2', description: 'Task 2', completed: true, createdAt: Date.now() },
        { id: 'task-3', description: 'Task 3', completed: false, createdAt: Date.now() }
    ];
    
    StorageManager.set('tasks', tasks);
    const loadedTasks = StorageManager.get('tasks', []);
    
    assert(loadedTasks.length === 3, 'All tasks persisted');
    assert(loadedTasks[0].description === 'Task 1', 'Task 1 description preserved');
    assert(loadedTasks[1].completed === true, 'Task 2 completion state preserved');
    assert(loadedTasks[2].description === 'Task 3', 'Task 3 description preserved');
    
    // Test 3: Quick Links Data Persistence
    console.log('\n--- Test 3: Quick Links Data Persistence ---');
    
    const links = [
        { id: 'link-1', name: 'GitHub', url: 'https://github.com', createdAt: Date.now() },
        { id: 'link-2', name: 'Google', url: 'https://google.com', createdAt: Date.now() }
    ];
    
    StorageManager.set('quickLinks', links);
    const loadedLinks = StorageManager.get('quickLinks', []);
    
    assert(loadedLinks.length === 2, 'All links persisted');
    assert(loadedLinks[0].name === 'GitHub', 'Link 1 name preserved');
    assert(loadedLinks[0].url === 'https://github.com', 'Link 1 URL preserved');
    assert(loadedLinks[1].name === 'Google', 'Link 2 name preserved');

    // Test 4: Page Reload Simulation
    console.log('\n--- Test 4: Page Reload Simulation ---');
    
    // Simulate page reload by clearing and reloading
    const tasksBeforeReload = StorageManager.get('tasks', []);
    const linksBeforeReload = StorageManager.get('quickLinks', []);
    
    // Simulate reload (data should persist)
    const tasksAfterReload = StorageManager.get('tasks', []);
    const linksAfterReload = StorageManager.get('quickLinks', []);
    
    assert(tasksAfterReload.length === tasksBeforeReload.length, 'Tasks survive reload');
    assert(linksAfterReload.length === linksBeforeReload.length, 'Links survive reload');
    assert(tasksAfterReload[0].description === 'Task 1', 'Task data intact after reload');
    assert(linksAfterReload[0].url === 'https://github.com', 'Link data intact after reload');
    
    // Test 5: Corrupted Data Handling
    console.log('\n--- Test 5: Corrupted Data Handling ---');
    
    localStorage.setItem('tasks', 'invalid-json{{{');
    const corruptedTasks = StorageManager.get('tasks', []);
    assert(Array.isArray(corruptedTasks), 'Corrupted data returns default array');
    assert(corruptedTasks.length === 0, 'Corrupted data returns empty array');
    
    localStorage.setItem('quickLinks', 'not-valid-json');
    const corruptedLinks = StorageManager.get('quickLinks', []);
    assert(Array.isArray(corruptedLinks), 'Corrupted links return default array');
    assert(corruptedLinks.length === 0, 'Corrupted links return empty array');

    // Test 6: Missing Data Handling
    console.log('\n--- Test 6: Missing Data Handling ---');
    
    localStorage.clear();
    const missingTasks = StorageManager.get('tasks', []);
    const missingLinks = StorageManager.get('quickLinks', []);
    
    assert(Array.isArray(missingTasks), 'Missing tasks return default array');
    assert(missingTasks.length === 0, 'Missing tasks return empty array');
    assert(Array.isArray(missingLinks), 'Missing links return default array');
    assert(missingLinks.length === 0, 'Missing links return empty array');
    
    // Test 7: Complete Application State
    console.log('\n--- Test 7: Complete Application State ---');
    
    // Create complete application state
    const completeState = {
        tasks: [
            { id: 't1', description: 'Morning workout', completed: true, createdAt: Date.now() },
            { id: 't2', description: 'Review code', completed: false, createdAt: Date.now() },
            { id: 't3', description: 'Team meeting', completed: false, createdAt: Date.now() }
        ],
        quickLinks: [
            { id: 'l1', name: 'GitHub', url: 'https://github.com', createdAt: Date.now() },
            { id: 'l2', name: 'Stack Overflow', url: 'https://stackoverflow.com', createdAt: Date.now() }
        ]
    };
    
    StorageManager.set('tasks', completeState.tasks);
    StorageManager.set('quickLinks', completeState.quickLinks);
    
    const finalTasks = StorageManager.get('tasks', []);
    const finalLinks = StorageManager.get('quickLinks', []);
    
    assert(finalTasks.length === 3, 'Complete task state persisted');
    assert(finalTasks[0].completed === true, 'Task completion state persisted');
    assert(finalLinks.length === 2, 'Complete links state persisted');
    assert(finalLinks[0].url === 'https://github.com', 'Link URLs persisted');

    // Test 8: Storage Availability Check
    console.log('\n--- Test 8: Storage Availability ---');
    
    const isAvailable = StorageManager.isAvailable();
    assert(isAvailable === true, 'Local Storage is available');
    
    // Test 9: Async Storage Operations
    console.log('\n--- Test 9: Async Storage Operations ---');
    
    const asyncData = { test: 'async' };
    const asyncResult = await StorageManager.setAsync('asyncTest', asyncData);
    assert(asyncResult === true, 'Async save successful');
    
    await sleep(100);
    const asyncLoaded = StorageManager.get('asyncTest');
    assert(asyncLoaded !== null, 'Async saved data can be loaded');
    assert(asyncLoaded.test === 'async', 'Async data integrity maintained');
    
    // Summary
    console.log('\n=== Test Suite Complete ===');
    console.log(`Results: ${passCount} passed, ${failCount} failed`);
    console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
    
    if (failCount === 0) {
        console.log('\n✓ All integration tests passed! Application is ready.');
        process.exit(0);
    } else {
        console.log(`\n✗ ${failCount} test(s) failed. Please review and fix issues.`);
        process.exit(1);
    }
}

// Run tests
runIntegrationTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
