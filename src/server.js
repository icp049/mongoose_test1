require('dotenv').config();



const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./UserModel");
const cors = require("cors");

const app = express();
const port = 3000;
const server = http.createServer(app);

// MongoDB connection setup
const mongoURL = process.env.MONGO_URL;
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connection success");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Allow requests from all origins during development
app.use(cors({ origin: "http://localhost:3008", credentials: true }));

// Register route
app.post("/register", async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    const newUser = new User({
      username: email,
      displayName,
      email,
      password, // Store password directly in the user object
    });

    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      req.session.userId = user._id; // Store user ID in the session
      res.status(200).json({ message: "Login successful" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});



// Profile route (protected)
app.get("/landingpage", isAuthenticated, (req, res) => {
  res.send("Welcome to your profile");
});



function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
