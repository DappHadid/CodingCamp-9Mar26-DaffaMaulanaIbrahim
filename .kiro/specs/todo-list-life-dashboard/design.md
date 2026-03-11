# Design Document: To-Do List Life Dashboard

## Overview

The To-Do List Life Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript. It provides a unified interface for time awareness, task management, focus timing, and quick website access. The application operates entirely client-side with no backend dependencies, using the browser's Local Storage API for data persistence.

The design emphasizes simplicity, performance, and maintainability through a modular component architecture. Each major feature (greeting display, focus timer, task list, quick links) is implemented as a self-contained module with clear responsibilities and interfaces.

## Architecture

### System Architecture

The application follows a component-based architecture with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     index.html                          │
│                   (Entry Point)                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    app.js (Main)                        │
│  - Application initialization                           │
│  - Component orchestration                              │
│  - Event coordination                                   │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────┐
        ▼                 ▼                 ▼             ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Greeting    │  │    Timer     │  │   TaskList   │  │  QuickLinks  │
│  Component   │  │  Component   │  │  Component   │  │  Component   │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │                 │
        └─────────────────┴─────────────────┴─────────────────┘
                          ▼
                ┌──────────────────┐
                │  StorageManager  │
                │  (Local Storage) │
                └──────────────────┘
```

### Component Responsibilities

1. **GreetingComponent**: Manages time/date display and time-based greetings
2. **TimerComponent**: Handles focus timer countdown and controls
3. **TaskListComponent**: Manages task CRUD operations and display
4. **QuickLinksComponent**: Handles quick link management and navigation
5. **StorageManager**: Provides abstraction layer for Local Storage operations

### Data Flow

- User interactions trigger component methods
- Components update their internal state
- State changes are persisted via StorageManager
- DOM updates reflect the new state
- Components operate independently with minimal coupling

## Components and Interfaces

### StorageManager

Provides a centralized interface for all Local Storage operations with error handling and data validation.

```javascript
class StorageManager {
  // Get data from Local Storage with fallback
  static get(key, defaultValue = null)
  
  // Save data to Local Storage with error handling
  static set(key, value)
  
  // Remove data from Local Storage
  static remove(key)
  
  // Clear all application data
  static clear()
}
```

**Storage Keys:**
- `tasks`: Array of task objects
- `quickLinks`: Array of quick link objects
- `timerDuration`: Number (seconds remaining)

### GreetingComponent

Displays current time, date, and time-based greeting message.

```javascript
class GreetingComponent {
  constructor(containerElement)
  
  // Initialize component and start clock
  init()
  
  // Update time display (called every second)
  updateTime()
  
  // Get greeting based on current hour
  getGreeting(hour)
  
  // Format time for display
  formatTime(date)
  
  // Format date for display
  formatDate(date)
  
  // Cleanup intervals on destroy
  destroy()
}
```

**Greeting Time Ranges:**
- Morning: 5:00 AM - 11:59 AM
- Afternoon: 12:00 PM - 4:59 PM
- Evening: 5:00 PM - 8:59 PM
- Night: 9:00 PM - 4:59 AM

### TimerComponent

Manages a countdown timer with start, stop, and reset controls.

```javascript
class TimerComponent {
  constructor(containerElement)
  
  // Initialize timer with default duration (25 minutes)
  init()
  
  // Start countdown
  start()
  
  // Stop/pause countdown
  stop()
  
  // Reset to initial duration
  reset()
  
  // Update display (called every second while running)
  tick()
  
  // Handle timer completion
  onComplete()
  
  // Format seconds as MM:SS
  formatTime(seconds)
  
  // Cleanup intervals on destroy
  destroy()
}
```

**Timer States:**
- `idle`: Timer not running, at initial or reset value
- `running`: Timer actively counting down
- `paused`: Timer stopped but not reset
- `complete`: Timer reached zero

### TaskListComponent

Manages the task list with full CRUD operations.

```javascript
class TaskListComponent {
  constructor(containerElement)
  
  // Initialize component and load tasks
  init()
  
  // Load tasks from storage
  loadTasks()
  
  // Add new task
  addTask(description)
  
  // Toggle task completion status
  toggleTask(taskId)
  
  // Edit task description
  editTask(taskId, newDescription)
  
  // Delete task
  deleteTask(taskId)
  
  // Save tasks to storage
  saveTasks()
  
  // Render task list to DOM
  render()
  
  // Generate unique task ID
  generateId()
}
```

**Task Object Structure:**
```javascript
{
  id: string,           // Unique identifier
  description: string,  // Task text
  completed: boolean,   // Completion status
  createdAt: number     // Timestamp
}
```

### QuickLinksComponent

Manages quick links for website shortcuts.

```javascript
class QuickLinksComponent {
  constructor(containerElement)
  
  // Initialize component and load links
  init()
  
  // Load links from storage
  loadLinks()
  
  // Add new quick link
  addLink(name, url)
  
  // Delete quick link
  deleteLink(linkId)
  
  // Open link in new tab
  openLink(url)
  
  // Save links to storage
  saveLinks()
  
  // Render links to DOM
  render()
  
  // Validate URL format
  validateUrl(url)
  
  // Generate unique link ID
  generateId()
}
```

**Quick Link Object Structure:**
```javascript
{
  id: string,      // Unique identifier
  name: string,    // Display name
  url: string,     // Full URL
  createdAt: number // Timestamp
}
```

## Data Models

### Task Model

```javascript
{
  id: string,           // UUID or timestamp-based unique ID
  description: string,  // Task description (1-500 characters)
  completed: boolean,   // Completion status (default: false)
  createdAt: number     // Unix timestamp of creation
}
```

**Validation Rules:**
- `description`: Required, non-empty after trimming, max 500 characters
- `completed`: Boolean, defaults to false
- `id`: Must be unique within the task list
- `createdAt`: Positive integer timestamp

### Quick Link Model

```javascript
{
  id: string,      // UUID or timestamp-based unique ID
  name: string,    // Display name (1-50 characters)
  url: string,     // Valid URL with protocol
  createdAt: number // Unix timestamp of creation
}
```

**Validation Rules:**
- `name`: Required, non-empty after trimming, max 50 characters
- `url`: Required, must be valid URL format with http:// or https://
- `id`: Must be unique within the quick links list
- `createdAt`: Positive integer timestamp

### Timer State Model

```javascript
{
  duration: number,     // Total duration in seconds (default: 1500)
  remaining: number,    // Seconds remaining
  state: string,        // 'idle' | 'running' | 'paused' | 'complete'
  startTime: number     // Timestamp when started (for accuracy)
}
```

### Local Storage Schema

```javascript
{
  "tasks": [
    {
      "id": "task-1234567890",
      "description": "Complete project documentation",
      "completed": false,
      "createdAt": 1234567890000
    }
  ],
  "quickLinks": [
    {
      "id": "link-1234567890",
      "name": "GitHub",
      "url": "https://github.com",
      "createdAt": 1234567890000
    }
  ],
  "timerDuration": 1500
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several redundancies:

- Properties 2.1-2.4 (individual time range checks) can be combined with Property 1.4 (greeting based on time) into a single comprehensive property
- Properties 7.1 and 7.3 are redundant - removing from list updates display automatically
- Properties 8.1 and 8.2 are redundant - retrieving tasks includes displaying them
- Properties 4.2 and 4.4 can be verified through a single round-trip property that confirms tasks are both added to the list and persisted

The following properties represent the unique, non-redundant validation requirements:

### Property 1: Time Format Validity

*For any* time value, the formatted time string should be a valid 12-hour or 24-hour format (HH:MM with appropriate AM/PM indicator for 12-hour format).

**Validates: Requirements 1.1**

### Property 2: Date Format Completeness

*For any* date value, the formatted date string should contain the day of week, month name, and day number.

**Validates: Requirements 1.2**

### Property 3: Time Update Accuracy

*For any* initial time value, advancing by 60 seconds should result in the displayed time incrementing by exactly one minute.

**Validates: Requirements 1.3**

### Property 4: Greeting Time Range Correctness

*For any* hour of the day (0-23), the greeting should match the expected time range: morning (5-11), afternoon (12-16), evening (17-20), or night (21-4).

**Validates: Requirements 1.4, 2.1, 2.2, 2.3, 2.4**

### Property 5: Timer Countdown Accuracy

*For any* timer state with remaining time > 0, calling tick() should decrease the remaining time by exactly 1 second.

**Validates: Requirements 3.2, 3.6**

### Property 6: Timer Pause Idempotence

*For any* running timer, calling stop() should pause the countdown such that the remaining time does not change until start() is called again.

**Validates: Requirements 3.3**

### Property 7: Timer Reset Round-Trip

*For any* timer that has been started and run for some duration, calling reset() should restore the timer to its initial duration.

**Validates: Requirements 3.4**

### Property 8: Task Addition Round-Trip

*For any* valid (non-empty, trimmed) task description, adding the task should result in both the task list growing by one and the task being retrievable from Local Storage with the same description.

**Validates: Requirements 4.1, 4.2, 4.4**

### Property 9: Empty Task Rejection

*For any* string composed entirely of whitespace characters (including empty string), attempting to add it as a task should be rejected and the task list should remain unchanged.

**Validates: Requirements 4.3**

### Property 10: Task Toggle Idempotence

*For any* task, toggling its completion status twice should return it to its original completion state.

**Validates: Requirements 5.1**

### Property 11: Task Completion Persistence

*For any* task, after toggling its completion status, the task retrieved from Local Storage should reflect the new completion state.

**Validates: Requirements 5.3**

### Property 12: Task Edit Persistence

*For any* task and any valid new description, after editing the task's description, the task retrieved from Local Storage should have the new description.

**Validates: Requirements 6.2, 6.3**

### Property 13: Task Edit Cancellation Round-Trip

*For any* task with an original description, entering edit mode, changing the text, and then canceling should result in the task retaining its original description.

**Validates: Requirements 6.4**

### Property 14: Task Deletion Completeness

*For any* task in the task list, deleting that task should result in both the task list length decreasing by one and the task no longer being present in Local Storage.

**Validates: Requirements 7.1, 7.2**

### Property 15: Task Persistence Round-Trip

*For any* set of tasks, after saving them to Local Storage and then loading them back, the loaded tasks should match the original tasks in description, completion status, and count.

**Validates: Requirements 8.1**

### Property 16: Quick Link Addition Round-Trip

*For any* valid name and URL, adding a quick link should result in both the link appearing in the list and being retrievable from Local Storage with the same name and URL.

**Validates: Requirements 9.1**

### Property 17: Quick Link Deletion Completeness

*For any* quick link in the list, deleting that link should result in both the link list length decreasing by one and the link no longer being present in Local Storage.

**Validates: Requirements 9.3**

### Property 18: Quick Link Persistence Round-Trip

*For any* set of quick links, after saving them to Local Storage and then loading them back, the loaded links should match the original links in name, URL, and count.

**Validates: Requirements 9.4**

### Edge Cases

The following edge cases should be handled gracefully:

- Empty Local Storage should result in empty task and link lists (Requirements 8.3)
- Corrupted Local Storage data should be caught and result in empty lists with error logging (Requirements 8.4)
- Timer reaching zero should transition to complete state (Requirements 3.5)
- Task descriptions at maximum length (500 characters) should be accepted
- Quick link names at maximum length (50 characters) should be accepted
- Invalid URLs should be rejected with user feedback

## Error Handling

### Local Storage Errors

**Error Type**: QuotaExceededError
- **Cause**: Local Storage limit exceeded (typically 5-10MB)
- **Handling**: Display user-friendly error message, suggest deleting old tasks/links
- **Recovery**: Graceful degradation - allow continued use without persistence

**Error Type**: SecurityError
- **Cause**: Local Storage access blocked (private browsing, browser settings)
- **Handling**: Display warning about inability to persist data
- **Recovery**: Allow in-memory operation only

**Error Type**: Data Corruption
- **Cause**: Invalid JSON or malformed data in Local Storage
- **Handling**: Log error to console, clear corrupted data, initialize with empty state
- **Recovery**: Start fresh with empty lists

### Input Validation Errors

**Invalid Task Description**
- Empty or whitespace-only: Display inline error message "Task cannot be empty"
- Exceeds 500 characters: Display inline error message "Task too long (max 500 characters)"
- Action: Prevent submission, keep input focused

**Invalid Quick Link**
- Empty name: Display error "Link name is required"
- Empty URL: Display error "URL is required"
- Invalid URL format: Display error "Please enter a valid URL (e.g., https://example.com)"
- Action: Prevent submission, highlight invalid field

### Timer Errors

**Invalid Timer State**
- Attempting to start already running timer: Ignore action (idempotent)
- Attempting to stop already stopped timer: Ignore action (idempotent)
- Attempting to reset while running: Stop timer first, then reset

### Component Initialization Errors

**DOM Element Not Found**
- **Cause**: Component container element missing from HTML
- **Handling**: Log error to console with specific element ID
- **Recovery**: Fail gracefully, prevent component initialization

**Multiple Initialization**
- **Cause**: Component init() called multiple times
- **Handling**: Check initialization flag, ignore subsequent calls
- **Recovery**: Use existing instance

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property-based tests**: Verify universal properties across randomized inputs

This dual approach ensures that specific scenarios are validated while also confirming that general rules hold across a wide range of inputs.

### Unit Testing

Unit tests should focus on:

1. **Specific Examples**
   - Timer initializes to 25 minutes (1500 seconds)
   - Timer completion state when reaching zero
   - Greeting messages for specific times (e.g., 10:00 AM → "Good morning")
   - Empty storage initialization

2. **Edge Cases**
   - Empty task description submission
   - Whitespace-only task descriptions
   - Maximum length task descriptions (500 chars)
   - Maximum length link names (50 chars)
   - Corrupted Local Storage data
   - Missing DOM elements

3. **Error Conditions**
   - Local Storage quota exceeded
   - Local Storage access denied
   - Invalid URL formats
   - Invalid timer operations (start when running, etc.)

4. **Integration Points**
   - Component initialization sequence
   - StorageManager error handling
   - DOM event binding and cleanup

### Property-Based Testing

Property-based tests should use a JavaScript property testing library such as **fast-check** or **jsverify**. Each test must:

- Run a minimum of 100 iterations to ensure thorough randomized coverage
- Include a comment tag referencing the design document property
- Generate appropriate random inputs for the property being tested

**Configuration Example:**
```javascript
// Using fast-check
fc.assert(
  fc.property(fc.string(), (taskDescription) => {
    // Test property
  }),
  { numRuns: 100 }
);
```

**Property Test Tags:**

Each property test must include a comment in this format:
```javascript
// Feature: todo-list-life-dashboard, Property 1: Time Format Validity
```

**Property Test Coverage:**

1. **Property 1**: Generate random Date objects, verify time format validity
2. **Property 2**: Generate random Date objects, verify date format completeness
3. **Property 3**: Generate random times, advance by 60 seconds, verify minute increment
4. **Property 4**: Generate random hours (0-23), verify greeting matches time range
5. **Property 5**: Generate random timer states, verify tick decreases by 1 second
6. **Property 6**: Generate random timer states, verify stop pauses countdown
7. **Property 7**: Generate random timer durations, verify reset restores initial value
8. **Property 8**: Generate random task descriptions, verify addition and persistence
9. **Property 9**: Generate random whitespace strings, verify rejection
10. **Property 10**: Generate random tasks, verify double toggle returns to original state
11. **Property 11**: Generate random tasks, verify completion toggle persists
12. **Property 12**: Generate random task edits, verify persistence
13. **Property 13**: Generate random task edits, verify cancellation restores original
14. **Property 14**: Generate random tasks, verify deletion removes from list and storage
15. **Property 15**: Generate random task sets, verify save/load round-trip
16. **Property 16**: Generate random link data, verify addition and persistence
17. **Property 17**: Generate random links, verify deletion removes from list and storage
18. **Property 18**: Generate random link sets, verify save/load round-trip

### Test Organization

```
tests/
├── unit/
│   ├── greeting.test.js
│   ├── timer.test.js
│   ├── tasklist.test.js
│   ├── quicklinks.test.js
│   └── storage.test.js
└── property/
    ├── greeting.property.test.js
    ├── timer.property.test.js
    ├── tasklist.property.test.js
    ├── quicklinks.property.test.js
    └── storage.property.test.js
```

### Testing Tools

- **Test Runner**: Jest or Mocha
- **Property Testing**: fast-check (recommended) or jsverify
- **DOM Testing**: jsdom for Node.js environment
- **Assertions**: Chai or Jest's built-in assertions
- **Coverage**: Istanbul/nyc for code coverage reporting

### Coverage Goals

- Line coverage: > 90%
- Branch coverage: > 85%
- Function coverage: > 95%
- Property test iterations: 100 per property minimum

### Continuous Integration

Tests should run automatically on:
- Every commit (pre-commit hook)
- Pull request creation
- Merge to main branch

All tests must pass before code can be merged.

