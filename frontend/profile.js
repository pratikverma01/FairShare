document.getElementById("profileBtn").addEventListener("click", function() {
    document.getElementById("profileModal").style.display = "flex";
});

document.getElementById("closeBtn").addEventListener("click", function() {
    document.getElementById("profileModal").style.display = "none";
});

// Save User Data (LocalStorage)
document.getElementById("saveBtn").addEventListener("click", function() {
    let name = document.getElementById("profileName").value;
    let email = document.getElementById("profileEmail").value;
    
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    alert("Profile Updated!");
});

// Load User Data from LocalStorage
window.onload = function() {
    if (localStorage.getItem("userName")) {
        document.getElementById("profileName").value = localStorage.getItem("userName");
    }
    if (localStorage.getItem("userEmail")) {
        document.getElementById("profileEmail").value = localStorage.getItem("userEmail");
    }
};

// Change Profile Picture
document.getElementById("uploadPic").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const imgElement = document.getElementById("profilePic");
        imgElement.src = reader.result;

        // Save profile pic in localStorage
        localStorage.setItem("profilePic", reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
});

// Load Profile Picture from LocalStorage
window.onload = function() {
    if (localStorage.getItem("profilePic")) {
        document.getElementById("profilePic").src = localStorage.getItem("profilePic");
    }
    if (localStorage.getItem("userName")) {
        document.getElementById("profileName").value = localStorage.getItem("userName");
    }
    if (localStorage.getItem("userEmail")) {
        document.getElementById("profileEmail").value = localStorage.getItem("userEmail");
    }
};
