require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const passport = require("passport"); // Add this line
const LocalStrategy = require("passport-local").Strategy; // Add this line
const session = require("express-session"); // Add this line
const bcrypt = require("bcrypt"); // Add this line

const app = express();
const port = 3000;

// Create an HTTP server
const server = http.createServer(app);

// Set up Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Connect to MongoDB
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

// Define User schema
const userSchema = new mongoose.Schema({
  displayName: String,
  email: String,
  password: String, // Add this field for storing hashed password
  photoURL: String,
});

const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(session({ secret: "your-secret-key", resave: false, saveUninitialized: true })); // Add this line
app.use(passport.initialize());
app.use(passport.session());

// Passport.js configuration
passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom authentication function
async function authenticateUser(email, password, done) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: "No user with that email" });
    }

    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } catch (error) {
    return done(error);
  }
}

// Express route for user registration (same as before)
app.post("/register", upload.single("avatar"), async (req, res) => {
  // ... Your existing registration route code ...
});

// Authentication route
app.post("/login", passport.authenticate("local", {
  successRedirect: "/landingpage", // Redirect on successful login
  failureRedirect: "/login", // Redirect on failed login
}));

// ... Other routes and middleware ...

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
