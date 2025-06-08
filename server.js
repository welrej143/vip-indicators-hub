const express = require('express');
const path = require('path');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { desc } = require('drizzle-orm');
const ws = require('ws');

// Import schema
const schema = require('./shared/schema');

// Configure Neon
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Configure connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  min: 2,
  maxUses: 7500,
  allowExitOnIdle: true,
  maxLifetimeSeconds: 900,
  idleTimeoutMillis: 30000
});

const db = drizzle({ client: pool, schema });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.static('.'));

// Redirect admin.html to the new dashboard
app.get('/admin.html', (req, res) => {
    res.redirect('/admin-dashboard.html');
});

app.get('/admin', (req, res) => {
    res.redirect('/admin-dashboard.html');
});

// Analytics Class
class Analytics {
  static async trackPageView(data) {
    try {
      await db.insert(schema.pageViews).values({
        sessionId: data.sessionId,
        pageUrl: data.pageUrl,
        title: data.title,
        timeOnPage: data.timeOnPage,
        scrollDepth: data.scrollDepth,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      });
      return { success: true };
    } catch (error) {
      console.error('Error tracking page view:', error);
      return { success: false, error: error.message };
    }
  }

  static async trackClick(data) {
    try {
      await db.insert(schema.clicks).values({
        sessionId: data.sessionId,
        buttonText: data.buttonText,
        buttonLocation: data.buttonLocation,
        destinationUrl: data.destinationUrl,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      });
      return { success: true };
    } catch (error) {
      console.error('Error tracking click:', error);
      return { success: false, error: error.message };
    }
  }

  static async trackLead(data) {
    try {
      await db.insert(schema.leads).values({
        email: data.email,
        name: data.name,
        source: data.source,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      });
      return { success: true };
    } catch (error) {
      console.error('Error tracking lead:', error);
      return { success: false, error: error.message };
    }
  }

  static async trackConversion(data) {
    try {
      await db.insert(schema.conversions).values({
        sessionId: data.sessionId,
        conversionType: data.conversionType,
        value: data.value,
        source: data.source,
        ipAddress: data.ipAddress,
      });
      return { success: true };
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return { success: false, error: error.message };
    }
  }

  static async getStats() {
    try {
      const { count: sql } = require('drizzle-orm');
      
      const [totalViews] = await db.select({ count: sql(schema.pageViews.id) }).from(schema.pageViews);
      const [totalClicks] = await db.select({ count: sql(schema.clicks.id) }).from(schema.clicks);
      const [totalLeads] = await db.select({ count: sql(schema.leads.id) }).from(schema.leads);
      const [totalConversions] = await db.select({ count: sql(schema.conversions.id) }).from(schema.conversions);

      const viewsCount = Number(totalViews?.count || 0);
      const clicksCount = Number(totalClicks?.count || 0);
      const leadsCount = Number(totalLeads?.count || 0);
      const conversionsCount = Number(totalConversions?.count || 0);

      return {
        totalViews: viewsCount,
        totalClicks: clicksCount,
        totalLeads: leadsCount,
        totalConversions: conversionsCount,
        conversionRate: clicksCount > 0 ? (conversionsCount / clicksCount * 100).toFixed(2) : '0',
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalViews: 0,
        totalClicks: 0,
        totalLeads: 0,
        totalConversions: 0,
        conversionRate: '0',
      };
    }
  }

  static async getPageViews() {
    try {
      return await db.select().from(schema.pageViews).orderBy(desc(schema.pageViews.createdAt)).limit(50);
    } catch (error) {
      console.error('Error getting page views:', error);
      return [];
    }
  }

  static async getClicks() {
    try {
      return await db.select().from(schema.clicks).orderBy(desc(schema.clicks.createdAt)).limit(50);
    } catch (error) {
      console.error('Error getting clicks:', error);
      return [];
    }
  }

  static async getLeads() {
    try {
      return await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(50);
    } catch (error) {
      console.error('Error getting leads:', error);
      return [];
    }
  }

  static async getConversions() {
    try {
      return await db.select().from(schema.conversions).orderBy(desc(schema.conversions.createdAt)).limit(50);
    } catch (error) {
      console.error('Error getting conversions:', error);
      return [];
    }
  }
}

// Analytics API endpoints
app.get('/api/analytics/stats', async (req, res) => {
    try {
        const data = await Analytics.getStats();
        res.json(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.json({
            totalViews: 0,
            totalClicks: 0,
            totalLeads: 0,
            totalConversions: 0,
            conversionRate: '0'
        });
    }
});

app.get('/api/analytics/pageviews', async (req, res) => {
    try {
        const data = await Analytics.getPageViews();
        res.json(data);
    } catch (error) {
        console.error('Error fetching pageviews:', error);
        res.json([]);
    }
});

app.get('/api/analytics/clicks', async (req, res) => {
    try {
        const data = await Analytics.getClicks();
        res.json(data);
    } catch (error) {
        console.error('Error fetching clicks:', error);
        res.json([]);
    }
});

app.get('/api/analytics/leads', async (req, res) => {
    try {
        const data = await Analytics.getLeads();
        res.json(data);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.json([]);
    }
});

app.get('/api/analytics/conversions', async (req, res) => {
    try {
        const data = await Analytics.getConversions();
        res.json(data);
    } catch (error) {
        console.error('Error fetching conversions:', error);
        res.json([]);
    }
});

// Tracking endpoints
app.post('/api/track/pageview', async (req, res) => {
    try {
        const { sessionId, pageUrl, title, timeOnPage, scrollDepth } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        const referrer = req.get('Referer');

        const result = await Analytics.trackPageView({
            sessionId,
            pageUrl,
            title,
            timeOnPage,
            scrollDepth,
            ipAddress,
            userAgent,
            referrer,
        });

        res.json(result);
    } catch (error) {
        console.error('Error tracking page view:', error);
        res.json({ success: false, error: 'Tracking temporarily unavailable' });
    }
});

app.post('/api/track/click', async (req, res) => {
    try {
        const { sessionId, buttonText, buttonLocation, destinationUrl } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        const referrer = req.get('Referer');

        const result = await Analytics.trackClick({
            sessionId,
            buttonText,
            buttonLocation,
            destinationUrl,
            ipAddress,
            userAgent,
            referrer,
        });

        res.json(result);
    } catch (error) {
        console.error('Error tracking click:', error);
        res.json({ success: false, error: 'Tracking temporarily unavailable' });
    }
});

app.post('/api/track/lead', async (req, res) => {
    try {
        const { email, name, source } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        const referrer = req.get('Referer');

        const result = await Analytics.trackLead({
            email,
            name,
            source,
            ipAddress,
            userAgent,
            referrer,
        });

        res.json(result);
    } catch (error) {
        console.error('Error tracking lead:', error);
        res.json({ success: false, error: 'Tracking temporarily unavailable' });
    }
});

app.post('/api/track/conversion', async (req, res) => {
    try {
        const { sessionId, conversionType, value, source } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;

        const result = await Analytics.trackConversion({
            sessionId,
            conversionType,
            value,
            source,
            ipAddress,
        });

        res.json(result);
    } catch (error) {
        console.error('Error tracking conversion:', error);
        res.json({ success: false, error: 'Tracking temporarily unavailable' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle pool events
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

pool.on('connect', () => {
    console.log('Database connected successfully');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down database pool...');
    await pool.end();
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;