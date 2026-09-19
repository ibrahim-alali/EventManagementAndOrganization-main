import { http, HttpResponse, delay } from "msw";
import { ENV } from "../../config/env";
import { 
  mockOrganizerStats, 
  mockRecentRegistrations, 
  mockUpcomingEvents 
} from "../data/organizerDashboard.mock";

export const organizerDashboardHandlers = [
  // 1. Get Dashboard Stats
  http.get(`${ENV.API_BASE_URL}/organizer/dashboard/stats`, async () => {
    await delay(500);
    return HttpResponse.json(mockOrganizerStats, { status: 200 });
  }),

  // 2. Get Recent Registration Requests
  http.get(`${ENV.API_BASE_URL}/organizer/dashboard/recent-registrations`, async () => {
    await delay(500);
    return HttpResponse.json(mockRecentRegistrations, { status: 200 });
  }),

  // 3. Get Upcoming Events
  http.get(`${ENV.API_BASE_URL}/organizer/dashboard/upcoming-events`, async () => {
    await delay(500);
    return HttpResponse.json(mockUpcomingEvents, { status: 200 });
  }),
];