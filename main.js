const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#user-input");
const listContainer = document.querySelector("#list-container");
const clearButton = document.querySelector("#clear-list-button");

//Empty array
let tasks = [];

// Getting localStorage
const storedTask = localStorage.getItem("tasks");
if (storedTask) {
  tasks = JSON.parse(storedTask);
  renderList(tasks);
}

// Text input for task elements
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevents refreshing the website
  const formData = new FormData(taskForm);
  tasks.push({
    timeStamp: new Date().toLocaleString("en-UK"),
    description: formData.get("user-input"),
    completed: false,
  });
  renderList(tasks);
  saveStateToLocalStorage();
});

function renderList(taskArr) {
  // Empty list
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }

  taskArr.forEach((task, i) => {
    // Create the task container
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    // Create the timestamp
    const timeStampElem = document.createElement("p");
    timeStampElem.classList.add("timestamp");
    timeStampElem.textContent = task.timeStamp;

    // Create the task description
    const descriptionElem = document.createElement("input");
    descriptionElem.classList.add("description");
    descriptionElem.value = task.description;
    descriptionElem.readOnly = true;

    // Add task-completed checkbox
    const completedElem = document.createElement("input");
    completedElem.type = "checkbox";
    completedElem.checked = task.completed;

    // Save the check mark to localStorage
    completedElem.addEventListener("change", () => {
      tasks[i].completed = completedElem.checked;
      saveStateToLocalStorage();
    });

    // Add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");

    // Edit button functionality (toggle read-only state)
    editButton.addEventListener("click", () => {
      descriptionElem.readOnly = !descriptionElem.readOnly;
      editButton.textContent = descriptionElem.readOnly ? "Edit" : "Save";
      if (!descriptionElem.readOnly) {
        descriptionElem.focus();
      }
      saveStateToLocalStorage();
    });

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    // Delete button functionality
    deleteButton.addEventListener("click", () => {
      tasks.splice(i, 1);
      renderList(tasks);
      saveStateToLocalStorage();
    });

    // Append elements to the task container
    taskContainer.append(
      timeStampElem,
      descriptionElem,
      completedElem,
      editButton,
      deleteButton
    );
    listContainer.prepend(taskContainer);
  });
}

// Clear list button
clearButton.textContent = "Clear list";
clearButton.addEventListener("click", () => {
  tasks = [];
  renderList();
  saveStateToLocalStorage();
});

// Storing the task list in localStorage
function saveStateToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
