import { db } from './db';
import { leads, clicks, pageViews, conversions } from '../shared/schema';

export interface TrackingData {
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export class Analytics {
  static async trackPageView(data: TrackingData & {
    pageUrl: string;
    title: string;
    timeOnPage?: number;
    scrollDepth?: number;
  }) {
    try {
      await db.insert(pageViews).values({
        sessionId: data.sessionId,
        pageUrl: data.pageUrl,
        title: data.title,
        timeOnPage: data.timeOnPage,
        scrollDepth: data.scrollDepth,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  static async trackClick(data: TrackingData & {
    buttonText: string;
    buttonLocation: string;
    destinationUrl: string;
  }) {
    try {
      await db.insert(clicks).values({
        sessionId: data.sessionId,
        buttonText: data.buttonText,
        buttonLocation: data.buttonLocation,
        destinationUrl: data.destinationUrl,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  static async trackLead(data: TrackingData & {
    email: string;
    name?: string;
    source: string;
  }) {
    try {
      await db.insert(leads).values({
        email: data.email,
        name: data.name,
        source: data.source,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      });
    } catch (error) {
      console.error('Error tracking lead:', error);
    }
  }

  static async trackConversion(data: TrackingData & {
    conversionType: string;
    value: string;
    source: string;
  }) {
    try {
      await db.insert(conversions).values({
        sessionId: data.sessionId,
        conversionType: data.conversionType,
        value: data.value,
        source: data.source,
        ipAddress: data.ipAddress,
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  static async getStats() {
    try {
      const [totalViews] = await db.select({ count: db.$count(pageViews) }).from(pageViews);
      const [totalClicks] = await db.select({ count: db.$count(clicks) }).from(clicks);
      const [totalLeads] = await db.select({ count: db.$count(leads) }).from(leads);
      const [totalConversions] = await db.select({ count: db.$count(conversions) }).from(conversions);

      return {
        totalViews: totalViews?.count || 0,
        totalClicks: totalClicks?.count || 0,
        totalLeads: totalLeads?.count || 0,
        totalConversions: totalConversions?.count || 0,
        conversionRate: totalClicks?.count ? ((totalConversions?.count || 0) / totalClicks.count * 100).toFixed(2) : '0',
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
}