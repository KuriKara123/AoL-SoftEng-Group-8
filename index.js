const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const path = require("path"); // Add this line to import the path module
const socketIo = require('socket.io');

const app = express();
const server = require("http").createServer(app);

const io = socketIo(server);

app.use(express.json());

// Create a MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + db.threadId);
});

// Serve static files like CSS, JavaScript, images, etc.
app.use(express.static(path.join(__dirname, "public")));

app.get("/landing", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landing-page", "landing.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup-page", "signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login-page", "login.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home-page", "home.html"));
});

app.get("/chatime", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "detail-page", "chatime.html"));
});

app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat-page", "chat.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about-page", "about.html"));
});

app.get("/list", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "list-page", "list.html"));
});

io.on("connection", function (socket) {
    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });
});

// Route to handle form submission and insert user data into the database
app.post("/register", (req, res) => {
    const { name, password } = req.body;

    // Check if the name and password are provided
    if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
    }

    // Insert the user data into the database
    db.query("INSERT INTO account (username, password) VALUES (?, ?)", [name, password], (err, result) => {
        if (err) {
            console.error("Error inserting user data into database: " + err);
            return res.status(500).json({ message: "Internal server error" });
        }
        console.log("User data inserted into database successfully");
        res.status(200).json({ message: "User registered successfully" });
    });
});


// Handle login logic
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Query the database to find a matching user
    db.query("SELECT * FROM account WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) {
            console.error("Error querying database: " + err);
            return res.status(500).json({ message: "Internal server error" });
        }

        // Check if a user with the provided credentials exists
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ username: username }, "secretkey");
        res.json({ token: token, redirectUrl: "/home" });
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
