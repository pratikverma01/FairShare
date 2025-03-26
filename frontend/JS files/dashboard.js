document.addEventListener("DOMContentLoaded", async () => {
    const transactionForm = document.getElementById("transaction-form");
    const transactionTable = document.getElementById("transaction-table");
    const logoutButton = document.getElementById("logout");
    const transactionType = document.getElementById("transaction-type");
    const givenByField = document.getElementById("given-by").parentElement;
    const givenToField = document.getElementById("given-to").parentElement;
    const purposeField = document.getElementById("purpose");
    const transactionDetails = document.getElementById("transaction-details");

    const userType = localStorage.getItem("userType"); // "admin" or "user"

    // 🌟 Admin only: Show admin operations
    if (userType === "admin") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "table-cell");
        document.getElementById("admin-operations").classList.remove("hidden");
    }

    // 🔹 Hide fields initially
    givenByField.classList.add("hidden");
    givenToField.classList.add("hidden");
    transactionDetails.classList.add("hidden");

    // 🔹 Show/hide fields based on transaction type
    transactionType.addEventListener("change", () => {
        const type = transactionType.value;

        if (type === "deposit") {
            givenByField.classList.remove("hidden"); // Show Given By
            givenToField.classList.add("hidden");   // Hide Given To
        } else if (type === "withdraw") {
            givenToField.classList.remove("hidden"); // Show Given To
            givenByField.classList.add("hidden");   // Hide Given By
        }

        transactionDetails.classList.remove("hidden"); // Show transaction details
    });
    // transactionType.addEventListener("change", () => {
    //     transactionDetails.classList.add("show"); // Smooth fade-in
    // });
    

    // 🔹 Load Transactions from MySQL
    async function loadTransactions() {
        try {
            const response = await fetch("http://localhost:5000/getTransactions");
            const transactions = await response.json();

            // 📝 Render transactions
            transactionTable.innerHTML = "";
            transactions.forEach(tx => {
                transactionTable.innerHTML += `
                    <tr>
                        <td>${tx.amount}</td>
                        <td>${tx.type}</td>
                        <td>${tx.type === "deposit" ? tx.givenBy : "-"}</td>
                        <td>${tx.type === "withdraw" ? tx.givenTo : "-"}</td>
                        <td>${tx.purpose}</td>
                        <td>${new Date(tx.date).toLocaleString()}</td>
                        <td class="admin-only">
                            <button class="delete-btn" data-id="${tx.id}">❌ Delete</button>
                        </td>
                    </tr>
                `;
            });

            // ❌ Delete Transactions (Admin Only)
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

    // ✅ Submit Transaction (Admin Only)
    transactionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const type = transactionType.value;
        const givenBy = type === "deposit" ? document.getElementById("given-by").value : "";
        const givenTo = type === "withdraw" ? document.getElementById("given-to").value : "";
        const purpose = purposeField.value.trim();

        // ⚠️ Input Validation
        if (!amount || !type || !purpose || (type === "deposit" && !givenBy) || (type === "withdraw" && !givenTo)) {
            Swal.fire("Error", "Please fill all required fields!", "error");
            return;
        }

        // 🔄 Send data to backend
        await fetch("http://localhost:5000/addTransaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, type, givenBy, givenTo, purpose })
        });

        Swal.fire("Success", "Transaction added!", "success");
        loadTransactions();
        transactionForm.reset();
        
        // Hide extra fields after submission
        transactionDetails.classList.add("hidden");
        givenByField.classList.add("hidden");
        givenToField.classList.add("hidden");
    });

    // 🚪 Logout
    logoutButton.addEventListener("click", () => {
        localStorage.clear();
        Swal.fire({
            title: "Logged Out",
            text: "You have successfully logged out.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "signin.html";
        });
    });

    loadTransactions();
});
