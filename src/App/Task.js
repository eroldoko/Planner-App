export class Task {
  constructor(task) {
    this.id = task.id;
    this.title = task.title;
    this.text = task.text;
    this.idCheck = task.idCheck;
  }


  //creating a task in DOM
  createEl() {
    const newListEl = document.createElement("li");
    newListEl.id = this.id;

    newListEl.classList.add("card", "task");
    newListEl.setAttribute("draggable", true);
    newListEl.innerHTML = `<input type="checkbox" id= "${this.idCheck}" />
    <label for = "${this.idCheck}">
      <span class="check-mark">&#10004;</span>
      <span class="custom-checkbox"></span>
    </label>
    <h2> ${this.title} <span id = "icon"><i class="fas fa-chevron-circle-down"></i></span></h2>
    <div class = "taskDiv invisible">
    <textarea class = "taskArea" id="editTask" disabled> ${this.text}</textarea>
    <button class="alt delete">Delete</button>
    <button class="switch"></button>
     <button class="edit">Edit</button>
     </div>
    `;

    return newListEl;
  }
}
