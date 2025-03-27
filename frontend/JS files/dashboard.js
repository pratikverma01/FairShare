let transactions = []; // Store all transactions
let currentPage = 1;
const transactionsPerPage = 10;

// Function to add a new transaction
function confirmTransaction() {
    let amount = document.getElementById("amount").value;
    let person = transactionType === "Add Money" 
        ? document.getElementById("givenBy").value 
        : document.getElementById("givenTo").value;
    
    if (!amount || !person) {
        alert("Please fill all fields!");
        return;
    }

    // Store new transaction at the beginning (to keep newest first)
    transactions.unshift({
        date: new Date().toLocaleDateString(),
        user: person,
        amount: `$${amount}`,
        type: transactionType
    });

    // Reset to first page when adding a new transaction
    currentPage = 1;
    
    updateTable(); // Refresh table

    // Reset Form
    document.getElementById("amount").value = "";
    document.getElementById("givenBy").value = "";
    document.getElementById("givenTo").value = "";

    document.getElementById("givenBy").style.display = "none";
    document.getElementById("givenTo").style.display = "none";

    document.querySelector(".add-money").style.display = "block";
    document.querySelector(".withdraw-money").style.display = "block";
    document.querySelector(".confirm-btn").style.display = "none";
}

// Function to update the transaction table
function updateTable() {
    let transactionTable = document.getElementById("transactionTable");
    transactionTable.innerHTML = ""; // Clear existing table data

    let totalPages = Math.ceil(transactions.length / transactionsPerPage);
    if (currentPage > totalPages) {
        currentPage = totalPages || 1; // Ensure page is within valid range
    }

    let startIndex = (currentPage - 1) * transactionsPerPage;
    let endIndex = startIndex + transactionsPerPage;
    let visibleTransactions = transactions.slice(startIndex, endIndex);

    visibleTransactions.forEach(transaction => {
        let newRow = transactionTable.insertRow();
        newRow.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.user}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td><button onclick="deleteTransaction('${transaction.date}', '${transaction.user}')">🗑 Delete</button></td>
        `;
    });

    updatePagination(); // Update pagination controls
}

// Function to delete a transaction
function deleteTransaction(date, user) {
    transactions = transactions.filter(t => !(t.date === date && t.user === user));
    updateTable(); // Refresh table
}

// Function for pagination controls
// Function to update pagination controls
function updatePagination() {
    let totalPages = Math.ceil(transactions.length / transactionsPerPage);
    let paginationContainer = document.getElementById("paginationContainer");

    if (totalPages > 1) {
        paginationContainer.style.display = "block"; // Show pagination if more than 1 page
    } else {
        paginationContainer.style.display = "none"; // Hide pagination if only 1 page
    }

    document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages || 1}`;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage >= totalPages;
}



// Function to go to the previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
}

// Function to go to the next page
function nextPage() {
    let totalPages = Math.ceil(transactions.length / transactionsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
    }
}



function loadTransactions() {
    let table = document.getElementById("transactionTable");
    table.innerHTML = "";

    transactions.forEach((t) => {
        let row = `<tr>
            <td>${t.date}</td>
            <td>${t.user}</td>
            <td>${t.amount}</td>
            <td>${t.status}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

function searchTransactions() {
    let userName = document.getElementById("searchUser").value.toLowerCase();
    let searchDate = document.getElementById("searchDate").value;

    let filtered = transactions.filter(t => 
        (userName ? t.user.toLowerCase().includes(userName) : true) &&
        (searchDate ? t.date === searchDate : true)
    );

    let table = document.getElementById("transactionTable");
    table.innerHTML = "";

    filtered.forEach((t) => {
        let row = `<tr>
            <td>${t.date}</td>
            <td>${t.user}</td>
            <td>${t.amount}</td>
            <td>${t.status}</td>
        </tr>`;
        table.innerHTML += row;
    });
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

document.addEventListener("DOMContentLoaded", function () {
    let sidebar = document.getElementById("sidebar");
    let mainContent = document.getElementById("mainContent");

    // Ensure sidebar is closed when the page loads
    sidebar.classList.add("hidden");
    mainContent.classList.add("expanded");
});

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let mainContent = document.getElementById("mainContent");
    let toggleBtn = document.getElementById("floatingToggle");

    if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden"); // Show Sidebar
        mainContent.classList.remove("expanded"); // Move Dashboard
        toggleBtn.style.display = "none"; // Hide Floating Button
    } else {
        sidebar.classList.add("hidden"); // Hide Sidebar
        mainContent.classList.add("expanded"); // Expand Dashboard
        toggleBtn.style.display = "block"; // Show Floating Button
    }
}



function filterTransactions() {
    let selectedMonth = document.getElementById("monthFilter").value;
    let allTransactions = document.querySelectorAll("#transactionTable tr"); // Get all transactions
    let count = 0;

    allTransactions.forEach(row => {
        let dateCell = row.querySelector("td:first-child"); // Get date column
        if (dateCell) {
            let transactionDate = new Date(dateCell.textContent);
            let transactionMonth = transactionDate.getMonth() + 1; // Get month (1-12)

            if (selectedMonth === "all" || transactionMonth == selectedMonth) {
                row.style.display = ""; // Show matching transactions
                count++;
            } else {
                row.style.display = "none"; // Hide non-matching transactions
            }
        }
    });

    document.getElementById("totalTransactions").textContent = count; // Update transaction count
}

let transactionType = ""; // Stores whether it's "Add" or "Withdraw"

function showGivenBy() {
    transactionType = "Add Money";
    document.getElementById("givenBy").style.display = "block";
    document.getElementById("givenTo").style.display = "none";
    
    document.querySelector(".add-money").style.display = "none";
    document.querySelector(".withdraw-money").style.display = "none";
    document.querySelector(".confirm-btn").style.display = "block";
}

function showGivenTo() {
    transactionType = "Withdraw Money";
    document.getElementById("givenBy").style.display = "none";
    document.getElementById("givenTo").style.display = "block";
    
    document.querySelector(".add-money").style.display = "none";
    document.querySelector(".withdraw-money").style.display = "none";
    document.querySelector(".confirm-btn").style.display = "block";
}

function confirmTransaction() {
    let amount = document.getElementById("amount").value;
    let person = transactionType === "Add Money" 
        ? document.getElementById("givenBy").value 
        : document.getElementById("givenTo").value;
    
    if (!amount || !person) {
        alert("Please fill all fields!");
        return;
    }

    let transactionTable = document.getElementById("transactionTable");
    let newRow = transactionTable.insertRow();

    newRow.innerHTML = `
        <td>${new Date().toLocaleDateString()}</td>
        <td>${person}</td>
        <td>$${amount}</td>
        <td>${transactionType}</td>
        <td><button onclick="deleteTransaction(this)">🗑 Delete</button></td>
    `;

    // Reset Form
    document.getElementById("amount").value = "";
    document.getElementById("givenBy").value = "";
    document.getElementById("givenTo").value = "";

    document.getElementById("givenBy").style.display = "none";
    document.getElementById("givenTo").style.display = "none";

    document.querySelector(".add-money").style.display = "block";
    document.querySelector(".withdraw-money").style.display = "block";
    document.querySelector(".confirm-btn").style.display = "none";
}

// Function to delete a transaction
// function deleteTransaction(button) {
//     button.parentElement.parentElement.remove();
// }




// Load transactions on page load
window.onload = loadTransactions;
