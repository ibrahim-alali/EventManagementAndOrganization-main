import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { statsMock, recentBookingsMock, providerVenuesMock } from "../data/providerDashboard.mock";

export const providerDashboardHandlers = [
  // Stats
  http.get(`${ENV.API_BASE_URL}/provider/dashboard/stats`, () => {
    return HttpResponse.json(statsMock);
  }),

  // Recent Booking Requests
  http.get(`${ENV.API_BASE_URL}/provider/dashboard/recent-bookings`, () => {
    return HttpResponse.json(recentBookingsMock);
  }),

  // Provider Venues
  http.get(`${ENV.API_BASE_URL}/provider/dashboard/venues`, () => {
    return HttpResponse.json(providerVenuesMock);
  }),
];