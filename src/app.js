import { TaskList } from "./App/TaskList.js";
import { AddTask } from "./App/AddTask.js";
import { DomHelper } from "./Utility/DOMHelper.js";

export class App {
  static init() {
    //rendering the Dom and initializing adding of new task.
    DomHelper.domDbRender();
    new AddTask();
  }

  static tasksInit() {

    //initializing the Task lists
    const activeTaskList = new TaskList(`active`);
    const finishedTaskList = new TaskList(`finished`);

    //logic for setting the switching functionality between active and finished tasks.
    activeTaskList.setSwitchHandlerFunction(
      finishedTaskList.addTask.bind(finishedTaskList)
    );
    finishedTaskList.setSwitchHandlerFunction(
      activeTaskList.addTask.bind(activeTaskList)
    );
  }

}
//starting the app
App.init();
