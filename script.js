// script.js
// Estado de la aplicación
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Elementos del DOM
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Funciones principales mejoradas
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        todoInput.focus();
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(todo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
    
    // Efecto visual de confirmación
    addBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addBtn.style.transform = '';
    }, 150);
}

function deleteTodo(id) {
    const todoElement = document.querySelector(`[data-id="${id}"]`);
    if (todoElement) {
        todoElement.style.opacity = '0';
        todoElement.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }, 300);
    }
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        
        // Animación al completar
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('completed-animation');
            setTimeout(() => {
                todoElement.classList.remove('completed-animation');
            }, 400);
        }
    }
}

function clearCompleted() {
    const completedTodos = todos.filter(t => t.completed);
    if (completedTodos.length === 0) return;
    
    if (confirm(`¿Eliminar ${completedTodos.length} tarea(s) completada(s)?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
    });
}

function renderTodos() {
    // Filtrar todos según el filtro actual
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    // Limpiar lista
    todoList.innerHTML = '';
    
    // Mostrar estado vacío si no hay tareas
    if (filteredTodos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>${currentFilter === 'all' ? 'No hay tareas' : 
                currentFilter === 'active' ? '¡No hay tareas pendientes!' : 
                'No hay tareas completadas'}</p>
            <small>${currentFilter === 'all' ? 
                '¡Agrega tu primera tarea para comenzar!' : 
                currentFilter === 'active' ? '🎉 ¡Todo completado!' : 
                'Completa algunas tareas primero'}</small>
        `;
        todoList.appendChild(emptyState);
        todoList.classList.add('empty');
    } else {
        todoList.classList.remove('empty');
    }
    
    // Renderizar cada todo
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);
        
        li.innerHTML = `
            <div class="todo-checkbox-container">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="custom-checkbox"></div>
            </div>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">Eliminar</button>
        `;
        
        // Event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(li);
    });
    
    updateCounts();
}

function updateCounts() {
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;
    const totalCount = todos.length;
    
    // Actualizar contadores
    document.getElementById('allCount').textContent = totalCount;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('completedCount').textContent = completedCount;
    
    // Actualizar mensaje de tareas pendientes
    const itemsLeft = document.getElementById('itemsLeft');
    if (activeCount === 0 && totalCount > 0) {
        itemsLeft.textContent = '🎉 ¡Todas las tareas completadas!';
        itemsLeft.style.color = 'var(--success)';
    } else if (activeCount === 1) {
        itemsLeft.textContent = '1 tarea pendiente';
        itemsLeft.style.color = 'var(--warning)';
    } else {
        itemsLeft.textContent = `${activeCount} tareas pendientes`;
        itemsLeft.style.color = '';
    }
    
    // Habilitar/deshabilitar botón de limpiar
    clearCompletedBtn.disabled = completedCount === 0;
    if (completedCount === 0) {
        clearCompletedBtn.style.opacity = '0.5';
    } else {
        clearCompletedBtn.style.opacity = '1';
    }
}

// Event listeners mejorados
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

todoInput.addEventListener('input', () => {
    if (todoInput.value.trim() !== '') {
        addBtn.disabled = false;
        addBtn.style.opacity = '1';
    } else {
        addBtn.disabled = false;
        addBtn.style.opacity = '0.9';
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Inicializar con datos de ejemplo si está vacío
if (todos.length === 0) {
    const sampleTodos = [
        {
            id: 1,
            text: 'Bienvenido a tu lista de tareas',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            text: 'Haz clic en el checkbox para completar',
            completed: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 3,
            text: 'Prueba a agregar una nueva tarea',
            completed: false,
            createdAt: new Date(Date.now() - 172800000).toISOString()
        }
    ];
    
    todos = sampleTodos;
    saveTodos();
}

// Inicializar la aplicación
renderTodos();
todoInput.focus();

// Efecto de carga inicial
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});