// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000; // Render sets PORT automatically

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema
const submissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: String,
    feedback: String
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
    const { name, email, age, feedback } = req.body;
    try {
        const newSubmission = new Submission({ name, email, age, feedback });
        await newSubmission.save();
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving submission.');
    }
});

// Optional: Endpoint to view all submissions
app.get('/submissions', async (req, res) => {
    try {
        const allSubmissions = await Submission.find();
        res.json(allSubmissions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching submissions.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
