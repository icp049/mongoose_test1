require('dotenv').config(); // Load environment variables from .env file




const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");



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
  photoURL: String, // Store the GridFS ObjectID here
});

const User = mongoose.model("User", userSchema);

app.use(express.json());

// Express route for user registration
app.post("/register", upload.single("avatar"), async (req, res) => {
  const { displayName, email } = req.body;
  const file = req.file;

  try {
    // Create a new user instance
    const newUser = new User({
      displayName,
      email,
      photoURL: "", // Placeholder for the GridFS ObjectID
    });

    // Save the user to the database
    await newUser.save();

    if (file) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

      // Create a readable stream from the uploaded file buffer
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      // Upload the image using GridFS
      const uploadStream = bucket.openUploadStream(file.originalname);
      readableStream.pipe(uploadStream);

      uploadStream.on("finish", async () => {
        // Update the newUser's photoURL field with the GridFS ObjectID
        newUser.photoURL = uploadStream.id;

        // Update the user in the database to store the photoURL
        await newUser.save();

        res.status(200).json({ message: "User registered successfully" });
      });
    } else {
      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});




server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
