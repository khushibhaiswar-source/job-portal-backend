// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // allow requests from any origin
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = "mongodb+srv://jobportaluser:e3HT3wkqNieuCLS8@cluster0.7yqqvfw.mongodb.net/JobPortalDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define schema for submissions
const submissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: String,
  feedback: String,
}, { timestamps: true });

const Submission = mongoose.model("Submission", submissionSchema);

// Endpoint to receive form submissions
app.post("/input", async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
    console.log("User input saved:", req.body);
    res.send({ message: "Submission saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save submission" });
  }
});

// Optional endpoint to view all submissions
app.get("/submissions", async (req, res) => {
  try {
    const allSubmissions = await Submission.find();
    res.send(allSubmissions);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch submissions" });
  }
});

// Serve your HTML form
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
