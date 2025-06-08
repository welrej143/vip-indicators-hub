const { pgTable, serial, text, timestamp, boolean, integer } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  source: text('source'), // e.g., 'landing_page', 'video_cta', 'urgency_section'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const clicks = pgTable('clicks', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id'),
  buttonText: text('button_text'),
  buttonLocation: text('button_location'), // e.g., 'hero', 'video_section', 'footer'
  destinationUrl: text('destination_url'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id'),
  pageUrl: text('page_url'),
  title: text('title'),
  timeOnPage: integer('time_on_page'), // seconds
  scrollDepth: integer('scroll_depth'), // percentage
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id'),
  conversionType: text('conversion_type'), // e.g., 'clickbank_click', 'email_signup'
  value: text('value'), // conversion value or identifier
  source: text('source'), // source of conversion
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
}));

const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, {
    fields: [leads.email],
    references: [users.email],
  }),
}));

module.exports = {
  users,
  leads,
  clicks,
  pageViews,
  conversions,
  usersRelations,
  leadsRelations,
};