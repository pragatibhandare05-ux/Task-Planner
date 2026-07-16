// auth.js

console.log("Auth JS Loaded");

// =========================
// Show / Hide Password
// =========================

const password = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");

if (password && togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";
            togglePassword.textContent = "🙈";

        } else {

            password.type = "password";
            togglePassword.textContent = "👁️";

        }

    });

}


// =========================
// Login System
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const pass = document
            .getElementById("loginPassword")
            .value;

        if (email === "" || pass === "") {

            alert("Please fill all fields.");
            return;

        }

        // Get user saved during signup
        const savedUser = JSON.parse(localStorage.getItem(email));

        if (
    savedUser &&
    savedUser.email === email &&
    savedUser.password === pass
) {

    // Save login session
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", email);

    alert("Login Successful!");

    window.location.href = "index.html";

} else {

    alert("Invalid Email or Password.");

}

    });

}