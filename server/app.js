const express = require('express');
const cors = require('cors');
const { Pool } = require('@neondatabase/serverless');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Track page views
app.post('/api/track/pageview', async (req, res) => {
  try {
    const { sessionId, pageUrl, title, timeOnPage, scrollDepth } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    const query = `
      INSERT INTO page_views (session_id, page_url, title, time_on_page, scroll_depth, ip_address, user_agent, referrer)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    
    await pool.query(query, [sessionId, pageUrl, title, timeOnPage, scrollDepth, ipAddress, userAgent, referrer]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ error: 'Failed to track page view' });
  }
});

// Track button clicks
app.post('/api/track/click', async (req, res) => {
  try {
    const { sessionId, buttonText, buttonLocation, destinationUrl } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    const query = `
      INSERT INTO clicks (session_id, button_text, button_location, destination_url, ip_address, user_agent, referrer)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    await pool.query(query, [sessionId, buttonText, buttonLocation, destinationUrl, ipAddress, userAgent, referrer]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track conversions
app.post('/api/track/conversion', async (req, res) => {
  try {
    const { sessionId, conversionType, value, source } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const query = `
      INSERT INTO conversions (session_id, conversion_type, value, source, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await pool.query(query, [sessionId, conversionType, value, source, ipAddress]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

// Get analytics stats
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const viewsQuery = 'SELECT COUNT(*) as count FROM page_views';
    const clicksQuery = 'SELECT COUNT(*) as count FROM clicks';
    const conversionsQuery = 'SELECT COUNT(*) as count FROM conversions';
    
    const [viewsResult, clicksResult, conversionsResult] = await Promise.all([
      pool.query(viewsQuery),
      pool.query(clicksQuery),
      pool.query(conversionsQuery)
    ]);

    const totalViews = parseInt(viewsResult.rows[0].count);
    const totalClicks = parseInt(clicksResult.rows[0].count);
    const totalConversions = parseInt(conversionsResult.rows[0].count);
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';

    res.json({
      totalViews,
      totalClicks,
      totalConversions,
      conversionRate
    });
  } catch (error) {
    console.error('Error getting analytics stats:', error);
    res.status(500).json({ error: 'Failed to get analytics stats' });
  }
});

// Simple analytics dashboard
app.get('/analytics', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>VIP Indicators Analytics Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #0a0a0a; color: white; }
            .container { max-width: 1200px; margin: 0 auto; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 40px 0; }
            .stat-card { background: #1a1a2e; padding: 30px; border-radius: 10px; text-align: center; border: 1px solid #8a2be2; }
            .stat-number { font-size: 2.5rem; font-weight: bold; color: #8a2be2; display: block; margin-bottom: 10px; }
            .stat-label { font-size: 1.1rem; opacity: 0.8; }
            h1 { text-align: center; color: #8a2be2; margin-bottom: 40px; }
            .refresh-btn { background: #8a2be2; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>VIP Indicators Funnel Analytics</h1>
            <button class="refresh-btn" onclick="loadStats()">Refresh Data</button>
            
            <div class="stats-grid" id="statsGrid">
                <div class="stat-card">
                    <span class="stat-number" id="totalViews">Loading...</span>
                    <span class="stat-label">Total Page Views</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" id="totalClicks">Loading...</span>
                    <span class="stat-label">Button Clicks</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" id="totalConversions">Loading...</span>
                    <span class="stat-label">ClickBank Conversions</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" id="conversionRate">Loading...</span>
                    <span class="stat-label">Conversion Rate %</span>
                </div>
            </div>
        </div>

        <script>
            function loadStats() {
                fetch('/api/analytics/stats')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('totalViews').textContent = data.totalViews;
                        document.getElementById('totalClicks').textContent = data.totalClicks;
                        document.getElementById('totalConversions').textContent = data.totalConversions;
                        document.getElementById('conversionRate').textContent = data.conversionRate + '%';
                    })
                    .catch(error => {
                        console.error('Error loading stats:', error);
                        document.getElementById('totalViews').textContent = 'Error';
                    });
            }
            
            // Load stats on page load
            loadStats();
            
            // Auto-refresh every 30 seconds
            setInterval(loadStats, 30000);
        </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Analytics API server running on port ${port}`);
});

module.exports = app;