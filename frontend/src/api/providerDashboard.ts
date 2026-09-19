import axiosClient from "./axiosClient";
import type { BookingStatus } from "./bookings";
import type { VenueLocation } from "./venuesManage";

/* =========================
   Types
========================= */

// 1️⃣ Stats
export interface ProviderStats {
  totalVenues: number;
  totalBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  archivedVenues: number;
}

export interface RecentBooking {
  id: string;
  venueName: string;
  requestedDate: string; // ISO string
  status: BookingStatus;
}

// 3️⃣ Provider Venues
export interface ProviderVenue {
  id: string;
  name: string;
  location_geo: VenueLocation;
  price_per_hour: number;
  bookingsCount: number;
  status: "active" | "archived";
}

/* =========================
   API Methods
========================= */

export const providerDashboardApi = {
  getProviderStats: async (): Promise<ProviderStats> => {
    const { data } = await axiosClient.get<ProviderStats>(
      "/provider/dashboard/stats"
    );
    return data;
  },

  /**
   * Get recent booking requests
   */
  getRecentBookingRequests: async (): Promise<RecentBooking[]> => {
    const { data } = await axiosClient.get<RecentBooking[]>(
      "/provider/dashboard/recent-bookings"
    );
    return data;
  },

  /**
   * Get provider venues
   */
  getProviderVenues: async (): Promise<ProviderVenue[]> => {
    const { data } = await axiosClient.get<ProviderVenue[]>(
      "/provider/dashboard/venues"
    );
    return data;
  },
};
