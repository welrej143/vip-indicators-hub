# VIP Indicators Landing Page

A high-conversion ClickBank affiliate marketing landing page with real-time analytics tracking.

## Features

- Real-time page view tracking
- Affiliate click monitoring
- Conversion rate analytics
- Admin dashboard at `/dashboard.html`
- PostgreSQL database integration

## Deployment on Render.com

### Step-by-Step Deployment

#### 1. Prepare Repository
- Upload all project files to a GitHub repository
- Ensure `package.json`, `server.js`, and all HTML files are included

#### 2. Create Render Services
1. **PostgreSQL Database:**
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `vip-indicators-db`
   - Plan: Free tier
   - Save the database URL for later

2. **Web Service:**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configuration:
     - **Name**: `vip-indicators-landing`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Instance Type**: Free

#### 3. Environment Variables
In your Web Service settings, add:
- **Key**: `DATABASE_URL`
- **Value**: Select "From Database" → choose your PostgreSQL database

#### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- Your app will be live at: `https://your-service-name.onrender.com`
- Admin dashboard: `https://your-service-name.onrender.com/dashboard.html`

### Environment Variables
- `DATABASE_URL` - Automatically provided by Render's PostgreSQL service

### Database Setup
The application automatically creates all required tables on startup:
- `page_views` - Tracks visitor page views and analytics
- `clicks` - Tracks affiliate button clicks
- `leads` - Stores lead generation data
- `conversions` - Tracks conversion events
- `users` - User management (future expansion)

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