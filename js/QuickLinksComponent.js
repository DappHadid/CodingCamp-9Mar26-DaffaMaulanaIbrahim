/**
 * QuickLinksComponent - Manages quick links for website shortcuts
 * Handles link creation, deletion, opening, and persistence
 */
class QuickLinksComponent {
  /**
   * Create a new QuickLinksComponent
   * @param {HTMLElement} containerElement - DOM element to render links into
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.links = [];
  }

  /**
   * Initialize component and load links from storage
   */
  init() {
    this.loadLinks();
    this.renderInputForm();
    this.render();
  }

  /**
   * Render input form for adding quick links
   */
  renderInputForm() {
    const inputContainer = this.container.querySelector('.quicklinks-input-container');
    if (!inputContainer) {
      return;
    }

    inputContainer.innerHTML = `
      <div class="quicklinks-input-form">
        <input type="text" 
               id="link-name-input" 
               class="link-name-input" 
               placeholder="Link name..." 
               maxlength="50">
        <input type="url" 
               id="link-url-input" 
               class="link-url-input" 
               placeholder="https://example.com">
        <button id="add-link-btn" class="add-link-btn">Add Link</button>
      </div>
      <div id="link-error" class="error-message" style="display: none;"></div>
    `;

    // Attach event listeners
    const nameInput = inputContainer.querySelector('#link-name-input');
    const urlInput = inputContainer.querySelector('#link-url-input');
    const addBtn = inputContainer.querySelector('#add-link-btn');
    const errorDiv = inputContainer.querySelector('#link-error');

    const handleAddLink = () => {
      const name = nameInput.value;
      const url = urlInput.value;
      const result = this.addLink(name, url);
      
      if (result) {
        // Success - clear inputs and hide error
        nameInput.value = '';
        urlInput.value = '';
        errorDiv.style.display = 'none';
      } else {
        // Validation failed - show error
        const trimmedName = name.trim();
        if (trimmedName === '') {
          errorDiv.textContent = 'Link name is required';
        } else if (trimmedName.length > 50) {
          errorDiv.textContent = 'Link name too long (max 50 characters)';
        } else if (!this.validateUrl(url)) {
          errorDiv.textContent = 'Please enter a valid URL (e.g., https://example.com)';
        }
        errorDiv.style.display = 'block';
      }
    };

    addBtn.addEventListener('click', handleAddLink);
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddLink();
      }
    });
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddLink();
      }
    });
  }

  /**
   * Load links from Local Storage
   */
  loadLinks() {
    this.links = StorageManager.get('quickLinks', []);
  }

  /**
   * Add a new quick link
   * @param {string} name - Display name for the link
   * @param {string} url - URL to link to
   * @returns {Object|null} Created link object or null if validation fails
   */
  addLink(name, url) {
    // Validate name: non-empty after trimming
    const trimmedName = name.trim();
    if (trimmedName === '') {
      return null;
    }

    // Validate name: max 50 characters
    if (trimmedName.length > 50) {
      return null;
    }

    // Validate URL: required and valid format
    if (!this.validateUrl(url)) {
      return null;
    }

    // Create link object
    const link = {
      id: this.generateId(),
      name: trimmedName,
      url: url.trim(),
      createdAt: Date.now()
    };

    // Add to links array
    this.links.push(link);

    // Save to storage
    this.saveLinks();

    // Re-render
    this.render();

    return link;
  }

  /**
   * Delete a quick link
   * @param {string} linkId - ID of link to delete
   * @returns {boolean} True if link was found and deleted, false otherwise
   */
  deleteLink(linkId) {
    const index = this.links.findIndex(l => l.id === linkId);
    
    if (index === -1) {
      return false;
    }

    // Remove from array
    this.links.splice(index, 1);

    // Save to storage
    this.saveLinks();

    // Re-render
    this.render();

    return true;
  }

  /**
   * Open a link in a new tab
   * @param {string} url - URL to open
   */
  openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const trimmed = url.trim();
    if (trimmed === '') {
      return false;
    }

    // Check for http:// or https:// protocol
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return false;
    }

    // Basic URL format validation using URL constructor
    try {
      new URL(trimmed);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Save links to Local Storage
   */
  saveLinks() {
    StorageManager.set('quickLinks', this.links);
  }

  /**
   * Render links to DOM
   */
  render() {
    if (!this.container) {
      console.error('QuickLinksComponent: Container element not found');
      return;
    }

    // Get or create links list container
    let linksListContainer = this.container.querySelector('.quicklinks-list');
    if (!linksListContainer) {
      linksListContainer = document.createElement('div');
      linksListContainer.className = 'quicklinks-list';
      this.container.appendChild(linksListContainer);
    }

    // Clear container
    linksListContainer.innerHTML = '';

    // If no links, show empty state
    if (this.links.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'No quick links yet. Add one to get started!';
      linksListContainer.appendChild(emptyMessage);
      return;
    }

    // Create links list
    const linksList = document.createElement('ul');
    linksList.className = 'links-list-items';

    this.links.forEach(link => {
      const linkItem = document.createElement('li');
      linkItem.className = 'link-item';

      // Link button (clickable)
      const linkButton = document.createElement('button');
      linkButton.className = 'link-button';
      linkButton.textContent = link.name;
      linkButton.addEventListener('click', () => {
        this.openLink(link.url);
      });

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        this.deleteLink(link.id);
      });

      // Assemble link item
      linkItem.appendChild(linkButton);
      linkItem.appendChild(deleteButton);

      linksList.appendChild(linkItem);
    });

    linksListContainer.appendChild(linksList);
  }

  /**
   * Generate unique link ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuickLinksComponent;
}
