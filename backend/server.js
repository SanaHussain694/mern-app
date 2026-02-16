// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Initialize Express app
const app = express();
// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON bodies
// Test route
app.get('/', (req, res) => {
res.json({ message: 'Backend is running!' });
});
// Port configuration
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});