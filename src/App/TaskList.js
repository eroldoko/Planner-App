import { TaskItem } from './TaskItem.js';
import * as DOMH from '../Utility/DOMHelper.js';

export class TaskList {
	constructor(type) {
		this.finishedTasks = DOMH.DomHelper.tasksFinishedDbLoad();
		this.activeTasks = DOMH.DomHelper.tasksActiveDbLoad();
		this.tasks = [];
		this.type = type;
		this.removeCompleteBtnAct = document.querySelector('.remove-complete-btnAct');
		this.removeCompleteBtnFin = document.querySelector('.remove-complete-btnFin');
		this.removeCompleteBtnAct.addEventListener('click', this.clearCompleteActive.bind(this));
		this.removeCompleteBtnFin.addEventListener('click', this.clearCompleteFinished.bind(this));

		const taskItems = document.querySelectorAll(`#${type}-tasks li`);
		for (const taskItem of taskItems) {
			this.tasks.push(new TaskItem(taskItem.id, this.switchTask.bind(this, taskItem.id), this.type));
		}
		this.connectDroppable(); // initializing drag and drop
	}

	//clear--complete for Active tasks logic
	clearCompleteActive() {
		const tasksActive = document.querySelector('#active-tasks');
		const tasks = tasksActive.querySelectorAll('.card');
		const modal = document.querySelector('.del-modal');
		const backdrop = document.querySelector('#backdrop');

		tasks.forEach((task) => {
			const checked = task.querySelector('input').checked;
			if (checked) {
				let checkArr = [];
				checkArr.push(checked);
				if (checkArr.length > 0) {
					backdrop.style.display = 'block';
					modal.classList.add('visible');
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
								tasks.forEach((task) => {
									const checked = task.querySelector('input').checked;
									if (checked) {
										task.remove();
										console.log(task.id);

										let activeTasks = DOMH.DomHelper.tasksActiveDbLoad();
										console.log(activeTasks);
										let index = activeTasks.findIndex((item) => item.id === task.id);

										activeTasks.splice(index, 1);
										DOMH.DomHelper.tasksActiveDbSave(activeTasks);
									}
								});
							});
						}
					});
				}
			}
		});
	}

	//clear--complete for Finished tasks logic
	clearCompleteFinished() {
		const tasksFinished = document.querySelector('#finished-tasks');
		const tasks = tasksFinished.querySelectorAll('.card');
		const modal = document.querySelector('.del-modal');
		const backdrop = document.querySelector('#backdrop');

		tasks.forEach((task) => {
			const checked = task.querySelector('input').checked;
			if (checked) {
				let checkArr = [];
				checkArr.push(checked);
				if (checkArr.length > 0) {
					backdrop.style.display = 'block';
					modal.classList.add('visible');
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

								tasks.forEach((task) => {
									const checked = task.querySelector('input').checked;
									if (checked) {
										task.remove();
										console.log(task.id);

										let finishedTasks = DOMH.DomHelper.tasksFinishedDbLoad();

										console.log(finishedTasks);
										let index = finishedTasks.findIndex((item) => item.id === task.id);

										finishedTasks.splice(index, 1);
										DOMH.DomHelper.tasksFinishedDbSave(finishedTasks);
									}
								});
							});
						}
					});
				}
			}
		});
	}

	//drag and drop functionality
	connectDroppable() {
		const list = document.querySelector(`#${this.type}-tasks ul`);
		list.addEventListener('dragenter', (event) => {
			if (event.dataTransfer.types[0] === 'text/plain') {
				event.preventDefault();
			}
			list.parentElement.classList.add('droppable'); //feedback for user, changing the color of droppable zone
		});

		list.addEventListener('dragover', (event) => {
			if (event.dataTransfer.types[0] === 'text/plain') {
				event.preventDefault();
			}
		});

		list.addEventListener('dragleave', (event) => {
			//feedback for user, changing the color of leaving zone
			if (event.relatedTarget.closest(`#${this.type}-tasks ul`) !== list) {
				list.parentElement.classList.remove('droppable');
			}
		});

		//logic for droping at correct position, moving between active and finished.
		list.addEventListener('drop', (event) => {
			const taskId = event.dataTransfer.getData('text/plain');
			if (this.tasks.find((p) => p.id === taskId)) {
				return;
			}

			document.getElementById(taskId).querySelector('.switch').click();
			list.parentElement.classList.remove('droppable');
		});
	}

	//function for setting the switching functionality between active and finished
	setSwitchHandlerFunction(switchHandlerFunction) {
		this.switchHandler = switchHandlerFunction;
	}

	//function for switching between active and finished tasks.
	addTask(task) {
		this.tasks.push(task);

		DOMH.moveElement(task.id, `#${this.type}-tasks ul`);

		if (this.type == 'finished') {
			this.finishedTasks = DOMH.DomHelper.tasksFinishedDbLoad();
			this.activeTasks = DOMH.DomHelper.tasksActiveDbLoad();

			let index = this.activeTasks.findIndex((t) => t.id === task.id);

			this.finishedTasks.push(this.activeTasks[index]);
			localStorage.finishedTasks = JSON.stringify(this.finishedTasks);
			this.activeTasks.splice(index, 1);
			DOMH.DomHelper.tasksActiveDbSave(this.activeTasks);
		} else if (this.type == 'active') {
			this.finishedTasks = DOMH.DomHelper.tasksFinishedDbLoad();
			this.activeTasks = DOMH.DomHelper.tasksActiveDbLoad();

			let index = this.finishedTasks.findIndex((p) => p.id === task.id);

			this.activeTasks.push(this.finishedTasks[index]);
			DOMH.DomHelper.tasksActiveDbSave(this.activeTasks);

			this.finishedTasks.splice(index, 1);
			DOMH.DomHelper.tasksFinishedDbSave(this.finishedTasks);
		}
		task.updateTaskListsHandler = this.switchTask.bind(this, task.id);
		task.connectSwitchButton(this.type);
		task.connectDeleteButton(this.type);
		task.connectEditButton(this.type);
	}
	switchTask(taskId) {
		this.switchHandler(this.tasks.find((t) => t.id === taskId));
		this.tasks = this.tasks.filter((t) => t.id !== taskId);
	}
}
