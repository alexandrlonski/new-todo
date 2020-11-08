'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector('.todo-container');
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData ])); 
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.input.value = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
    
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML('beforeend', `
    <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
          <button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
        </div>`);
        if(todo.completed) {
          this.todoCompleted.append(li);
          li.classList.add('no-active');
        } else {
          this.todoList.append(li);
          li.classList.remove('no-active');
        }
        if(todo.opacity === '0'){
          
        }
  }
  addTodo(e) {
    e.preventDefault();
    console.log(this);
    if(this.input.value.trim()) {
      const newTodo = {
      value: this.input.value,
      completed: false,
      key: this.generateKey(),
      opacity: 1,
    };
    this.todoData.set(newTodo.key, newTodo);
    this.render();
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  deleteItem(itemLi) {
     itemLi.remove(itemLi);
      this.todoData.forEach((item, index) => {
      if(item.key === itemLi.key) {
       this.todoData.delete(index);
       this.render();
       console.log(itemLi);
      }
    });
  }

  completedItem(itemLi) {
    this.todoData.forEach((item) => {
      if(item.key === itemLi.key) {
        item.completed = !item.completed;
        // itemLi.classList.toggle('no-active');
        
       item.opacity = '0';
       this.render();
      }
      
    }); 
  }

  edit(itemLi) {
    this.todoData.forEach((item, index) => {
      if(item.key === itemLi.key) {
        let elem = itemLi.querySelector('.text-todo');
        elem.contentEditable = true;
        itemLi.addEventListener('input', () => {
            elem = itemLi.querySelector('.text-todo');    
            item.value = elem.innerText;
            this.addToStorage();
        });
      }
    });
  }

  handler() {
    this.todoContainer.addEventListener('click', (event) => {
     let target = event.target;
      if(target.matches('.todo-remove')) {
       this.deleteItem(target.closest('.todo-item'));
      
      } else if(target.matches('.todo-complete')) {
        this.completedItem(target.closest('.todo-item'));
      } else if(target.matches('.todo-edit')) {
        this.edit(target.closest('.todo-item'));
      }
      
    });
  }

  init() {
    this.input.required = true;
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.handler();
    this.render();
  }
};

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();