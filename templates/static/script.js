document.addEventListener('DOMContentLoaded', function() {
    const app = {
        todos: [],
        
        async init() {
            this.bindEvents();
            await this.loadTodos();
        },
        
        bindEvents() {
            document.getElementById('todoForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTodo();
            });
            
            document.getElementById('filter').addEventListener('change', () => {
                this.loadTodos();
            });
        },
        
        async apiRequest(endpoint, options = {}) {
            try {
                const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
                    method: options.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: options.body ? JSON.stringify(options.body) : null
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return [];
            }
        },
        
        async loadTodos() {
            const filter = document.getElementById('filter').value;
            const params = filter ? `?status=${filter}` : '';
            
            document.getElementById('todos').innerHTML = '<div class="loading">Loading todos...</div>';
            
            const todos = await this.apiRequest(`/api/fbv/todos/${params}`);
            this.todos = todos;
            this.renderTodos();
        },
        
        async addTodo() {
            const formData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                status: false,
                due_date: document.getElementById('dueDate').value
            };
            
            await this.apiRequest('/api/fbv/todos/create/', {
                method: 'POST',
                body: formData
            });
            
            document.getElementById('todoForm').reset();
            this.loadTodos();
        },
        
        async deleteTodo(id) {
            if (confirm('Are you sure you want to delete this todo?')) {
                await this.apiRequest(`/api/fbv/todos/${id}/`, {
                    method: 'DELETE'
                });
                this.loadTodos();
            }
        },
        
        renderTodos() {
            const container = document.getElementById('todos');
            
            if (this.todos.length === 0) {
                container.innerHTML = '<div class="empty-state">🎉 No todos yet! Add one above.</div>';
                return;
            }
            
            container.innerHTML = this.todos.map(todo => `
                <div class="todo-item">
                    <div class="todo-title">${todo.title}</div>
                    <div class="todo-description">${todo.status ? '✅ Completed' : '⏳ Pending'}</div>
                    <div class="todo-meta">
                        <span class="status-badge status-${todo.status ? 'completed' : 'pending'}">
                            ${todo.status ? 'Completed' : 'Pending'}
                        </span>
                        <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }
    };
    
    window.app = app;
    app.init();
});
