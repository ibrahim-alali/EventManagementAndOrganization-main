import axiosClient from "./axiosClient";
import type { EventType } from "./events";
import type { EventRegistrationStatus } from "./registrations";

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  totalTickets: number;
  archivedEvents: number;
}

export interface RecentRegistration {
  id: string;
  clientName: string;
  eventTitle: string;
  status: EventRegistrationStatus;
  createdAt: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  ticketsSold: number;
}

export const organizerDashboardApi = {
  getOrganizerStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get("/organizer/dashboard/stats");
    return response.data;
  },

  getRecentRegistrations: async (): Promise<RecentRegistration[]> => {
    const response = await axiosClient.get(
      "/organizer/dashboard/recent-registrations"
    );
    return response.data;
  },

  getUpcomingEvents: async (): Promise<UpcomingEvent[]> => {
    const response = await axiosClient.get(
      "/organizer/dashboard/upcoming-events"
    );
    return response.data;
  },
};
