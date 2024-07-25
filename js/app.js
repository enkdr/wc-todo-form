console.log("wc-todo-form");

class WCForm extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM to the custom element
        this.attachShadow({ mode: 'open' });

        // Create template content
        const template = document.createElement('template');
        template.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 400px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input, button {
            font-size: 16px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f0f0f0;
          margin: 5px 0;
          padding: 10px;
          border-radius: 4px;
        }
        .remove-button {
          background: #ff4d4d;
          border: none;
          color: white;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        .remove-button:hover {
          background: #ff1a1a;
        }
      </style>
      <form>
        <label for="itemInput">Add an item</label>
        <input type="text" id="itemInput">
        <button type="submit">Add item</button>
      </form>
      <ul></ul>
    `;

        // Clone template content and append it to shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Bind DOM elements
        this.form = this.shadowRoot.querySelector('form');
        this.ul = this.shadowRoot.querySelector('ul');
        this.field = this.shadowRoot.querySelector('input');

        // Bind event handler
        this.form.addEventListener('submit', this.handleEvent.bind(this));

        // Load items from local storage
        this.loadItems();
    }

    handleEvent(event) {
        event.preventDefault();
        const value = this.field.value.trim();
        if (value) {
            const id = crypto.randomUUID();
            const item = { id, value };
            this.addItem(item);
            this.field.value = '';
        }
    }

    addItem(item) {
        // Check if item already exists to prevent duplicates
        const existingItems = Array.from(this.ul.children).map(li => li.dataset.id);
        if (existingItems.includes(item.id)) return;

        const li = document.createElement('li');
        li.innerHTML = `${item.value} <button class="remove-button">Remove</button>`;
        li.dataset.id = item.id; // Store the item ID in a data attribute
        li.querySelector('.remove-button').addEventListener('click', () => this.removeItem(li, item.id));
        this.ul.appendChild(li);
        this.saveToLocalStorage(item);
    }

    removeItem(li, id) {
        li.remove();
        this.removeFromLocalStorage(id);
    }

    saveToLocalStorage(item) {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }

    removeFromLocalStorage(id) {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(items));
    }

    loadItems() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.forEach((item) => this.addItem(item));
    }
}

// Define the custom element
customElements.define('wc-form', WCForm);
