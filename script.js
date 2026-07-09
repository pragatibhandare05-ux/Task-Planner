// ==========================================
// Task Planner Pro
// Part 1
// ==========================================

// ==========================================
// Get HTML Elements
// ==========================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const dueDate = document.getElementById("dueDate");

const searchTask = document.getElementById("searchTask");

const taskList = document.querySelector(".task-list");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const themeToggle = document.getElementById("themeToggle");

const filterButtons = document.querySelectorAll(".filter-btn");
const sortTasks = document.getElementById("sortTasks");
// ==========================================
// Global Array
// ==========================================

let tasks = [];

// ==========================================
// Save Tasks
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

// ==========================================
// Update Statistics
// ==========================================

function updateStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}

// ==========================================
// Update Progress Bar
// ==========================================

function updateProgress() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }

    progressFill.style.width =
        percentage + "%";

    progressText.textContent =
        percentage + "%";

}
// ==============================
// Filter Tasks
// ==============================

function filterTasks(filter){

    const taskCards = document.querySelectorAll(".task");

    taskCards.forEach(function(taskCard){

        const checkbox = taskCard.querySelector("input[type='checkbox']");

        if(filter === "all"){

            taskCard.style.display = "flex";

        }

        else if(filter === "completed"){

            if(checkbox.checked){

                taskCard.style.display = "flex";

            }else{

                taskCard.style.display = "none";

            }

        }

        else if(filter === "pending"){

            if(!checkbox.checked){

                taskCard.style.display = "flex";

            }else{

                taskCard.style.display = "none";

            }

        }

    });

}
// ==============================
// Sort Tasks
// ==============================

function sortTaskList(sortType) {

    switch (sortType) {

        case "newest":
            // Latest added first
            break;

        case "oldest":
            tasks.reverse();
            break;

        case "priority-high":

            tasks.sort(function (a, b) {

                const order = {
                    "High": 3,
                    "Medium": 2,
                    "Low": 1
                };

                return order[b.priority] - order[a.priority];

            });

            break;

        case "priority-low":

            tasks.sort(function (a, b) {

                const order = {
                    "High": 3,
                    "Medium": 2,
                    "Low": 1
                };

                return order[a.priority] - order[b.priority];

            });

            break;

        case "due-date":

            tasks.sort(function (a, b) {

                return new Date(a.dueDate) - new Date(b.dueDate);

            });

            break;

        case "az":

            tasks.sort(function (a, b) {

                return a.text.localeCompare(b.text);

            });

            break;

        case "za":

            tasks.sort(function (a, b) {

                return b.text.localeCompare(a.text);

            });

            break;

    }

    // Clear old task cards
    taskList.innerHTML = "";

    // Recreate all tasks
    tasks.forEach(function (task) {

        createTask(task);

    });

    // Show empty message if needed
    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

    saveTasks();
}

// ==========================================
// Refresh Dashboard
// ==========================================

function refreshDashboard() {

    updateStatistics();

    updateProgress();

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

}

// ==========================================
// Create Priority Badge
// ==========================================

function createPriorityBadge(level) {

    const badge =
        document.createElement("span");

    badge.classList.add(
        "priority-badge"
    );

    badge.textContent = level;

    switch (level) {

        case "High":

            badge.classList.add("high");

            break;

        case "Medium":

            badge.classList.add("medium");

            break;

        default:

            badge.classList.add("low");

    }

    return badge;

}

// ==========================================
// Create Due Date Badge
// ==========================================

function createDueDate(date) {

    const badge =
        document.createElement("span");

    badge.classList.add("due-date");

    if (date === "") {

        badge.textContent = "No Date";

    } else {

        const formatted =
            new Date(date)
            .toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        badge.textContent =
            "📅 " + formatted;

    }

    return badge;

}
// ==========================================
// Create Task Card
// ==========================================

function createTask(task) {

    // Task Card
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    if (task.completed) {
        taskDiv.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Task Text
    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    // Category Badge
    const categoryBadge = document.createElement("span");
    categoryBadge.textContent = task.category;
    categoryBadge.classList.add("category-badge");

    // Priority Badge
    const priorityBadge = createPriorityBadge(task.priority);

    // Due Date Badge
    const dueDateBadge = createDueDate(task.dueDate);

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏ Edit";
    editBtn.classList.add("edit-btn");

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑 Delete";
    deleteBtn.classList.add("delete-btn");

    // Add Elements
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(categoryBadge);
    taskDiv.appendChild(priorityBadge);
    taskDiv.appendChild(dueDateBadge);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(deleteBtn);

    taskList.appendChild(taskDiv);

    // ======================================
    // Complete Task
    // ======================================

    checkbox.addEventListener("change", function () {

        task.completed = checkbox.checked;

        if (task.completed) {
            taskDiv.classList.add("completed");
        } else {
            taskDiv.classList.remove("completed");
        }

        saveTasks();
        refreshDashboard();

    });

    // ======================================
    // Edit Task
    // ======================================

    editBtn.addEventListener("click", function () {

        const newTask = prompt(
            "Edit your task:",
            task.text
        );

        if (newTask === null) return;

        if (newTask.trim() === "") {

            alert("Task cannot be empty.");

            return;

        }

        task.text = newTask.trim();

        taskText.textContent = task.text;

        saveTasks();

    });

    // ======================================
    // Delete Task
    // ======================================

    deleteBtn.addEventListener("click", function () {

        const index = tasks.indexOf(task);

        if (index > -1) {

            tasks.splice(index, 1);

        }

        taskDiv.remove();

        saveTasks();

        refreshDashboard();

    });

}

// ==========================================
// Add Task
// ==========================================

addTaskBtn.addEventListener("click", function () {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task.");

        return;

    }

  const task = {

    text: text,

    completed: false,

    priority: priority.value,

    category: category.value,

    dueDate: dueDate.value

};

    tasks.push(task);

    createTask(task);

    saveTasks();

    refreshDashboard();

    taskInput.value = "";

    priority.value = "Medium";

    category.value = "Study";

    dueDate.value = "";

});

// ==========================================
// Press Enter
// ==========================================

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addTaskBtn.click();

    }

});
// ==========================================
// Live Search
// ==========================================

searchTask.addEventListener("keyup", function () {

    const value = searchTask.value.toLowerCase();

    const taskCards = document.querySelectorAll(".task");

    taskCards.forEach(function (card) {

        const text = card.querySelector("span").textContent.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});

// ==========================================
// Dark Mode
// ==========================================

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀️";

    } else {

        document.body.classList.remove("dark-mode");

        themeToggle.textContent = "🌙";

    }

}

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

        themeToggle.textContent = "☀️";

    } else {

        localStorage.setItem("theme", "light");

        themeToggle.textContent = "🌙";

    }

});

// ==========================================
// Load Tasks
// ==========================================

function loadTasks() {

    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {

        tasks = JSON.parse(storedTasks);

    } else {

        tasks = [];

    }

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        createTask(task);

    });

    refreshDashboard();

}

// ==========================================
// Sort Tasks (High → Medium → Low)
// ==========================================

function sortTasks() {

    const order = {

        High: 1,

        Medium: 2,

        Low: 3

    };

    tasks.sort(function (a, b) {

        return order[a.priority] - order[b.priority];

    });

    saveTasks();

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        createTask(task);

    });

    refreshDashboard();

}

// ==========================================
// Optional:
// Press Ctrl + Shift + S to Sort Tasks
// ==========================================

document.addEventListener("keydown", function (event) {

    if (

        event.ctrlKey &&

        event.shiftKey &&

        event.key.toLowerCase() === "s"

    ) {

        event.preventDefault();

        sortTasks();

    }

});

// ==========================================
// App Initialization
// ==========================================

loadTheme();
// ==============================
// Filter Button Events
// ==============================

filterButtons.forEach(function(button){

    button.addEventListener("click", function(){

        // Remove active class from all buttons
        filterButtons.forEach(function(btn){

            btn.classList.remove("active");

        });

        // Highlight selected button
        button.classList.add("active");

        // Get selected filter
        const filter = button.dataset.filter;

        // Filter tasks
        filterTasks(filter);

    });

});
// ==============================
// Sort Event
// ==============================

sortTasks.addEventListener("change", function () {

    sortTaskList(sortTasks.value);

});
loadTasks();

refreshDashboard();

console.log("✅ Task Planner Pro Loaded Successfully");