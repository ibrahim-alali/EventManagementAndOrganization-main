import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { stats, recentActivity } from "../data/clientDashboard.mock";

export const clientDashboardHandlers = [
    // Client Dashboard Stats Handler
    http.get(`${ENV.API_BASE_URL}/client/dashboard/stats`, async () => {
        return HttpResponse.json(stats);
    }),

    // Client Dashboard Recent Activity Handler
    http.get(`${ENV.API_BASE_URL}/client/dashboard/recent-activity`, async () => {
        return HttpResponse.json(recentActivity);
    }),
];