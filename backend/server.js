const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// ✅ Admin Signup
app.post("/signup/admin", async (req, res) => {
    const { username, password, room_code } = req.body;

    if (!username || !password || !room_code) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO admins (username, password, room_code) VALUES (?, ?, ?)";

    db.query(query, [username, hashedPassword, room_code], (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error" });
        res.status(201).json({ message: "Admin created successfully" });
    });
});

// ✅ User Signup (Checks Admin Room Code)
app.post("/signup/user", async (req, res) => {
    const { username, password, room_code } = req.body;

    if (!username || !password || !room_code) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query("SELECT * FROM admins WHERE room_code = ?", [room_code], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database Error" });
        if (results.length === 0) return res.status(400).json({ error: "Invalid Room Code!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, room_code) VALUES (?, ?, ?)";
        db.query(query, [username, hashedPassword, room_code], (err, result) => {
            if (err) return res.status(500).json({ error: "Database Error" });
            res.status(201).json({ message: "User created successfully" });
        });
    });
});

// ✅ Admin Login
app.post("/login/admin", (req, res) => {
    const { loginId, password, roomCode } = req.body;

    if (!loginId || !password || !roomCode) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query("SELECT * FROM admins WHERE username = ? AND room_code = ?", 
        [loginId, roomCode], 
        async (err, results) => {
            if (err) return res.status(500).json({ error: "Database Error" });
            if (results.length === 0) return res.status(401).json({ error: "Invalid credentials!" });

            const admin = results[0];
            const passwordMatch = await bcrypt.compare(password, admin.password);
            if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials!" });

            res.status(200).json({ message: "Admin Login Successful!" });
        }
    );
});

// ✅ User Login
app.post("/login/user", (req, res) => {
    const { loginId, password, roomCode } = req.body;

    if (!loginId || !password || !roomCode) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query("SELECT * FROM users WHERE username = ? AND room_code = ?", 
        [loginId, roomCode], 
        async (err, results) => {
            if (err) return res.status(500).json({ error: "Database Error" });
            if (results.length === 0) return res.status(401).json({ error: "Invalid credentials!" });

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials!" });

            res.status(200).json({ message: "User Login Successful!" });
        }
    );
});



// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});