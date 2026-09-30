const taskForm = document.querySelector(".task-form");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskPriority = document.getElementById("taskPriority");
const cancelBtn = document.getElementById("cancel");
const container = document.querySelector(".container");
const noTasks = document.querySelector(".no-tasks");
const taskTitleWarning = document.querySelector(".task-title-warning");
const taskDescWarning = document.querySelector(".task-desc-warning");
const taskCount = document.getElementById("taskCount");

// Variables
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

// Validate Title
function validateTitle(title) {

if (title.trim().length < 4) {
    taskTitleWarning.style.display = "block";
    return false;
}

taskTitleWarning.style.display = "none";
return true;

}

// Validate Description
function validateDescription(description) {

if (description.trim().length < 10) {
    taskDescWarning.style.display = "block";
    return false;
}

taskDescWarning.style.display = "none";
return true;

}

// Save Tasks in LocalStorage
function saveToLocalStorage() {

localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
);

}

// Display Tasks
function displayTasks() {

container.innerHTML = "";

taskCount.textContent = tasks.length;

// No Tasks
if (tasks.length === 0) {
    noTasks.style.display = "block";
    return;
}

noTasks.style.display = "none";

// Create Cards
tasks.forEach(function (task, index) {

    const taskElement = document.createElement("div");

    taskElement.className = "task-item";

    // Add completed class if task is completed
    if (task.completed) {
        taskElement.classList.add("task-completed");
    }

    taskElement.innerHTML = `

        <div class="task-title-row">

            <h3 class="task-item-title">
                ${
                    task.completed
                        ? `<span class="completed-check">✓</span>`
                        : ""
                }

                ${task.taskTitle}
            </h3>

            ${
                task.completed
                    ? `<span class="completed-badge">✓ Completed</span>`
                    : ""
            }

        </div>

        <p class="task-item-desc">
            ${task.taskDesc}
        </p>

        <span class="task-item-periority ${task.taskPriority}">
            ${task.taskPriority}
        </span>

        <div class="task-actions">

            <button
                class="done-btn ${task.completed ? "undo-btn" : ""}"
                onclick="toggleTask(${index})"
            >
                ${
                    task.completed
                        ? "↩️ Undo"
                        : "✅ Mark as Done"
                }
            </button>

            <button
                class="edit-btn"
                onclick="editTask(${index})"
            >
                ✏️ Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})"
            >
                🗑️ Delete
            </button>

        </div>
    `;

    container.appendChild(taskElement);
});

}

// Add / Edit Task
taskForm.addEventListener(
"submit",
function (e) {

    e.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    const priority = taskPriority.value;

    // Validation
    const validTitle = validateTitle(title);
    const validDescription = validateDescription(description);

    if (!validTitle || !validDescription) {
        return;
    }

    // Create Task Object
    const taskObject = {

        id:
            editIndex !== null
                ? tasks[editIndex].id
                : Date.now(),

        taskTitle: title,

        taskDesc: description,

        taskPriority: priority,

        completed:
            editIndex !== null
                ? tasks[editIndex].completed
                : false
    };

    // Edit
    if (editIndex !== null) {

        tasks[editIndex] = taskObject;

        editIndex = null;

        document.getElementById("save")
            .textContent = "Save";
    }

    // Add
    else {

        tasks.push(taskObject);
    }

    // Save
    saveToLocalStorage();

    displayTasks();

    clearForm();
}

);

// Mark Task as Done / Undo
function toggleTask(index) {

tasks[index].completed =
    !tasks[index].completed;

saveToLocalStorage();

displayTasks();

}

// Delete Task
function deleteTask(index) {

const confirmDelete =
    confirm(
        "Are you sure you want to delete this task?"
    );

if (!confirmDelete) {
    return;
}

tasks.splice(index, 1);

saveToLocalStorage();

displayTasks();

}

// Edit Task
function editTask(index) {

const task = tasks[index];

taskTitle.value = task.taskTitle;

taskDesc.value = task.taskDesc;

taskPriority.value = task.taskPriority;

editIndex = index;

document.getElementById("save")
    .textContent = "Update";

taskForm.scrollIntoView({
    behavior: "smooth"
});

}

// Clear Form
function clearForm() {

taskTitle.value = "";

taskDesc.value = "";

taskPriority.value = "High";

taskTitleWarning.style.display = "none";

taskDescWarning.style.display = "none";

editIndex = null;

document.getElementById("save")
    .textContent = "Save";

}

// Cancel Button
cancelBtn.addEventListener(
"click",
function () {

    clearForm();
}

);

// Live Validation - Title
taskTitle.addEventListener(
"input",
function () {

    if (taskTitle.value.length > 0) {

        validateTitle(
            taskTitle.value
        );

    } else {

        taskTitleWarning.style.display =
            "none";
    }
}

);

// Live Validation - Description
taskDesc.addEventListener(
"input",
function () {

    if (taskDesc.value.length > 0) {

        validateDescription(
            taskDesc.value
        );

    } else {

        taskDescWarning.style.display =
            "none";
    }
}

);

// Initial Display
displayTasks();