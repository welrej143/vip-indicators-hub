# VIP Indicators Landing Page

A high-conversion ClickBank affiliate marketing landing page with real-time analytics tracking.

## Features

- Real-time page view tracking
- Affiliate click monitoring
- Conversion rate analytics
- Admin dashboard at `/dashboard.html`
- PostgreSQL database integration

## Deployment on Render.com

### Quick Deploy
1. Fork this repository to your GitHub account
2. Connect your GitHub account to Render.com
3. Create a new Web Service from your forked repository
4. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
5. Add a PostgreSQL database and connect it to your web service

### Environment Variables
- `DATABASE_URL` - Automatically provided by Render's PostgreSQL service

### Database Setup
The application will automatically create the required tables on first run.

## Local Development

```bash
npm install
node server.js
```

Visit `http://localhost:5000` for the landing page and `http://localhost:5000/dashboard.html` for analytics.

## Analytics Endpoints

- `GET /api/stats` - Get overall statistics
- `GET /api/page-views` - Get page view data
- `POST /api/track/page-view` - Track a page view
- `POST /api/track/click` - Track an affiliate click