// ==========================
// Login Protection
// ==========================

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {

    alert("Please login first.");

    window.location.href = "login.html";

}
console.log("🚀 Task Planner Pro v2 Loading...");

// ======================================================
// TASK PLANNER PRO V2
// ======================================================

// ===============================
// DOM ELEMENTS
// ===============================

// Header
const greeting = document.getElementById("greeting");
const themeBtn = document.getElementById("themeToggle");

// Search
const searchInput = document.getElementById("searchTask");

// Dashboard
const totalTask = document.getElementById("totalTasks");
const completedTask = document.getElementById("completedTasks");
const pendingTask = document.getElementById("pendingTasks");

// Statistics
const todayTasks = document.getElementById("todayTasks");
const overdueTasks = document.getElementById("overdueTasks");
const dueTodayTasks = document.getElementById("dueTodayTasks");
const completedToday = document.getElementById("completedToday");

// Progress
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// Quote
const quoteBox = document.getElementById("quoteBox");
const quoteText = document.getElementById("quoteText");

// Filters
const priorityFilter = document.getElementById("priorityFilter");
const categoryFilter = document.getElementById("categoryFilter");

// Task List
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// Modal
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");

// Form
const taskInput = document.getElementById("taskTitle");
const categoryInput = document.getElementById("taskCategory");
const priorityInput = document.getElementById("taskPriority");
const dueDateInput = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");

// Toast
const toast = document.getElementById("toast");

// Navigation
const sections = document.querySelectorAll(".app-section");
const navItems = document.querySelectorAll(".nav-item");

// ===============================
// GLOBAL VARIABLES
// ===============================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function checkOverdueTasks() {

    const today = new Date();

    tasks.forEach(task => {

        if(task.dueDate) {

            const dueDate = new Date(task.dueDate);

            if(dueDate < today && task.status !== "Completed") {

                task.status = "Overdue";

            }

        }

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

let editTaskId = null;

let currentFilter = "all";

let currentSearch = "";

let currentSort = "latest";
// ===============================
// CHART VARIABLES
// ===============================

let pieChart = null;
let barChart = null;
// ===============================
// CONSTANTS
// ===============================

const STORAGE_KEY = "tasks";

const quotes = [
    "Success is the sum of small efforts repeated day after day.",
    "Great job! Every completed task brings you closer to your goals.",
    "Discipline is choosing what you want most over what you want now.",
    "Dream big. Work hard. Stay focused.",
    "Small progress is still progress.",
    "Every task completed is a step toward success.",
    "Keep moving forward.",
    "Consistency beats perfection.",
    "Stay focused and never give up.",
    "Productivity begins with one task."
];

// ===============================
// STORAGE FUNCTIONS
// ===============================

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function generateTaskId() {
    return Date.now();
}

// ===============================
// NAVIGATION
// ===============================

function showSection(sectionId) {

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const activeSection = document.getElementById(sectionId);

    if (activeSection) {
        activeSection.classList.add("active");
    }

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const clicked = [...navItems].find(item =>
        item.getAttribute("onclick")?.includes(sectionId)
    );

    if (clicked) {
        clicked.classList.add("active");
    }

}

// ===============================
// MODAL FUNCTIONS
// ===============================

function openModal() {
    modalOverlay.classList.add("active");
}

function closeTaskModal() {
    modalOverlay.classList.remove("active");
}

function resetForm() {

    taskInput.value = "";

    categoryInput.value = "Study";

    priorityInput.value = "high";

    dueDateInput.value = "";

    modalTitle.innerText = "Add Task";

    addTaskBtn.innerText = "Add Task";

    editTaskId = null;

}
// ===============================
// TASK VALIDATION
// ===============================

function validateTask() {

    if (taskInput.value.trim() === "") {

        showToast("⚠ Please enter task title");

        taskInput.focus();

        return false;

    }

    return true;

}

// ===============================
// ADD / UPDATE BUTTON
// ===============================

addTaskBtn.addEventListener("click", handleTask);

// ===============================
// HANDLE TASK
// ===============================

function handleTask() {

    if (!validateTask()) return;

    if (editTaskId === null) {

        addTask();

    } else {

        updateTask();

    }

}

// ===============================
// CREATE TASK OBJECT
// ===============================

function createTaskObject() {

    return {

        id: generateTaskId(),

        title: taskInput.value.trim(),

        category: categoryInput.value,

        priority: priorityInput.value,

        dueDate: dueDateInput.value,

        completed: false,

        date: new Date().toLocaleString()

    };

}

// ===============================
// ADD TASK
// ===============================

function addTask() {

    const newTask = createTaskObject();

    tasks.unshift(newTask);

    saveTasks();

    refreshApp();

    resetForm();

    closeTaskModal();

    showToast("✅ Task Added Successfully");

}

// ===============================
// EDIT TASK
// ===============================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    editTaskId = id;

    modalTitle.innerText = "Edit Task";

    addTaskBtn.innerText = "Update Task";

    taskInput.value = task.title;

    categoryInput.value = task.category;

    priorityInput.value = task.priority;

    dueDateInput.value = task.dueDate;

    openModal();

}

// ===============================
// UPDATE TASK
// ===============================

function updateTask() {

    const task = tasks.find(task => task.id === editTaskId);

    if (!task) return;

    task.title = taskInput.value.trim();

    task.category = categoryInput.value;

    task.priority = priorityInput.value;

    task.dueDate = dueDateInput.value;

    saveTasks();

    refreshApp();

    resetForm();

    closeTaskModal();

    showToast("✏ Task Updated Successfully");

}

// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    refreshApp();

    showToast("🗑 Task Deleted");

}

// ===============================
// COMPLETE TASK
// ===============================

function completeTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();

    refreshApp();

    if (task.completed) {

        showToast("🎉 Task Completed");

    } else {

        showToast("↩ Task Marked Pending");

    }

}

// ===============================
// REFRESH APPLICATION
// ===============================
function refreshApp() {

    displayTasks();

    updateCounter();

    updateStatistics();

    updateProgress();

    updateCharts();

}
// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];
// ===============================
// STATUS FILTER
// ===============================

document.querySelectorAll(".status-btn").forEach(button => {

    button.addEventListener("click", function () {

        document.querySelectorAll(".status-btn").forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");

        const status = this.dataset.status;

        switch (status) {

            case "completed":

                currentFilter = "completed";

                break;

            case "pending":

                currentFilter = "pending";

                break;

            case "high":

                currentFilter = "high";

                break;

            default:

                currentFilter = "all";

        }

        displayTasks();

    });

});
    // -------------------------------
    // Search
    // -------------------------------

    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue !== "") {

        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchValue)
        );

    }

    // -------------------------------
    // Priority Filter
    // -------------------------------

    if (priorityFilter.value !== "all") {

        filteredTasks = filteredTasks.filter(task =>
            task.priority === priorityFilter.value
        );

    }

    // -------------------------------
    // Category Filter
    // -------------------------------

    if (categoryFilter.value !== "all") {

        filteredTasks = filteredTasks.filter(task =>
            task.category === categoryFilter.value
        );

    }

    // -------------------------------
    // Status Filter
    // -------------------------------

    if (currentFilter === "completed") {

        filteredTasks = filteredTasks.filter(task => task.completed);

    }

    if (currentFilter === "pending") {

        filteredTasks = filteredTasks.filter(task => !task.completed);

    }
    if (currentFilter === "high") {

    filteredTasks = filteredTasks.filter(task => task.priority === "high");

}

    // -------------------------------
    // Sorting
    // -------------------------------

    switch (currentSort) {

        case "oldest":

            filteredTasks.sort((a, b) => a.id - b.id);

            break;

        case "priority":

            const order = {
                high: 1,
                medium: 2,
                low: 3
            };

            filteredTasks.sort(
                (a, b) =>
                order[a.priority] - order[b.priority]
            );

            break;

        case "date":

            filteredTasks.sort(
                (a, b) =>
                new Date(a.dueDate || "9999-12-31") -
                new Date(b.dueDate || "9999-12-31")
            );

            break;

        default:

            filteredTasks.sort((a, b) => b.id - a.id);

    }

    // -------------------------------
    // Empty State
    // -------------------------------

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";

    // -------------------------------
    // Create Cards
    // -------------------------------

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className = `task-card ${task.priority}`;

        if (task.completed) {

            card.classList.add("completed");

        }

        card.innerHTML = `

<div class="task-header">

<h3>

${task.completed ? "✅" : ""}

${task.title}

</h3>
<span class="task-status ${task.status}">
    ${task.status}
</span>
<span class="priority ${task.priority}">

${getPriorityIcon(task.priority)}

${task.priority.toUpperCase()}

</span>

</div>

<div class="task-details">

<p>

${getCategoryIcon(task.category)}

${task.category}

</p>

<p class="due-date">

<i class="fa-solid fa-calendar"></i>

${getDueDateText(task.dueDate)}

</p>

</div>

<small>

Added : ${task.date}

</small>

<div class="task-buttons">

<button
onclick="completeTask(${task.id})"
title="Complete">

<i class="fa-solid fa-check"></i>

</button>

<button
onclick="editTask(${task.id})"
title="Edit">

<i class="fa-solid fa-pen"></i>

</button>

<button
onclick="deleteTask(${task.id})"
title="Delete">

<i class="fa-solid fa-trash"></i>

</button>

</div>

`;

        taskList.appendChild(card);

    });

}

// ===============================
// CATEGORY ICON
// ===============================

function getCategoryIcon(category) {

    switch (category) {

        case "Study":
            return "📚";

        case "Work":
            return "💼";

        case "Personal":
            return "🏠";

        case "Health":
            return "🏋️";

        case "Other":
            return "📌";

        default:
            return "📂";

    }

}

// ===============================
// PRIORITY ICON
// ===============================

function getPriorityIcon(priority) {

    switch (priority) {

        case "high":
            return "🔥";

        case "medium":
            return "⚠️";

        case "low":
            return "🌱";

        default:
            return "📌";

    }

}

// ===============================
// DUE DATE
// ===============================

function getDueDateText(date) {

    if (!date) {

        return "No Deadline";

    }

    const today = new Date();

    const due = new Date(date);

    today.setHours(0, 0, 0, 0);

    due.setHours(0, 0, 0, 0);

    if (due < today) {

        return "🔴 Overdue";

    }

    if (due.getTime() === today.getTime()) {

        return "🟡 Due Today";

    }

    return "🟢 " + date;

}
// ===============================
// UPDATE COUNTERS
// ===============================

function updateCounter() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTask.textContent = total;
    completedTask.textContent = completed;
    pendingTask.textContent = pending;

}

// ===============================
// TASK STATISTICS
// ===============================

function updateStatistics() {

    const today = new Date().toISOString().split("T")[0];

    let todayCount = 0;
    let overdueCount = 0;
    let dueTodayCount = 0;
    let completedCount = 0;

    tasks.forEach(task => {

        if (task.dueDate === today) {
            todayCount++;
            dueTodayCount++;
        }

        if (
            task.dueDate &&
            task.dueDate < today &&
            !task.completed
        ) {
            overdueCount++;
        }

        if (task.completed) {
            completedCount++;
        }

    });

    todayTasks.textContent = todayCount;
    overdueTasks.textContent = overdueCount;
    dueTodayTasks.textContent = dueTodayCount;
    completedToday.textContent = completedCount;

}

// ===============================
// PROGRESS BAR
// ===============================

function updateProgress() {

    if (tasks.length === 0) {

        progressText.textContent = "0%";

        progressFill.style.width = "0%";

        quoteBox.style.display = "none";

        return;

    }

    const completed = tasks.filter(task => task.completed).length;

    const percentage = Math.round(
        (completed / tasks.length) * 100
    );

    progressText.textContent = percentage + "%";

    progressFill.style.width = percentage + "%";

    if (completed === tasks.length) {

        quoteBox.style.display = "block";

        quoteText.textContent =
            quotes[Math.floor(Math.random() * quotes.length)];

    } else {

        quoteBox.style.display = "none";

    }

}
// ===============================
// UPDATE CHARTS
// ===============================

function updateCharts() {

    createPieChart();

    createBarChart();

}

// ===============================
// PIE CHART
// ===============================

function createPieChart() {

    const canvas = document.getElementById("pieChart");

    if (!canvas) return;

    if (pieChart) {

        pieChart.destroy();

    }

    const completed = tasks.filter(task => task.completed).length;

    const pending = tasks.length - completed;

    pieChart = new Chart(canvas, {

        type: "pie",

        data: {

            labels: [

                "Completed",

                "Pending"

            ],

            datasets: [{

                data: [

                    completed,

                    pending

                ],

                backgroundColor: [

                    "#43A047",

                    "#E53935"

                ],

                borderWidth: 2

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

// ===============================
// BAR CHART
// ===============================

function createBarChart() {

    const canvas = document.getElementById("barChart");

    if (!canvas) return;

    if (barChart) {

        barChart.destroy();

    }

    let study = 0;
    let work = 0;
    let personal = 0;
    let health = 0;
    let other = 0;

    tasks.forEach(task => {

        switch(task.category){

            case "Study":
                study++;
                break;

            case "Work":
                work++;
                break;

            case "Personal":
                personal++;
                break;

            case "Health":
                health++;
                break;

            default:
                other++;

        }

    });

    barChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [

                "Study",

                "Work",

                "Personal",

                "Health",

                "Other"

            ],

            datasets: [{

                label: "Tasks",

                data: [

                    study,

                    work,

                    personal,

                    health,

                    other

                ],

                backgroundColor: [

                    "#3F51B5",

                    "#009688",

                    "#8E24AA",

                    "#FB8C00",

                    "#546E7A"

                ]

            }]

        },

        options: {

            responsive:true,

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{

                        precision:0

                    }

                }

            }

        }

    });

}
// ===============================
// GREETING
// ===============================

function updateGreeting() {

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {

        greeting.innerHTML = "🌞 Good Morning";

    }

    else if (hour >= 12 && hour < 17) {

        greeting.innerHTML = "☀️ Good Afternoon";

    }

    else if (hour >= 17 && hour < 21) {

        greeting.innerHTML = "🌇 Good Evening";

    }

    else {

        greeting.innerHTML = "🌙 Good Night";

    }

}

// ===============================
// TOAST
// ===============================

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const mode = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("theme", mode);

});

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }

}

// ===============================
// SEARCH
// ===============================

searchInput.addEventListener("input", () => {

    displayTasks();

});

// ===============================
// FILTERS
// ===============================

priorityFilter.addEventListener("change", displayTasks);

categoryFilter.addEventListener("change", displayTasks);

// ===============================
// ENTER KEY
// ===============================

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        handleTask();

    }

});

// ===============================
// MODAL
// ===============================

closeModal.addEventListener("click", closeTaskModal);

modalOverlay.addEventListener("click", (e) => {

    if (e.target === modalOverlay) {

        closeTaskModal();

    }

});

// ===============================
// INITIALIZE APP
// ===============================

function initializeApp() {

    loadTasks();

    loadTheme();

    updateGreeting();

    refreshApp();

    checkTaskReminders();

    showSection("home");

    console.log("✅ Task Planner Pro V2 Loaded");

}

initializeApp();
// ===============================
// SETTINGS
// ===============================

const darkModeSwitch = document.getElementById("darkModeSwitch");

const notificationSwitch = document.getElementById("notificationSwitch");

const soundSwitch = document.getElementById("soundSwitch");

const exportTasksBtn = document.getElementById("exportTasks");

const clearTasksBtn = document.getElementById("clearTasks");

const logoutBtn = document.getElementById("logoutBtn");

// Dark Mode

if(darkModeSwitch){

    darkModeSwitch.checked=document.body.classList.contains("dark");

    darkModeSwitch.addEventListener("change",()=>{

        themeBtn.click();

    });

}

// Export Tasks

if(exportTasksBtn){

    exportTasksBtn.addEventListener("click",()=>{

        const data=JSON.stringify(tasks,null,2);

        const blob=new Blob([data],{type:"application/json"});

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="tasks.json";

        a.click();

    });

}

// Clear Tasks

if(clearTasksBtn){

    clearTasksBtn.addEventListener("click",()=>{

        if(confirm("Delete all tasks?")){

            tasks=[];

            saveTasks();

            refreshApp();

            showToast("All Tasks Deleted");

        }

    });

}
// Logout

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");

        alert("Logged out successfully!");

        window.location.href = "login.html";

    });

}
// ===============================
// NOTIFICATION PERMISSION
// ===============================

function requestNotificationPermission() {

    if (!("Notification" in window)) {

        return;

    }

    if (Notification.permission === "default") {

        Notification.requestPermission();

    }

}
requestNotificationPermission();
// ===============================
// TASK REMINDERS
// ===============================

function checkTaskReminders() {

    if (Notification.permission !== "granted") return;

    const today = new Date().toISOString().split("T")[0];

    tasks.forEach(task => {

        if (
            task.dueDate === today &&
            !task.completed
        ) {

            new Notification("📌 Task Reminder", {

                body: task.title,

                icon: "icons/icon-192.png"

            });

        }

    });

}
setInterval(() => {

    checkTaskReminders();

}, 3600000);
