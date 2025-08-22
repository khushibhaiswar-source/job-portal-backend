const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const Grid = require("gridfs-stream");
const { Readable } = require("stream");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Multer setup (store file in memory, then pipe to GridFS)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Schema for form data
const submissionSchema = new mongoose.Schema({
  hasProfile: String,
  role: String,
  name: String,
  age: Number,
  gender: String,
  education: String,
  phone: String,
  email: String,
  password: String,
  disability: String,
  otherDisability: String,
  experienceStatus: String,
  previousJob: String,
  yearsExperience: String,
  lastJobTitle: String,
  workTools: String,
  workActivities: String,
  technicalSkills: String,
  otherTechnicalSkills: String,
  nonTechnicalSkills: String,
  otherNonTechnicalSkills: String,
  jobInterestCategory: String,
  jobMode: String,
  assistiveTech: String,
  otherAssistiveTech: String,
  physicalRequirements: String,
  accommodation: String,
  otherAccommodation: String,
  training: String,
  salaryRange: String,
  shiftPreference: String,
  govtReservation: String,
  location: String,
  imageFile: String,
  documentFile: String,
});

const Submission = mongoose.model("Submission", submissionSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🌍 Job Portal Backend is Running");
});

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

app.post(
  "/submit",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Function to upload file to GridFS
      const uploadToGridFS = (file) =>
        new Promise((resolve, reject) => {
          if (!file) return resolve("");
          const writeStream = gfs.createWriteStream({
            filename: `${Date.now()}_${file.originalname}`,
            content_type: file.mimetype,
            metadata: {
              name: req.body.name || "Unknown",
              role: req.body.role || "Unknown",
              disability: req.body.disability || "Not provided",
              email: req.body.email || "Not provided",
              phone: req.body.phone || "Not provided"
            }
          });
          const readable = new Readable();
          readable.push(file.buffer);
          readable.push(null);
          readable.pipe(writeStream);
          writeStream.on("close", (uploadedFile) => resolve(uploadedFile.filename));
          writeStream.on("error", reject);
        });

      const imageFile = await uploadToGridFS(req.files.image?.[0]);
      const documentFile = await uploadToGridFS(req.files.document?.[0]);

      const body = req.body;
      const newSubmission = new Submission({
        ...body,
        imageFile,
        documentFile,
      });

      await newSubmission.save();
      console.log("✅ Form data saved:", newSubmission);
      res.send("🎉 Form submitted successfully!");
    } catch (error) {
      console.error("❌ Error saving submission:", error);
      res.status(500).send("Error saving form data");
    }
  }
);

// Start server on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
