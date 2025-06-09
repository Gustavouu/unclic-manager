import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
  private static getClient(): OAuth2Client {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    }
    return client;
  }

  static async listEvents(calendarId: string, timeMin: string, timeMax: string) {
    const auth = this.getClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items || [];
  }

  static async createEvent(calendarId: string, event: any) {
    const auth = this.getClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.insert({ calendarId, requestBody: event });
    return res.data;
  }
}
