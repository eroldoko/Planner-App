import { DomHelper } from '../Utility/DOMHelper.js';

export class TaskItem {
	constructor(id, updateTaskListsFunction, type) {
		this.id = id;
		this.type = type;
		this.updateTaskListsHandler = updateTaskListsFunction;

		this.connectSwitchButton(type);
		this.connectDeleteButton(type);
		this.connectDrag();
		this.connectEditButton(type);
		this.connectDropDown(id);
	}

	// starting the drag and drop on chosen item.
	connectDrag() {
		document.getElementById(this.id).addEventListener('dragstart', (event) => {
			event.dataTransfer.setData('text/plain', this.id);
			event.dataTransfer.effectAllowed = 'move';
		});
	}

	//assigning the switch logic based on task type
	connectSwitchButton(type) {
		const taskItemElement = document.getElementById(this.id);
		let switchBtn = taskItemElement.querySelector('.switch');

		//logic for clearing the previous event listeners, by creating cloned nodes of switchBtn.
		switchBtn.replaceWith(switchBtn.cloneNode(true));
		switchBtn = taskItemElement.querySelector('.switch');
		switchBtn.textContent = type === 'active' ? 'Done' : 'Activate';

		switchBtn.addEventListener('click', this.updateTaskListsHandler);
	}

	//edit task logic
	editTask(id, type) {
		const taskItemElement = document.getElementById(id);
		let editBtn = taskItemElement.querySelector('.edit');
		let textArea = taskItemElement.querySelector('#editTask');

		if (editBtn.textContent === 'Edit') {
			textArea.disabled = false;
			textArea.focus();
			editBtn.textContent = 'Ok';
		} else if (editBtn.textContent === 'Ok' && type === 'finished') {
			textArea.blur();
			textArea.disabled = true;
			let finishedTasks = DomHelper.tasksFinishedDbLoad();
			let index = finishedTasks.findIndex((item) => item.id === id);
			finishedTasks[index].text = textArea.value.trim();
			DomHelper.tasksFinishedDbSave(finishedTasks);
			editBtn.textContent = 'Edit';
		} else if (editBtn.textContent === 'Ok' && type === 'active') {
			textArea.blur();
			textArea.disabled = true;
			let activeTasks = DomHelper.tasksActiveDbLoad();
			let index = activeTasks.findIndex((item) => item.id === id);
			activeTasks[index].text = textArea.value.trim();
			DomHelper.tasksActiveDbSave(activeTasks);
			editBtn.textContent = 'Edit';
		}

		console.log(editBtn.textContent);
	}

	//delete task logic
	deleteTask(taskId, type) {
		const modal = document.querySelector('.del-modal');
		const backdrop = document.querySelector('#backdrop');
		backdrop.style.display = 'block';
		modal.classList.add('visible');

		console.log(backdrop);
		let buttons = modal.querySelectorAll('button');

		buttons.forEach((el) => {
			if (el.textContent === 'Cancel') {
				el.addEventListener('click', function () {
					modal.classList.remove('visible');
					backdrop.style.display = 'none';
				});
			} else if (el.textContent === 'Yes') {
				el.replaceWith(el.cloneNode(true));
				el = modal.querySelector('button:last-of-type');
				el.addEventListener('click', function () {
					modal.classList.remove('visible');
					backdrop.style.display = 'none';
					const taskItemElement = document.getElementById(taskId);
					taskItemElement.remove();

					console.log(type);
					if (type === 'finished') {
						let finishedTasks = DomHelper.tasksFinishedDbLoad();
						console.log(type);
						console.log(finishedTasks);
						let index = finishedTasks.findIndex((item) => item.id === taskId);

						finishedTasks.splice(index, 1);
						DomHelper.tasksFinishedDbSave(finishedTasks);
					} else if (type === 'active') {
						console.log(type);
						let activeTasks = DomHelper.tasksActiveDbLoad();
						console.log(activeTasks);
						let index = activeTasks.findIndex((item) => item.id === taskId);

						activeTasks.splice(index, 1);
						DomHelper.tasksActiveDbSave(activeTasks);
					}
				});
			}
		});
	}

	//dropdown task content
	dropDown(id) {
		const dropLi = document.getElementById(id);
		const dropDiv = dropLi.querySelector('.taskDiv');

		if (dropDiv.className == 'taskDiv invisible') {
			dropDiv.className = 'taskDiv visibleDiv';
			dropLi.className = 'card task liVisible';
		} else {
			dropDiv.className = 'taskDiv invisible';
			dropLi.className = 'card task';
		}
	}

	//assigning the delete logic based on task type
	connectDeleteButton(type) {
		const taskItemElement = document.getElementById(this.id);
		let deleteBtn = taskItemElement.querySelector('button:first-of-type');

		deleteBtn.addEventListener('click', this.deleteTask.bind(this, this.id, type));
	}

	//assigning the edit logic based on task type
	connectEditButton(type) {
		const taskItemElement = document.getElementById(this.id);
		let editBtn = taskItemElement.querySelector('.edit');

		//logic for clearing the previous event listeners
		editBtn.replaceWith(editBtn.cloneNode(true));
		editBtn = taskItemElement.querySelector('.edit');
		editBtn.addEventListener('click', this.editTask.bind(this, this.id, type));
	}

	//assigning the dropdown logic functionality
	connectDropDown() {
		const liElem = document.getElementById(this.id);
		let titleHeader = liElem.querySelector('h2');
		titleHeader.replaceWith(titleHeader.cloneNode(true));
		titleHeader = liElem.querySelector('h2');
		titleHeader.addEventListener('click', this.dropDown.bind(this, this.id));
	}
}
