import axiosClient from "./axiosClient";

export interface DashboardStatsResponse {
  totalBookings: number;
  registrations: number;
  venueRatings: number;
  eventRatings: number;
  eventOrganizers: number;
  venueProviders: number;
}

export interface RecentActivityItem {
  id: number;
  type: "booking" | "registration" | "venue_rating" | "event_rating" | "provider_rating" | "organizer_rating";
  title: string;
  description: string;
  time: string;
}

export const clientDashboardApi = {
  getStats: async (): Promise<DashboardStatsResponse> => {
    const res = await axiosClient.get("/client/dashboard/stats");
    return res.data;
  },
  getRecentActivity: async (): Promise<RecentActivityItem[]> => {
    const res = await axiosClient.get("/client/dashboard/recent-activity");
    return res.data;
  },
};