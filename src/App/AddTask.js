import { Task } from "./Task.js";
import { DomHelper } from "../Utility/DOMHelper.js";
import { App } from "../app.js";

//adding new task
export class AddTask {
  constructor() {
    this.backdrop = document.querySelector("#backdrop");
    this.modal = document.querySelector(".modal");
    this.addTaskModal = document.getElementById("addTaskModal");
    this.addTaskModal.addEventListener("click", this.showModal.bind(this));
    this.addTask = document.querySelector(".addTask");

    this.cancelTask = document.querySelector(".cancelAdd");
    this.cancelTask.addEventListener("click", this.hideModal.bind(this));

    this.addTask.addEventListener("click", this.createTask.bind(this));
    this.taskListActDom = document.querySelector(`#active-tasks ul`);
  }

  showModal() {
    this.backdrop.style.display = "block";
    this.modal.classList.add("visible");
  }

  hideModal() {
    this.backdrop.style.display = "none";
    this.modal.classList.remove("visible");
  }
  ///creating of new task
  createTask() {
    const taskTitle = this.modal.querySelector("#title");
    const taskText = this.modal.querySelector("#textarea");

    const titleValue = taskTitle.value;
    const textValue = taskText.value;

    //adding new task in modal validation
    if (taskTitle.value == "") {
      taskTitle.placeholder = "Please provide the Task Title";
    } else if (taskText.value == "") {
      taskText.placeholder = "Please provide the Task Text";
    } else if (taskTitle.value !== "" && taskText.value !== "") {
      let tasksActive = DomHelper.tasksActiveDbLoad();
      let newTasksIds = DomHelper.tasksIds();
      let p;

      //logic for assigning unique id's to tasks, upon adding every new task
      if (newTasksIds.length < 1) {
        p = 1;
        newTasksIds.push(p);
        localStorage.tasksIds = JSON.stringify(newTasksIds);
      } else {
        p = newTasksIds.length + 1;
        newTasksIds.push(p);
        localStorage.tasksIds = JSON.stringify(newTasksIds);
      }

      const newTask = {
        id: new Date().toString(),
        title: titleValue,
        text: textValue,
        idCheck: p,
      };

      tasksActive.push(newTask);
      DomHelper.tasksActiveDbSave(tasksActive);

      const newElementTask = new Task(newTask);
      const newELementTaskDom = newElementTask.createEl();

      this.taskListActDom.prepend(newELementTaskDom);

      //initialization of TaskList's
      App.tasksInit();

      taskTitle.value = "";
      taskText.value = "";

      this.hideModal();
    }
  }
}
