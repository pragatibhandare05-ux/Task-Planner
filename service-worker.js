// ===============================
// Task Planner Pro Service Worker
// ===============================

const CACHE_NAME = "task-planner-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

// Install Service Worker
self.addEventListener("install", (event) => {

    console.log("Service Worker Installed");

    event.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

});
// Activate Service Worker
self.addEventListener("activate", (event) => {

    console.log("Service Worker Activated");

    event.waitUntil(

        caches.keys().then((cacheNames) => {

            return Promise.all(

                cacheNames.map((cache) => {

                    if (cache !== CACHE_NAME) {

                        console.log("Deleting old cache:", cache);

                        return caches.delete(cache);

                    }

                })

            );

        })

    );

});
// Fetch Requests
self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request).then((response) => {

            return response || fetch(event.request);

        })

    );

});
// ===============================
// Background Notification Handler
// ===============================

self.addEventListener("push", (event) => {

    console.log("Push notification received");


    const data = event.data
        ? event.data.json()
        : {
            title: "Task Reminder",
            body: "You have a pending task"
        };


    const options = {

        body: data.body,

        icon: "./images/icon-192.png",

        badge: "./images/icon-192.png",

        vibrate: [300, 100, 300]

    };


    event.waitUntil(

        self.registration.showNotification(
            data.title,
            options
        )

    );

});
// ===============================
// IndexedDB Connection
// ===============================

function openDatabase(){

    return new Promise((resolve, reject)=>{

        const request = indexedDB.open(
            "TaskPlannerDB",
            1
        );


        request.onsuccess = function(event){

            resolve(
                event.target.result
            );

        };


        request.onerror = function(){

            reject(
                "Database error"
            );

        };

    });

}
self.addEventListener("activate", (event) => {

    event.waitUntil(

        openDatabase()
        .then((db)=>{

            console.log(
                "Service Worker connected to IndexedDB",
                db
            );

        })
        .catch((error)=>{

            console.log(
                "IndexedDB connection failed",
                error
            );

        })

    );

});

// ===============================
// Background Reminder Check
// ===============================

self.addEventListener(
    "periodicsync",
    (event) => {

        if(event.tag === "task-reminder-check"){

            event.waitUntil(
                checkBackgroundReminders()
            );

        }

    }
);
// ===============================
// Check Background Reminders
// ===============================

async function checkBackgroundReminders(){

    const db = await openDatabase();


    const transaction = db.transaction(
        ["tasks"],
        "readonly"
    );


    const store = transaction.objectStore(
        "tasks"
    );


    const request = store.getAll();


    request.onsuccess = function(){

        const tasks = request.result;


        const now = new Date();


        tasks.forEach(task => {


            if(
                task.reminderTime &&
                !task.completed &&
                !task.reminderSent
            ){


                const reminderDate =
                    new Date(task.reminderTime);



                if(now >= reminderDate){


                    self.registration.showNotification(
                        "🔔 Task Reminder",
                        {

                            body:
                            task.title +
                            "\nTime to complete your task!",


                            icon:
                            "./images/icon-192.png",


                            badge:
                            "./images/icon-192.png",


                            vibrate:
                            [300,100,300]

                        }
                    );


                    task.reminderSent = true;

                }

            }

        });

    };

}