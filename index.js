// index.js

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // middleware to parse JSON

// ✅ Step 1: Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://jobportaluser:e3HT3wkqNieuCLS8@cluster0.7yqqvfw.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Step 2: Create a simple test route
app.get("/", (req, res) => {
    res.send("Backend is running and connected to MongoDB!");
});

// ✅ Step 3: Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
