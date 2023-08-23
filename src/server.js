const dotenv = require("dotenv");
dotenv.config();


const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const User = require("./UserModel"); // Import the User modelscasc

const app = express();
const port = 3000;

const server = http.createServer(app);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

app.post("/register", upload.single("avatar"), async (req, res) => {
  const { displayName, email } = req.body;
  const file = req.file;

  try {
    const newUser = new User({
      displayName,
      email,
      photoURL: "", // Placeholder for the GridFS ObjectID
    });

    await newUser.save();

    if (file) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const uploadStream = bucket.openUploadStream(file.originalname);
      readableStream.pipe(uploadStream);

      uploadStream.on("finish", async () => {
        newUser.photoURL = uploadStream.id;
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
