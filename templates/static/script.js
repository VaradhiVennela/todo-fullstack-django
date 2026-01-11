class App {
    constructor() {
        this.todos = [];
        this.init();
    }
    
    init() {
        document.getElementById('form').onsubmit = (e) => this.addTodo(e);
        document.getElementById('filter').onchange = () => this.load();
        this.load();
    }
    
    async request(url, options) {
        const response = await fetch(`http://localhost:8000/api${url}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        if (!response.ok) throw new Error('API error');
        return response.json();
    }
    
    async load() {
        const filter = document.getElementById('filter').value;
        const params = filter ? `?status=${filter}` : '';
        this.todos = await this.request(`/fbv/todos/${params}`);
        this.render();
    }
    
    async addTodo(e) {
        e.preventDefault();
        const data = {
            title: document.getElementById('title').value,
            description: document.getElementById('desc').value,
            status: false,
            due_date: document.getElementById('date').value
        };
        
        await this.request('/fbv/todos/create/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        document.getElementById('form').reset();
        this.load();
    }
    
    async deleteTodo(id) {
        if (confirm('Delete?')) {
            await this.request(`/fbv/todos/${id}/`, { method: 'DELETE' });
            this.load();
        }
    }
    async function addTodo() {
    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('description').value,
        due_date: document.getElementById('dueDate').value,
        status: false
    };

    const response = await fetch('/api/fbv/todos/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        loadTodos(); // Refresh the list
    }
}
    async function loadTodos(statusFilter = '') {
    // statusFilter can be '0' (Pending) or '1' (Completed)
    const url = `/api/fbv/todos/${statusFilter ? '?status=' + statusFilter : ''}`;
    const response = await fetch(url);
    const todos = await response.json();
    
    const container = document.getElementById('todo-container');
    container.innerHTML = todos.map(todo => `
        <div class="todo-card">
            <h3>${todo.title}</h3>
            <p>Status: ${todo.status ? '✅ Done' : '⏳ Pending'}</p>
            <button onclick="viewDetail(${todo.id})">View Details</button>
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        </div>
    `).join('');
}
    render() {
        const container = document.getElementById('todos');
        container.innerHTML = this.todos.map(todo => `
            <div class="todo ${todo.status ? 'completed' : ''}">
                <div class="title">${todo.title}</div>
                <div class="desc">${todo.description}</div>
                <div class="date">Due: ${todo.due_date}</div>
                <div class="buttons">
                    <button class="edit" onclick="app.editTodo(${todo.id})">Edit</button>
                    <button class="delete" onclick="app.deleteTodo(${todo.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

const app = new App();
