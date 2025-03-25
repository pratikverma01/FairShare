document.addEventListener("DOMContentLoaded", async () => {
    const transactionForm = document.getElementById("transaction-form");
    const transactionTable = document.getElementById("transaction-table");
    const logoutButton = document.getElementById("logout");

    const userType = localStorage.getItem("userType"); // "admin" or "user"

    // Show admin options only if user is an admin
    if (userType === "admin") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "table-cell");
        document.getElementById("admin-operations").style.display = "block";
    }

    // Load Transactions from MySQL
    async function loadTransactions() {
        try {
            const response = await fetch("http://localhost:5000/getTransactions");
            const transactions = await response.json();

            transactionTable.innerHTML = "";
            transactions.forEach(tx => {
                transactionTable.innerHTML += `
                    <tr>
                        <td>${tx.amount}</td>
                        <td>${tx.type}</td>
                        <td>${tx.givenBy}</td>
                        <td>${tx.givenTo}</td>
                        <td>${tx.date}</td>
                        ${userType === "admin" ? `<td><button class="delete-btn" data-id="${tx.id}">❌ Delete</button></td>` : ""}
                    </tr>
                `;
            });

            // Delete Transactions (Admin Only)
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const transactionId = e.target.getAttribute("data-id");
                    await fetch(`http://localhost:5000/deleteTransaction/${transactionId}`, { method: "DELETE" });
                    loadTransactions();
                });
            });

        } catch (error) {
            console.error("Error loading transactions:", error);
        }
    }

    // Submit Transaction (Admin Only)
    transactionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const type = document.getElementById("transaction-type").value;
        const givenBy = document.getElementById("given-by").value;
        const givenTo = document.getElementById("given-to").value;

        await fetch("http://localhost:5000/addTransaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, type, givenBy, givenTo })
        });

        loadTransactions();
    });

    // Logout
    logoutButton.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "signin.html";
    });

    loadTransactions();
});
