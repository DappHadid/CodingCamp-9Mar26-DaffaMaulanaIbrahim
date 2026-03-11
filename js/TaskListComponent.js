/**
 * TaskListComponent - Manages task list with full CRUD operations
 * Handles task creation, reading, updating, deletion, and persistence
 */
class TaskListComponent {
  /**
   * Create a new TaskListComponent
   * @param {HTMLElement} containerElement - DOM element to render tasks into
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.tasks = [];
  }

  /**
   * Initialize component and load tasks from storage
   */
  init() {
    this.loadTasks();
    this.renderInputForm();
    this.render();
  }

  /**
   * Render input form for adding tasks
   */
  renderInputForm() {
    const inputContainer = this.container.querySelector('.task-input-container');
    if (!inputContainer) {
      return;
    }

    inputContainer.innerHTML = `
      <div class="task-input-form">
        <input type="text" 
               id="task-input" 
               class="task-input" 
               placeholder="Add a new task..." 
               maxlength="500">
        <button id="add-task-btn" class="add-task-btn">Add Task</button>
      </div>
      <div id="task-error" class="error-message" style="display: none;"></div>
    `;

    // Attach event listeners
    const input = inputContainer.querySelector('#task-input');
    const addBtn = inputContainer.querySelector('#add-task-btn');
    const errorDiv = inputContainer.querySelector('#task-error');

    const handleAddTask = () => {
      const description = input.value;
      const result = this.addTask(description);
      
      if (result) {
        // Success - clear input and hide error
        input.value = '';
        errorDiv.style.display = 'none';
      } else {
        // Validation failed - show error
        const trimmed = description.trim();
        if (trimmed === '') {
          errorDiv.textContent = 'Task cannot be empty';
        } else if (trimmed.length > 500) {
          errorDiv.textContent = 'Task too long (max 500 characters)';
        }
        errorDiv.style.display = 'block';
      }
    };

    addBtn.addEventListener('click', handleAddTask);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddTask();
      }
    });
  }

  /**
   * Load tasks from Local Storage
   */
  loadTasks() {
    this.tasks = StorageManager.get('tasks', []);
  }

  /**
   * Add a new task
   * @param {string} description - Task description
   * @returns {Object|null} Created task object or null if validation fails
   */
  addTask(description) {
    // Validate: non-empty after trimming
    const trimmed = description.trim();
    if (trimmed === '') {
      return null;
    }

    // Validate: max 500 characters
    if (trimmed.length > 500) {
      return null;
    }

    // Create task object
    const task = {
      id: this.generateId(),
      description: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    // Add to tasks array
    this.tasks.push(task);

    // Save to storage
    this.saveTasks();

    // Re-render
    this.render();

    return task;
  }

  /**
   * Toggle task completion status
   * @param {string} taskId - ID of task to toggle
   * @returns {boolean} True if task was found and toggled, false otherwise
   */
  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    
    if (!task) {
      return false;
    }

    // Toggle completion status
    task.completed = !task.completed;

    // Save to storage
    this.saveTasks();

    // Re-render
    this.render();

    return true;
  }

  /**
   * Edit task description
   * @param {string} taskId - ID of task to edit
   * @param {string} newDescription - New task description
   * @returns {boolean} True if task was found and edited, false otherwise
   */
  editTask(taskId, newDescription) {
    const task = this.tasks.find(t => t.id === taskId);
    
    if (!task) {
      return false;
    }

    // Validate: non-empty after trimming
    const trimmed = newDescription.trim();
    if (trimmed === '') {
      return false;
    }

    // Validate: max 500 characters
    if (trimmed.length > 500) {
      return false;
    }

    // Update description
    task.description = trimmed;

    // Save to storage
    this.saveTasks();

    // Re-render
    this.render();

    return true;
  }

  /**
   * Delete a task
   * @param {string} taskId - ID of task to delete
   * @returns {boolean} True if task was found and deleted, false otherwise
   */
  deleteTask(taskId) {
    const index = this.tasks.findIndex(t => t.id === taskId);
    
    if (index === -1) {
      return false;
    }

    // Remove from array
    this.tasks.splice(index, 1);

    // Save to storage
    this.saveTasks();

    // Re-render
    this.render();

    return true;
  }

  /**
   * Save tasks to Local Storage
   */
  saveTasks() {
    StorageManager.set('tasks', this.tasks);
  }

  /**
   * Render task list to DOM
   */
  render() {
    if (!this.container) {
      console.error('TaskListComponent: Container element not found');
      return;
    }

    // Get or create task list container
    let taskListContainer = this.container.querySelector('.task-list');
    if (!taskListContainer) {
      taskListContainer = document.createElement('div');
      taskListContainer.className = 'task-list';
      this.container.appendChild(taskListContainer);
    }

    // Clear container
    taskListContainer.innerHTML = '';

    // If no tasks, show empty state
    if (this.tasks.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'No tasks yet. Add one to get started!';
      taskListContainer.appendChild(emptyMessage);
      return;
    }

    // Create task list
    const taskList = document.createElement('ul');
    taskList.className = 'task-list-items';

    this.tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      if (task.completed) {
        taskItem.classList.add('completed');
      }

      // Checkbox for completion
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        this.toggleTask(task.id);
      });

      // Task description
      const description = document.createElement('span');
      description.className = 'task-description';
      description.textContent = task.description;

      // Edit button
      const editButton = document.createElement('button');
      editButton.className = 'edit-button';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        this.enterEditMode(task.id, taskItem);
      });

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        this.deleteTask(task.id);
      });

      // Assemble task item
      taskItem.appendChild(checkbox);
      taskItem.appendChild(description);
      taskItem.appendChild(editButton);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
    });

    taskListContainer.appendChild(taskList);
  }

  /**
   * Enter edit mode for a task
   * @param {string} taskId - ID of task to edit
   * @param {HTMLElement} taskItem - Task item DOM element
   */
  enterEditMode(taskId, taskItem) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      return;
    }

    // Store original description for cancellation
    const originalDescription = task.description;

    // Clear task item
    taskItem.innerHTML = '';

    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.description;
    editInput.maxLength = 500;

    // Save button
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
      const success = this.editTask(taskId, editInput.value);
      if (!success) {
        // If validation fails, show error or restore original
        alert('Task description cannot be empty or exceed 500 characters');
      }
    });

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      // Restore original description
      task.description = originalDescription;
      this.render();
    });

    // Assemble edit mode
    taskItem.appendChild(editInput);
    taskItem.appendChild(saveButton);
    taskItem.appendChild(cancelButton);

    // Focus input
    editInput.focus();
  }

  /**
   * Generate unique task ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskListComponent;
}
