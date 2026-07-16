// signup.js

console.log("Signup JS Loaded");

// Get form and input elements
const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("signupName");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Make sure the form exists
if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Check for empty fields
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Check if account already exists
        const existingUser = localStorage.getItem(email);

        if (existingUser) {
            alert("An account with this email already exists.");
            return;
        }

        // Create user object
        const user = {
            name: name,
            email: email,
            password: password
        };

        // Save to localStorage
        localStorage.setItem(email, JSON.stringify(user));

        alert("Account created successfully!");

        // Redirect to login page
        window.location.href = "login.html";

    });

}