// ======================================
// TASK PLANNER APP
// FINAL JAVASCRIPT FILE
// ======================================

// ===============================
// Selecting Elements
// ===============================

const taskInput = document.getElementById("taskInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.querySelector(".task-list");


const priorityInput = document.getElementById("priority");

const categoryInput = document.getElementById("category");

const dueDateInput = document.getElementById("dueDate");

const reminderTimeInput = document.getElementById("reminderTime");

const reminderHour = document.getElementById("reminderHour");

const reminderMinute = document.getElementById("reminderMinute");

const reminderPeriod = document.getElementById("reminderPeriod");

const searchInput = document.getElementById("searchTask");


const sortSelect = document.getElementById("sortTasks");


const themeBtn = document.getElementById("themeToggle");



const totalTask = document.getElementById("totalTasks");

const completedTask = document.getElementById("completedTasks");

const pendingTask = document.getElementById("pendingTasks");



const toast = document.getElementById("toast");

const progressText = document.getElementById("progressText");

const progressFill = document.getElementById("progressFill");

const clearAllBtn = document.getElementById("clearAllBtn");

const exportBtn = document.getElementById("exportBtn");

const importInput = document.getElementById("importInput");

const emptyMessage = document.getElementById("emptyMessage");


// ===============================
// Task Array
// ===============================

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];



// Current Filter

let currentFilter = "all";
// ===============================
// Add Task
// ===============================


addTaskBtn.addEventListener(
"click",
addTask
);



function addTask(){


    const title = taskInput.value.trim();



    if(title === ""){

        showToast(
            "Please enter a task"
        );

        return;
    }
const newTask = {

    id: Date.now(),

    title:title,

    completed:false,


    priority:
    priorityInput.value,


    category:
    categoryInput.value,


    dueDate:
    dueDateInput.value,

    reminderTime:
`${reminderHour.value}:${reminderMinute.value} ${reminderPeriod.value}`,
reminderSent:false,

    date:
    new Date().toLocaleString()

};

    tasks.push(newTask);



    saveTasks();



    displayTasks();



    updateCounter();
updateProgress();


    taskInput.value="";



    showToast(
        "Task Added Successfully"
    );

}
// ===============================
// Save Tasks
// ===============================


function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

// ===============================
// Display Tasks
// ===============================


function displayTasks(){
   taskList.innerHTML = `
<div id="emptyMessage" class="empty-state">
    <i class="fa-solid fa-clipboard-list"></i>

    <h2>No Tasks Yet</h2>

    <p>
        Add your first task and start being productive.
    </p>
</div>
`;
if(tasks.length > 0){

    document.getElementById("emptyMessage").style.display="none";

}
    let filteredTasks = tasks;



    if(currentFilter === "completed"){


        filteredTasks =
        tasks.filter(
        task=>task.completed
        );


    }



    if(currentFilter === "pending"){


        filteredTasks =
        tasks.filter(
        task=>!task.completed
        );


    }




    if(searchInput){


        const search =
        searchInput.value.toLowerCase();



        filteredTasks =
        filteredTasks.filter(
        task =>
        task.title
        .toLowerCase()
        .includes(search)
        );


    }
    filteredTasks.forEach(
    function(task){


        const div =
        document.createElement("div");



        div.className =
        "task-card";



        if(task.completed){

            div.classList.add(
                "completed"
            );

        }
        // Show/Hide Empty Message

if(emptyMessage){

    if(tasks.length === 0){

        emptyMessage.style.display = "block";

    }
    else{

        emptyMessage.style.display = "none";

    }

}

        div.innerHTML = `

        <h3>${task.title}</h3>

        <p>
        Priority:
        ${task.priority}
        </p>


        <p>
        Category:
        ${task.category}
        </p>

        <p>
        Due Date:
        ${task.dueDate || "No Deadline"}
        </p>

        <p>
Reminder:
${task.reminderTime || "No Reminder"}
</p>

        <small>
        ${task.date}
        </small>


        <div>


        <button onclick="completeTask(${task.id})">
        ✔
        </button>


        <button onclick="editTask(${task.id})">
        ✏️
        </button>


        <button onclick="deleteTask(${task.id})">
        ❌
        </button>


        </div>

        `;



        taskList.appendChild(div);



    });


}
// ===============================
// Complete Task
// ===============================


function completeTask(id){


    tasks = tasks.map(function(task){


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


    showToast(
        "Task Updated"
    );


}






// ===============================
// Delete Task
// ===============================


function deleteTask(id){



    const confirmDelete =
    confirm(
        "Delete this task?"
    );



    if(confirmDelete){



        tasks =
        tasks.filter(
        function(task){


            return task.id !== id;


        });



        saveTasks();


        displayTasks();


        updateCounter();
        updateProgress();



        showToast(
            "Task Deleted"
        );

    }


}
// ===============================
// Edit Task
// ===============================


function editTask(id){



    const task =
    tasks.find(
    function(task){


        return task.id === id;


    });



    if(task){



        const updated =
        prompt(
            "Edit Task",
            task.title
        );



        if(updated !== null &&
           updated.trim() !== ""){


            task.title =
            updated.trim();



            saveTasks();


            displayTasks();



            showToast(
                "Task Updated"
            );


        }


    }


}

// ===============================
// Task Counter
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




    if(totalTask){

        totalTask.innerText =
        total;

    }



    if(completedTask){

        completedTask.innerText =
        completed;

    }



    if(pendingTask){

        pendingTask.innerText =
        pending;

    }


}
// ===============================
// Search
// ===============================
if(searchInput){
searchInput.addEventListener(
"input",
function(){
    displayTasks();
});
}
// ===============================
// Filter Buttons
// ===============================


const filterButtons =
document.querySelectorAll(
".filter-btn"
);



filterButtons.forEach(
function(button){



    button.addEventListener(
    "click",
    function(){



        currentFilter =
        button.dataset.filter;



        filterButtons.forEach(
        btn=>btn.classList.remove(
            "active"
        ));



        button.classList.add(
            "active"
        );



        displayTasks();



    });



});
// ===============================
// Sorting
// ===============================


if(sortSelect){

sortSelect.addEventListener(
"change",
function(){

    let value =
    sortSelect.value;

    if(value==="newest"){

        tasks.sort(
        (a,b)=>
        b.id-a.id
        );

    }

    else if(value==="oldest"){

        tasks.sort(
        (a,b)=>
        a.id-b.id
        );

    }

    else if(value==="completed"){
        tasks.sort(
        (a,b)=>
        b.completed-a.completed
        );
    }

    saveTasks();
    displayTasks();
});
}
// ===============================
// Toast Notification
// ===============================
function showToast(message){
    if(!toast){

        alert(message);

        return;

    }
    toast.innerText =
    message;
    toast.classList.add(
        "show"
    );
    setTimeout(
    function(){
        toast.classList.remove(
            "show"
        );
    },3000);
}
function checkTaskReminder(){
    const today =
    new Date()
    .toISOString()
    .split("T")[0];
    tasks.forEach(function(task){
        if(
            task.dueDate === today &&
            !task.completed
        ){


            if(Notification.permission === "granted"){


                new Notification(
                    "Task Reminder 🔔",
                    {

                    body:
                    task.title +
                    " is due today!"

                    }

                );


            }


        }


    });


}
// ===============================
// Enter Key Add Task
// ===============================


if(taskInput){



taskInput.addEventListener(
"keypress",
function(event){



    if(event.key === "Enter"){



        addTask();


    }



});
}

// ===============================
// Exact Time Reminder
// ===============================
function checkExactReminder(){
    const now = new Date();
    let hour =
    now.getHours();
    let minute =
    now.getMinutes();
    let period =
    hour >= 12 ? "PM" : "AM";
    hour =
    hour % 12 || 12;
    let currentTime =
    `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")} ${period}`;
    const today =
    now.toISOString()
    .split("T")[0];
    tasks.forEach(function(task){
        if(
    task.dueDate === today &&
    task.reminderTime === currentTime &&
    !task.completed &&
    !task.reminderSent
){
            if(Notification.permission==="granted"){
                new Notification(
                    "Task Reminder 🔔",
                
                    {
                        body:
                        task.title +
                        " reminder time reached!"
                    }
                );
                task.reminderSent = true;
                 saveTasks();

            }


        }


    });


}

// ===============================
// Clear All Tasks
// ===============================


if(clearAllBtn){



clearAllBtn.addEventListener(
"click",
function(){



    if(tasks.length===0){


        showToast(
            "No tasks available"
        );


        return;


    }
    let result =
    confirm(
        "Delete all tasks?"
    );
    if(result){
        tasks=[];
        saveTasks();
        displayTasks();
        updateCounter();
        updateProgress();
        showToast(
            "All Tasks Deleted"
        );


    }
});
}
// ===============================
// Export Tasks
// ===============================
if(exportBtn){
exportBtn.addEventListener(
"click",
function(){
    if(tasks.length===0){
        showToast(
            "No tasks to export"
        );
        return;
    }
    const file =
    JSON.stringify(
        tasks,
        null,
        2
    );
    const blob =
    new Blob(
        [file],
        {
            type:
            "application/json"
        }
    );
    const url =
    URL.createObjectURL(
        blob
    );
    const link =
    document.createElement(
        "a"
    );
    link.href=url;
    link.download =
    "tasks-backup.json";
    link.click();
    URL.revokeObjectURL(
        url
    );
    showToast(
        "Tasks Exported"
    );
});

}
// ===============================
// Import Tasks
// ===============================
if(importInput){
importInput.addEventListener(
"change",
function(event){
    const file =
    event.target.files[0];
    if(!file){
        return;

    }
    const reader =
    new FileReader();
    reader.onload =
    function(e){
        try{


            const imported =
            JSON.parse(
                e.target.result
            );



            if(Array.isArray(imported)){



                tasks =
                imported;



                saveTasks();



                displayTasks();



                updateCounter();
                updateProgress();



                showToast(
                    "Tasks Imported"
                );



            }



        }

        catch(error){



            showToast(
                "Invalid File"
            );


        }
    };

    reader.readAsText(file);

});
}
// ===============================
// Update Progress Bar
// ===============================
function updateProgress(){
    if(tasks.length === 0){
        if(progressText){

            progressText.innerText = "0%";

        }
        if(progressFill){

            progressFill.style.width = "0%";

        }
        return;
    }
    const completed =
    tasks.filter(
        task => task.completed
    ).length;
    const percentage =
    Math.round(
        (completed / tasks.length) * 100
    );
    if(progressText){

        progressText.innerText =
        percentage + "%";

    }
    if(progressFill){

        progressFill.style.width =
        percentage + "%";

    }
}
// ===============================
// Dark / Light Theme
// ===============================

if(themeBtn){

    themeBtn.addEventListener(
        "click",
        function(){

            document.body.classList.toggle("dark");


            let theme =
            document.body.classList.contains("dark")
            ?
            "dark"
            :
            "light";


            localStorage.setItem(
                "theme",
                theme
            );


        }
    );

}


// Load Saved Theme

const savedTheme =
localStorage.getItem("theme");


if(savedTheme === "dark"){

    document.body.classList.add("dark");

}
// ===============================
// Start Application
// ===============================
displayTasks();
displayTasks();
updateCounter();
updateProgress();
requestNotificationPermission();

checkTaskReminder();
setInterval(
    checkExactReminder,
    60000
);
function requestNotificationPermission(){
    if(
        "Notification" in window
    ){
        Notification.requestPermission();
    }
}
console.log(
    "Task Planner Loaded Successfully"
);
// ===============================
// Register Service Worker
// ===============================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => {

                console.log("Service Worker Registered Successfully");

            })
            .catch((error) => {

                console.log("Service Worker Registration Failed", error);

            });

    });

}