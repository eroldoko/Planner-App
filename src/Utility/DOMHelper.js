import { Task } from "../App/Task.js";
import { App } from "../app.js";

//Dom Helper class, for localStorage logic, rendering the Dom, and moving of the tasks between active and finished
export class DomHelper {
  static tasksActiveDbSave(taskArr) {
    localStorage.taskActiveData = JSON.stringify(taskArr);
  }

  static tasksActiveDbLoad() {
    if (localStorage.taskActiveData) {
      let taskList = JSON.parse(localStorage.taskActiveData);
      return taskList;
    } else {
      return [];
    }
  }

  static tasksIds() {
    if (localStorage.tasksIds) {
      let taskList = JSON.parse(localStorage.tasksIds);
      return taskList;
    } else {
      return [];
    }
  }

  static tasksFinishedDbSave(taskArr) {
    localStorage.finishedTasks = JSON.stringify(taskArr);
  }

  static tasksFinishedDbLoad() {
    if (localStorage.finishedTasks) {
      let taskFinList = JSON.parse(localStorage.finishedTasks);
      return taskFinList;
    } else {
      return [];
    }
  }

  static domDbRender() {
    let taskListActDom = document.querySelector(`#active-tasks ul`);
    let taskListFinDom = document.querySelector(`#finished-tasks ul`);
    let taskListActDomDb = DomHelper.tasksActiveDbLoad();

    for (const task of taskListActDomDb) {
      const taskItemEl = new Task(task);
      const newELementTask = taskItemEl.createEl();
      taskListActDom.prepend(newELementTask);
    }

    if (localStorage.finishedTasks) {
      let taskListFinDomDb = DomHelper.tasksFinishedDbLoad();

      for (const task of taskListFinDomDb) {
        const taskItemEl = new Task(task);
        const newELementTask = taskItemEl.createEl();
        taskListFinDom.appendChild(newELementTask);
      }
    }

    App.tasksInit();
  }
}

//function for moving task around, between active and finished.
export function moveElement(elementId, newDestinationSelector) {
  const element = document.getElementById(elementId);
  const destinationElement = document.querySelector(newDestinationSelector);
  destinationElement.prepend(element);
  element.scrollIntoView({ behavior: "smooth" });
}
