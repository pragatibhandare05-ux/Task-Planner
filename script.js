// ===============================
// SELECT ELEMENTS
// ===============================
const taskInput = document.getElementById("taskTitle");

const categoryInput = document.getElementById("taskCategory");

const priorityInput = document.getElementById("taskPriority");

const dueDateInput = document.getElementById("taskDate");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const themeBtn = document.getElementById("themeToggle");

const modalOverlay = document.getElementById("modalOverlay");

const modalTitle = document.getElementById("modalTitle");

const openTaskModal = document.getElementById("openTaskModal");

const closeModal = document.getElementById("closeModal");

const searchInput = document.getElementById("searchTask");

const priorityFilter = document.getElementById("priorityFilter");

const categoryFilter = document.getElementById("categoryFilter");

const emptyMessage = document.getElementById("emptyMessage");

const totalTask = document.getElementById("totalTasks");

const completedTask = document.getElementById("completedTasks");

const pendingTask = document.getElementById("pendingTasks");

const toast = document.getElementById("toast");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editTaskId = null;
// ===============================
// ADD / UPDATE BUTTON
// ===============================
addTaskBtn.addEventListener(
"click",
handleTask
);

// ===============================
// HANDLE ADD + UPDATE
// ===============================
function handleTask(){
    const title =
    taskInput.value.trim();

    if(title === ""){

        showToast("⚠ Enter task title");

        return;

    }

    if(editTaskId !== null){

        updateTask();

    }

    else{

        addTask();

    }

}

// ===============================
// ADD TASK
// ===============================
function addTask(){
    const newTask = {

        id: Date.now(),

        title:titleValue(),

        category: categoryInput.value,

        priority: priorityInput.value,

        dueDate: dueDateInput.value,

        completed:false,

        date: new Date().toLocaleString()
    };

    tasks.push(newTask);

    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

    clearForm();

    closeTaskModal();

    showToast(
    "✅ Task Added Successfully"
    );
}
function titleValue(){

    return taskInput.value.trim();

}

// ===============================
// SAVE TASKS
// ===============================
function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}
// ===============================
// DISPLAY TASKS
// ===============================


function displayTasks(){


    taskList.innerHTML = "";



    if(tasks.length === 0){


        emptyMessage.style.display="block";


        return;


    }



    emptyMessage.style.display="none";



    let filteredTasks = tasks;



    // SEARCH FILTER

    const searchValue =
    searchInput.value.toLowerCase();



    filteredTasks =
    filteredTasks.filter(task =>


        task.title
        .toLowerCase()
        .includes(searchValue)


    );

    // PRIORITY FILTER
    if(priorityFilter.value !== "all"){


        filteredTasks =
        filteredTasks.filter(task =>


            task.priority === priorityFilter.value


        );


    }
    // CATEGORY FILTER


if(categoryFilter.value !== "all"){


    filteredTasks =
    filteredTasks.filter(task =>


        task.category === categoryFilter.value


    );


}

    filteredTasks.forEach(task => {

        const card =
        document.createElement("div");

        card.className =
        `task-card ${task.priority}`;
        if(task.completed){

            card.classList.add("completed");

        }
        card.innerHTML = `


        <div class="task-header">


            <h3>

            ${task.completed ? "✅" : ""}

            ${task.title}
            </h3>



            <span class="priority ${task.priority}">


                ${getPriorityIcon(task.priority)}

                ${task.priority}


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

        Added:
        ${task.date}

        </small>

        <div class="task-buttons">


            <button onclick="completeTask(${task.id})">


                <i class="fa-solid fa-check"></i>


            </button>

            <button onclick="editTask(${task.id})">


                <i class="fa-solid fa-pen"></i>


            </button>
            <button onclick="deleteTask(${task.id})">


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


function getCategoryIcon(category){



    switch(category){


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

            return "📁";


    }


}

// ===============================
// PRIORITY ICON
// ===============================
function getPriorityIcon(priority){
    if(priority==="high"){


        return "🔥";


    }
    if(priority==="medium"){


        return "⚠️";


    }

    return "🌱";


}

// ===============================
// DUE DATE DISPLAY
// ===============================
function getDueDateText(date){

    if(!date){

        return "No Deadline";

    }

    const today =
    new Date();

    const due =
    new Date(date);

    today.setHours(0,0,0,0);

    due.setHours(0,0,0,0);
    if(due < today){
        return "🔴 Overdue";
    }
    if(
    due.getTime()
    ===
    today.getTime()
    ){
        return "🟡 Due Today";
    }

    return "🟢 " + date;

}
// ===============================
// COMPLETE TASK
// ===============================


function completeTask(id){


    tasks =
    tasks.map(task=>{


        if(task.id === id){


            task.completed =
            !task.completed;


        }
        return task;

    });

    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

}

// ===============================
// DELETE TASK
// ===============================
function deleteTask(id){

    const confirmDelete =
    confirm("Delete this task?");

    if(!confirmDelete){

        return;

    }

    tasks =
    tasks.filter(task=>task.id !== id);

    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

    showToast(
    "🗑 Task Deleted"
    );
}


// ===============================
// EDIT TASK
// ===============================
function editTask(id){

    const task =
    tasks.find(
        task=>task.id===id
    );

    if(!task){

        return;

    }

    editTaskId =
    id;

    modalTitle.innerText =
    "Edit Task";

addTaskBtn.innerText =
    "Update Task";

    taskInput.value =
    task.title;

    categoryInput.value =
    task.category;

    priorityInput.value =
    task.priority;

    dueDateInput.value =
    task.dueDate;

    modalOverlay.classList.add(
        "active"
    );

}

// ===============================
// UPDATE TASK
// ===============================
function updateTask(){

    tasks =
    tasks.map(task=>{

        if(task.id === editTaskId){

            task.title =
            taskInput.value.trim();

            task.category =
            categoryInput.value;

            task.priority =
            priorityInput.value;

            task.dueDate =
            dueDateInput.value;
        }
        return task;
    });
    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

    clearForm();

    closeTaskModal();

    showToast(
    "✏️ Task Updated Successfully"
    );

    editTaskId=null;
}

// ===============================
// CLEAR FORM
// ===============================

function clearForm(){
    taskInput.value="";

    categoryInput.value="Study";

    priorityInput.value="high";

    dueDateInput.value="";

    modalTitle.innerText =
        "Add Task";

    addTaskBtn.innerText =
    "Add Task";
}

// ===============================
// CLOSE MODAL
// ===============================


function closeTaskModal(){


    modalOverlay.classList.remove(
        "active"  
      );

}// ===============================
// COMPLETE TASK
// ===============================
function completeTask(id){

    tasks =
    tasks.map(task=>{

        if(task.id === id){
            task.completed =
            !task.completed;

        }
        return task;
    });

    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

}
// ===============================
// DELETE TASK
// ===============================
function deleteTask(id){

    const confirmDelete =
    confirm("Delete this task?");

    if(!confirmDelete){

        return;

    }
    tasks =
    tasks.filter(task=>task.id !== id);

    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

    showToast(
    "🗑 Task Deleted"
    );

}
// ===============================
// EDIT TASK
// ===============================
function editTask(id){

    const task =
    tasks.find(
        task=>task.id===id
    );

    if(!task){

        return;

    }

    editTaskId =
    id;

    modalTitle.innerText =
    "Edit Task";

    addTaskBtn.innerText =
    "Update Task";

    taskInput.value =
    task.title;

    categoryInput.value =
    task.category;

    priorityInput.value =
    task.priority;

    dueDateInput.value =
    task.dueDate;

    modalOverlay.classList.add(
        "active"
    );
}

// ===============================
// UPDATE TASK
// ===============================
function updateTask(){

    tasks =
    tasks.map(task=>{


        if(task.id === editTaskId){

            task.title =
            taskInput.value.trim();

            task.category =
            categoryInput.value;

            task.priority =
            priorityInput.value;

            task.dueDate =
            dueDateInput.value;

        }

        return task;


    });

    saveTasks();

    displayTasks();

    updateCounter();

    updateProgress();

    clearForm();

    closeTaskModal();

    showToast(
    "✏️ Task Updated Successfully"
    );
    editTaskId=null;

}

// ===============================
// CLEAR FORM
// ===============================


function clearForm(){



    taskInput.value="";

    categoryInput.value="Study";

    priorityInput.value="high";

    dueDateInput.value="";



    modalTitle.innerText =
    "Add Task";



    addTaskBtn.innerText =
    "Add Task";



}

// ===============================
// CLOSE MODAL
// ===============================


function closeTaskModal(){


    modalOverlay.classList.remove(
        "active"
    );


}
// ===============================
// UPDATE COUNTERS
// ===============================


function updateCounter(){


    const total =
    tasks.length;



    const completed =
    tasks.filter(
        task=>task.completed
    ).length;



    const pending =
    total - completed;



    totalTask.innerText =
    total;



    completedTask.innerText =
    completed;



    pendingTask.innerText =
    pending;



}

// ===============================
// UPDATE PROGRESS
// ===============================


function updateProgress(){


    if(tasks.length===0){


        document.getElementById(
            "progressText"
        ).innerText="0%";


        document.getElementById(
            "progressFill"
        ).style.width="0%";


        return;

    }


    const completed =
    tasks.filter(
        task=>task.completed
    ).length;




    const percentage =
    Math.round(
        (completed/tasks.length)*100
    );




    document.getElementById(
        "progressText"
    ).innerText =
    percentage+"%";




    document.getElementById(
        "progressFill"
    ).style.width =
    percentage+"%";
// ===============================
// CONGRATULATIONS QUOTE
// ===============================


const quotes = [

"Success is the sum of small efforts repeated day after day.",

"Great job! Every completed task brings you closer to your goals.",

"Discipline is choosing what you want most over what you want now.",

"Dream big. Work hard. Stay focused.",

"Small progress is still progress."

];



const quoteBox =
document.getElementById("quoteBox");


const quoteText =
document.getElementById("quoteText");



if(
completed === tasks.length &&
tasks.length > 0
){


    quoteBox.style.display="block";


    quoteText.innerText =
    quotes[
        Math.floor(
            Math.random()*quotes.length
        )
    ];


}
else{


    quoteBox.style.display="none";


}

}

// ===============================
// SEARCH
// ===============================
searchInput.addEventListener(
"input",
()=>{
    displayTasks();
});
categoryFilter.addEventListener(
"change",
()=>{
    displayTasks();
});
// ===============================
// PRIORITY FILTER
// ===============================


priorityFilter.addEventListener(
"change",
()=>{


    displayTasks();


});

// ===============================
// TOAST
// ===============================


function showToast(message){



    toast.innerText =
    message;



    toast.classList.add(
        "show"
    );



    setTimeout(()=>{


        toast.classList.remove(
            "show"
        );


    },2500);

}


// ===============================
// DARK MODE
// ===============================


themeBtn.addEventListener(
"click",
()=>{


    document.body.classList.toggle(
        "dark"
    );



    const mode =
    document.body.classList.contains(
        "dark"
    )
    ?
    "dark"
    :
    "light";



    localStorage.setItem(
        "theme",
        mode
    );



});

// LOAD THEME


if(
localStorage.getItem("theme")
==="dark"
){


    document.body.classList.add(
        "dark"
    );


}

// ===============================
// OPEN MODAL
// ===============================


openTaskModal.addEventListener(
"click",
()=>{


    modalOverlay.classList.add(
        "active"
    );


});

// ===============================
// CLOSE MODAL
// ===============================


closeModal.addEventListener(
"click",
()=>{


    closeTaskModal();


});

modalOverlay.addEventListener(
"click",
(e)=>{


    if(e.target===modalOverlay){


        closeTaskModal();


    }


});

// ===============================
// ENTER KEY ADD TASK
// ===============================


taskInput.addEventListener(
"keypress",
(e)=>{


    if(e.key==="Enter"){


        handleTask();


    }


});

// ===============================
// GREETING
// ===============================


function updateGreeting(){


    const greeting =
    document.getElementById(
        "greeting"
    );



    const hour =
    new Date().getHours();



    if(hour>=5 && hour<12){


        greeting.innerHTML =
        "🌞 Good Morning";


    }

    else if(hour>=12 && hour<17){


        greeting.innerHTML =
        "☀️ Good Afternoon";


    }

    else if(hour>=17 && hour<21){


        greeting.innerHTML =
        "🌇 Good Evening";


    }

    else{


        greeting.innerHTML =
        "🌙 Good Night";
    }

}
// ===============================
// START APPLICATION
// ===============================


updateGreeting();


displayTasks();


updateCounter();


updateProgress();



console.log(
"✅ Task Planner Pro Loaded Successfully"
);