document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const themeButton = document.getElementById("theme-button");
    const profilePic = document.getElementById("profile-pic");
    const profileUpload = document.getElementById("profile-upload");
    const roleSelection = document.querySelector(".role-selection");
    const loginContainer = document.querySelector(".login-container");
    const adminLoginButton = document.getElementById("admin-login");
    const userLoginButton = document.getElementById("user-login");
    const userTypeInput = document.getElementById("user-type");

    // 🔹 Show Login Form Based on Role Selection
    adminLoginButton.addEventListener("click", () => {
        userTypeInput.value = "admin";
        roleSelection.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    });

    userLoginButton.addEventListener("click", () => {
        userTypeInput.value = "user";
        roleSelection.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    });

    // 🔹 Handle Login
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const loginId = document.getElementById("login-id").value.trim();
        const password = document.getElementById("password").value.trim();
        const roomCode = document.getElementById("room-code").value.trim().toUpperCase();
        const userType = document.getElementById("user-type").value;

        if (!loginId || !password || !roomCode || !userType) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "All fields are required!",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, password, roomCode, userType }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: "Redirecting to dashboard...",
                    timer: 2000,
                    showConfirmButton: false
                });

                // 🔹 Save login details
                localStorage.setItem("loggedUser", loginId);
                localStorage.setItem("roomCode", roomCode);
                localStorage.setItem("userType", userType);

                setTimeout(() => {
                    window.location.href = "dashboard.html"; // ✅ Redirect to Dashboard
                }, 2000);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed!",
                    text: data.message,
                });
            }
        } catch (error) {
            console.error("Login Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong. Please try again later.",
            });
        }
    });

    // 🔹 Theme Toggle
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        themeButton.textContent = isDarkMode ? "☀️" : "🌙";
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });

    // Load Theme Preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeButton.textContent = "☀️";
    }

    // 🔹 Profile Picture Upload
    profileUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
                localStorage.setItem("profilePic", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Load Profile Picture
    const savedProfilePic = localStorage.getItem("profilePic");
    if (savedProfilePic) {
        profilePic.src = savedProfilePic;
    }
});
