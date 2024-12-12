const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#user-input");
const listContainer = document.querySelector("#list-container");
const clearButton = document.querySelector("#clear-list-button");
const showCompleted = document.querySelector("#show-completed");
const sortBy = document.querySelector("#sort-by");

//Empty array
let tasks = [];

// Getting localStorage
showCompleted.checked = localStorage.getItem("showCompleted") === "true";
sortBy.value = localStorage.getItem("sortBy");
const storedTask = localStorage.getItem("tasks");
if (storedTask) {
  tasks = JSON.parse(storedTask);
  buildList(tasks);
}

// Text input for task elements
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevents refreshing the website
  const formData = new FormData(taskForm);
  //trigger error if task is empy
  if (!formData.get("user-input")) {
    showError("You can't submit an empty task");
    return;
  }
  //lager nytt task object og pusher til task variable
  const taskDescription = formData.get("user-input").trim();
  if (taskDescription === "") return;
  tasks.push({
    timeStamp: new Date().toLocaleString("en-UK"),
    description: formData.get("user-input"),
    completed: false,
  });
  buildList(filterAndSort(tasks));
  saveStateToLocalStorage();
});

function showError(message) {
  const modal = document.createElement("dialog");

  const errorMsg = document.createElement("p");
  errorMsg.textContent = message;

  const closeModal = document.createElement("button");
  closeModal.textContent = "Got it";
  modal.append(errorMsg, closeModal);
  document.body.append(modal);

  modal.showModal();
  window.addEventListener("click", () => {
    modal.close();
    window.removeEventListener("click", closeModal);
  });
}

showCompleted.addEventListener("change", () => {
  renderList(tasks);
});

sortBy.addEventListener("change", () => {
  renderList(tasks);
});

function renderList(taskArr) {
  //clear local storage if task array is empty
  if (taskArr.length === 0) {
    localStorage.removeItem("tasks");
    localStorage.removeItem("showCompleted");
    localStorage.removeItem("sortBy");
  }
  buildList(filterAndSort(taskArr));
  saveStateToLocalStorage();
}

function filterAndSort(arr) {
  return arr
    .filter((e) => (!showCompleted.checked ? !e.completed : e))
    .sort((a, b) => {
      if (sortBy.value === "time-asc") {
        return new Date(a.timeStamp) - new Date(b.timeStamp);
      } else if (sortBy.value === "time-desc") {
        return new Date(b.timeStamp) - new Date(a.timeStamp);
      } else if (sortBy.value === "alpha-asc") {
        return b.description.localeCompare(a.description);
      } else if (sortBy.value === "alpha-desc") {
        return a.description.localeCompare(b.description);
      }
    });
}

function buildList(taskArr) {
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
    if (task.completed) {
      taskContainer.classList.add("completed");
    }
    const completedElem = document.createElement("input");
    completedElem.type = "checkbox";
    completedElem.checked = task.completed;

    // Save the check mark to localStorage
    completedElem.addEventListener("change", () => {
      tasks[i].completed = completedElem.checked;
      saveStateToLocalStorage();
      if (task.completed) {
        taskContainer.classList.add("completed");
      } else {
        taskContainer.classList.remove("completed");
      }
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
clearButton.addEventListener("click", () => {
  tasks = [];
  buildList(tasks);
  saveStateToLocalStorage();
});

// Storing the task list in localStorage
function saveStateToLocalStorage() {
  //Serialize task array to JSON before storing to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
  //store boolean value of showCompleted checkbox
  localStorage.setItem("showCompleted", showCompleted.checked);
  //store the value of the sort by select element
  localStorage.setItem("sortBy", sortBy.value);
}
