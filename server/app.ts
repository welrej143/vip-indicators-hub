import express from 'express';
import cors from 'cors';
import { Analytics } from './analytics';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Track page views
app.post('/api/track/pageview', async (req, res) => {
  try {
    const { sessionId, pageUrl, title, timeOnPage, scrollDepth } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    await Analytics.trackPageView({
      sessionId,
      pageUrl,
      title,
      timeOnPage,
      scrollDepth,
      ipAddress,
      userAgent,
      referrer,
    });

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

    await Analytics.trackClick({
      sessionId,
      buttonText,
      buttonLocation,
      destinationUrl,
      ipAddress,
      userAgent,
      referrer,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track leads
app.post('/api/track/lead', async (req, res) => {
  try {
    const { email, name, source } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    const referrer = req.get('Referer');

    await Analytics.trackLead({
      email,
      name,
      source,
      ipAddress,
      userAgent,
      referrer,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking lead:', error);
    res.status(500).json({ error: 'Failed to track lead' });
  }
});

// Track conversions
app.post('/api/track/conversion', async (req, res) => {
  try {
    const { sessionId, conversionType, value, source } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    await Analytics.trackConversion({
      sessionId,
      conversionType,
      value,
      source,
      ipAddress,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

// Get analytics dashboard data
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const stats = await Analytics.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting analytics stats:', error);
    res.status(500).json({ error: 'Failed to get analytics stats' });
  }
});

// Get page views data
app.get('/api/analytics/pageviews', async (req, res) => {
  try {
    const data = await Analytics.getPageViews();
    res.json(data);
  } catch (error) {
    console.error('Error getting page views:', error);
    res.status(500).json({ error: 'Failed to get page views' });
  }
});

// Get clicks data
app.get('/api/analytics/clicks', async (req, res) => {
  try {
    const data = await Analytics.getClicks();
    res.json(data);
  } catch (error) {
    console.error('Error getting clicks:', error);
    res.status(500).json({ error: 'Failed to get clicks' });
  }
});

// Get leads data
app.get('/api/analytics/leads', async (req, res) => {
  try {
    const data = await Analytics.getLeads();
    res.json(data);
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({ error: 'Failed to get leads' });
  }
});

// Get conversions data
app.get('/api/analytics/conversions', async (req, res) => {
  try {
    const data = await Analytics.getConversions();
    res.json(data);
  } catch (error) {
    console.error('Error getting conversions:', error);
    res.status(500).json({ error: 'Failed to get conversions' });
  }
});

app.listen(port, () => {
  console.log(`Analytics API server running on port ${port}`);
});

export default app;