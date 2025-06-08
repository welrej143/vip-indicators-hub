const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Serve static files from the root directory
app.use(express.static('.'));

// Handle admin route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web server running on http://0.0.0.0:${PORT}`);
});

// Keep the server running
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        process.exit(0);
    });
});

// Prevent the process from exiting
process.stdin.resume();