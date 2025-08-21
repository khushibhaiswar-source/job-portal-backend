// server.js
require('dotenv').config(); // Load .env variables at the very top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000; // Use PORT from .env or fallback

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema with validation
const submissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: String, required: true },
    feedback: { type: String, default: '' }
});

// Create Model
const Submission = mongoose.model('Submission', submissionSchema);

// Serve form.html
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Redirect root to /form
app.get('/', (req, res) => {
    res.redirect('/form');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log('Form data received:', req.body); // Debug: check incoming data
    const { name, email, age, feedback } = req.body;

    // Validation check
    if (!name || !email || !age) {
        return res.status(400).send('Name, email, and age are required.');
    }

    try {
        const newSubmission = new Submission({ name, email, age, feedback });
        await newSubmission.save();
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving submission:', err);
        res.status(500).send('Error saving submission.');
    }
});

// Endpoint to view all submissions
app.get('/submissions', async (req, res) => {
    try {
        const allSubmissions = await Submission.find();
        res.json(allSubmissions);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).send('Error fetching submissions.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
