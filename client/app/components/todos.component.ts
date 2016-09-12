import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import 'rxjs/add/operator/map';
import { Todo } from '../Todo';
console.log(Todo);

@Component({
	moduleId: module.id,
	selector: 'todos',
	templateUrl: 'todos.component.html'
})

export class TodosComponent implements OnInit {
	todos: Todo[];
	constructor(private _todoService: TodoService) {

	}
	ngOnInit() {
		this.todos = [];
		this._todoService.getTodos()
		.map(res => res.json())
		.subscribe(todos => this.todos = todos)
	}
	addTodo($event, todoText) {
		if ($event.which === 1 || $event.which === 13) {
			var result;
			var newTodo = {
				text: todoText.value,
				isCompleted: false
			};
			result = this._todoService.saveTodo(newTodo);
			result.subscribe(x => {
				this.todos.push(newTodo);
				todoText.value = '';
			})
		}
	}
	updateStatus(todo) {
		var _todo = {
			_id: todo._id,
			text: todo.text,
			isCompleted: !todo.isCompleted
		};
		this._todoService.updateTodo(_todo)
			.map(res => res.json())
			.subscribe(data => {
				todo.isCompleted = !todo.isCompleted;
			})
	}
	setEditState(todo, state) {
		if (state) {
			todo.isEditMode = state;
		}
		else {
			delete todo.isEditMode;
		}
	}
	updateTodoText($event, todo) {
		if ($event.which === 13) {
			todo.text = $event.target.value;
			let { text, _id, isCompleted } = todo;
			let _todo = {
				_id,
				text,
				isCompleted
			};

			this._todoService.updateTodo(_todo)
				.map(res => res.json())
				.subscribe(data => {
					this.setEditState(todo, false);
				});
		}
	}
	deleteTodo(todo) {
		let todos = this.todos;
		this._todoService.deleteTodo(todo._id)
			.map(res => res.json())
			.subscribe(data => {
				if (data.n === 1) {
					const filteredItem = todos.filter(t => {
						return t._id === todo._id;
					})[0];
					console.log(filteredItem);
					const i = todos.indexOf(filteredItem);
					todos.splice(filteredItem, 1);
					console.log(todos);
				}
			})
	}
}
