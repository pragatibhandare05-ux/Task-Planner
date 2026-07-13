// ===============================
// Task Planner Pro Service Worker
// ===============================

const CACHE_NAME = "task-planner-v1";

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

});

// Fetch Requests
self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request).then((response) => {

            return response || fetch(event.request);

        })

    );

});