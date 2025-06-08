const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Parse JSON bodies
app.use(express.json());

// API endpoints that forward to Analytics API
app.get('/api/analytics/stats', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/analytics/stats');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.get('/api/analytics/pageviews', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/analytics/pageviews');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching pageviews:', error);
        res.status(500).json({ error: 'Failed to fetch pageviews' });
    }
});

app.get('/api/analytics/clicks', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/analytics/clicks');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching clicks:', error);
        res.status(500).json({ error: 'Failed to fetch clicks' });
    }
});

app.get('/api/analytics/leads', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/analytics/leads');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

app.get('/api/analytics/conversions', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/analytics/conversions');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching conversions:', error);
        res.status(500).json({ error: 'Failed to fetch conversions' });
    }
});

// Tracking endpoints that forward to Analytics API
app.post('/api/track/pageview', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/track/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error tracking pageview:', error);
        res.status(500).json({ error: 'Failed to track pageview' });
    }
});

app.post('/api/track/click', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/track/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error tracking click:', error);
        res.status(500).json({ error: 'Failed to track click' });
    }
});

app.post('/api/track/lead', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/track/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error tracking lead:', error);
        res.status(500).json({ error: 'Failed to track lead' });
    }
});

app.post('/api/track/conversion', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/track/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error tracking conversion:', error);
        res.status(500).json({ error: 'Failed to track conversion' });
    }
});

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