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

const filterButtons =
document.querySelectorAll(".filter-btn");

const sortSelect =
document.getElementById("sortTasks");

// ==========================================
// Array
// ==========================================

let tasks = [];

// ==========================================
// Save Tasks
// ==========================================

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

// ==========================================
// Update Statistics
// ==========================================

function updateStatistics(){

    const total = tasks.length;

    const completed =
    tasks.filter(task => task.completed).length;

    const pending =
    total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}

// ==========================================
// Update Progress
// ==========================================

function updateProgress(){

    const total = tasks.length;

    const completed =
    tasks.filter(task => task.completed).length;

    let percentage = 0;

    if(total>0){

        percentage =
        Math.round(
            (completed/total)*100
        );

    }

    progressFill.style.width =
    percentage + "%";

    progressText.textContent =
    percentage + "%";

}

// ==========================================
// Dashboard
// ==========================================

function refreshDashboard(){

    updateStatistics();

    updateProgress();

    if(tasks.length===0){

        emptyMessage.style.display="block";

    }

    else{

        emptyMessage.style.display="none";

    }

}

// ==========================================
// Priority Badge
// ==========================================

function createPriorityBadge(level){

    const badge =
    document.createElement("span");

    badge.classList.add("priority-badge");

    badge.textContent = level;

    if(level==="High"){

        badge.classList.add("high");

    }

    else if(level==="Medium"){

        badge.classList.add("medium");

    }

    else{

        badge.classList.add("low");

    }

    return badge;

}

// ==========================================
// Category Badge
// ==========================================

function createCategoryBadge(cat){

    const badge =
    document.createElement("span");

    badge.classList.add("category-badge");

    badge.textContent = cat;

    return badge;

}

// ==========================================
// Due Date Badge
// ==========================================

function createDateBadge(date){

    const badge =
    document.createElement("span");

    badge.classList.add("due-date");

    if(date===""){

        badge.textContent="No Date";

    }

    else{

        badge.textContent =
        "📅 " +
        new Date(date).toLocaleDateString(
            "en-GB",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        );

    }

    return badge;

}
// ==========================================
// Create Task Card
// ==========================================

function createTask(task){

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    if(task.completed){
        taskDiv.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Task Text
    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = task.text;

    // Category
    const categoryBadge =
    createCategoryBadge(task.category);

    // Priority
    const priorityBadge =
    createPriorityBadge(task.priority);

    // Due Date
    const dueDateBadge =
    createDateBadge(task.dueDate);

    // Buttons Container
    const buttonGroup =
    document.createElement("div");

    buttonGroup.classList.add("task-buttons");

    // Edit Button
    const editBtn =
    document.createElement("button");

    editBtn.textContent = "✏ Edit";
    editBtn.classList.add("edit-btn");

    // Delete Button
    const deleteBtn =
    document.createElement("button");

    deleteBtn.textContent = "🗑 Delete";
    deleteBtn.classList.add("delete-btn");

    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);

    // Add Elements
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(categoryBadge);
    taskDiv.appendChild(priorityBadge);
    taskDiv.appendChild(dueDateBadge);
    taskDiv.appendChild(buttonGroup);

    taskList.appendChild(taskDiv);

    // ======================================
    // Complete Task
    // ======================================

    checkbox.addEventListener("change",function(){

        task.completed = checkbox.checked;

        if(task.completed){

            taskDiv.classList.add("completed");

        }else{

            taskDiv.classList.remove("completed");

        }

        saveTasks();
        refreshDashboard();

    });

    // ======================================
    // Edit Task
    // ======================================

    editBtn.addEventListener("click",function(){

        const newTask =
        prompt(
            "Edit your task",
            task.text
        );

        if(newTask===null) return;

        if(newTask.trim()===""){

            alert("Task cannot be empty.");

            return;

        }

        task.text =
        newTask.trim();

        taskText.textContent =
        task.text;

        saveTasks();

    });

    // ======================================
    // Delete Task
    // ======================================

    deleteBtn.addEventListener("click",function(){

        const index =
        tasks.indexOf(task);

        if(index>-1){

            tasks.splice(index,1);

        }

        taskDiv.remove();

        saveTasks();

        refreshDashboard();

    });

}

// ==========================================
// Add Task
// ==========================================

addTaskBtn.addEventListener("click",function(){

    const text =
    taskInput.value.trim();

    if(text===""){

        alert("Please enter a task.");

        return;

    }

    const task={

        text:text,

        completed:false,

        priority:priority.value,

        category:category.value,

        dueDate:dueDate.value

    };

    tasks.push(task);

    createTask(task);

    saveTasks();

    refreshDashboard();

    taskInput.value="";

    priority.value="Medium";

    category.value="Study";

    dueDate.value="";

});

// ==========================================
// Enter Key
// ==========================================

taskInput.addEventListener("keypress",function(event){

    if(event.key==="Enter"){

        addTaskBtn.click();

    }

});
// ==========================================
// Search Tasks
// ==========================================

searchTask.addEventListener("keyup", function () {

    const value = searchTask.value.toLowerCase();

    const cards = document.querySelectorAll(".task");

    cards.forEach(function (card) {

        const text = card.querySelector(".task-text").textContent.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    });

});

// ==========================================
// Filter Tasks
// ==========================================

function filterTasks(type) {

    const cards = document.querySelectorAll(".task");

    cards.forEach(function (card) {

        const checked =
            card.querySelector("input").checked;

        switch (type) {

            case "all":
                card.style.display = "flex";
                break;

            case "completed":
                card.style.display =
                    checked ? "flex" : "none";
                break;

            case "pending":
                card.style.display =
                    !checked ? "flex" : "none";
                break;

        }

    });

}

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        filterTasks(button.dataset.filter);

    });

});

// ==========================================
// Sort Tasks
// ==========================================

function sortTaskList(type) {

    switch (type) {

        case "priority-high":

            tasks.sort((a, b) => {

                const order = {
                    High: 3,
                    Medium: 2,
                    Low: 1
                };

                return order[b.priority] - order[a.priority];

            });

            break;

        case "priority-low":

            tasks.sort((a, b) => {

                const order = {
                    High: 3,
                    Medium: 2,
                    Low: 1
                };

                return order[a.priority] - order[b.priority];

            });

            break;

        case "due-date":

            tasks.sort((a, b) => {

                return new Date(a.dueDate || "9999-12-31")
                    - new Date(b.dueDate || "9999-12-31");

            });

            break;

        case "az":

            tasks.sort((a, b) =>
                a.text.localeCompare(b.text));

            break;

        case "za":

            tasks.sort((a, b) =>
                b.text.localeCompare(a.text));

            break;

        case "oldest":

            tasks.reverse();

            break;

        case "newest":

        default:

            break;

    }

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        createTask(task);

    });

    refreshDashboard();

    saveTasks();

}

sortSelect.addEventListener("change", function () {

    sortTaskList(sortSelect.value);

});

// ==========================================
// Dark Mode
// ==========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀️";

    } else {

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

    const storedTasks =
        localStorage.getItem("tasks");

    tasks = storedTasks
        ? JSON.parse(storedTasks)
        : [];

    taskList.innerHTML = "";

    tasks.forEach(function (task) {

        createTask(task);

    });

    refreshDashboard();

}

// ==========================================
// Initialize App
// ==========================================

loadTheme();
loadTasks();

console.log("✅ Task Planner Pro Loaded Successfully");