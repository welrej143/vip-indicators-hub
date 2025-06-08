import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  source: text('source'), // e.g., 'landing_page', 'video_cta', 'urgency_section'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const clicks = pgTable('clicks', {
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

export const pageViews = pgTable('page_views', {
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

export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id'),
  conversionType: text('conversion_type'), // e.g., 'clickbank_click', 'email_signup'
  value: text('value'), // conversion value or email
  source: text('source'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, {
    fields: [leads.email],
    references: [users.email],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type Click = typeof clicks.$inferSelect;
export type InsertClick = typeof clicks.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;
export type Conversion = typeof conversions.$inferSelect;
export type InsertConversion = typeof conversions.$inferInsert;