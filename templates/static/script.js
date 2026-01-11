document.addEventListener('DOMContentLoaded', function() {
    const app = {
        todos: [],
        
        async init() {
            this.bindEvents();
            await this.loadTodos();
        },

        bindEvents() {
            const form = document.getElementById('form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleAddSubmit(e));
            }
            
            const filter = document.getElementById('filter');
            if (filter) {
                filter.addEventListener('change', () => this.loadTodos());
            }
        },

        async apiRequest(endpoint, options = {}) {
            try {
                const response = await fetch(`/api${endpoint}`, {
                    method: options.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: options.body ? JSON.stringify(options.body) : null
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Server Error:', errorData);
                    throw new Error(`HTTP ${response.status}`);
                }
                
                return response.status === 204 ? null : await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return null;
            }
        },

        async loadTodos() {
            const filter = document.getElementById('filter').value;
            const params = filter !== "" ? `?status=${filter}` : '';
            
            const container = document.getElementById('todos');
            container.innerHTML = '<div class="loading">Loading todos...</div>';
            
            const data = await this.apiRequest(`/fbv/todos/${params}`);
            if (data) {
                this.todos = data;
                this.renderTodos();
            }
        },

        async handleAddSubmit(e) {
            e.preventDefault();
            const data = {
                title: document.getElementById('title').value,
                description: document.getElementById('desc').value,
                status: false,
                due_date: document.getElementById('date').value 
            };
            
            const result = await this.apiRequest('/fbv/todos/create/', {
                method: 'POST',
                body: data
            });

            if (result) {
                document.getElementById('form').reset();
                await this.loadTodos(); 
            } else {
                alert("Failed to save. Check terminal for errors.");
            }
        },
        
        async deleteTodo(id) {
            if (confirm('Delete this task?')) {
                await this.apiRequest(`/fbv/todos/${id}/`, {
                    method: 'DELETE'
                });
                await this.loadTodos();
            }
        },

        renderTodos() {
            const container = document.getElementById('todos');
            
            if (this.todos.length === 0) {
                container.innerHTML = '<div class="empty-state">🎉 No tasks found.</div>';
                return;
            }
            
            container.innerHTML = this.todos.map(todo => `
                <div class="todo ${todo.status ? 'completed' : ''}">
                    <div class="title">${todo.title}</div>
                    <div class="date">Due: ${todo.due_date || 'No Date'}</div>
                    <div class="buttons">
                        <button class="delete" onclick="app.deleteTodo(${todo.id})">🗑️ Delete</button>
                    </div>
                </div>
            `).join('');
        }
    };
    
    window.app = app;
    app.init();
});