import axiosClient from "./axiosClient";
import type { VenueLocation } from "./venuesManage";

export type BookingStatus = "pending" | "approved" | "rejected" | "canceled";

export interface Venue {
  id: string;
  name: string;
  description: string;
  capacity?: number;
  price_per_hour?: string;
  location_geo?: VenueLocation;
}

export interface Booking {
  id: string;
  venue: Venue,
  date: string; // ISO date
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  notes?: string;
  status: BookingStatus;
  created_at: string; // ISO datetime
}

export interface GetBookingsParams {
  search?: string; // search keyword
  ordering?: string; // e.g. "date", "-created_at"
}

export interface CreateBookingPayload {
  venue_id: string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export type UpdateBookingPayload = Partial<CreateBookingPayload>;

export const bookingsApi = {
  getBookings: async (params?: GetBookingsParams): Promise<Booking[]> => {
    const res = await axiosClient.get("/venues/bookings", { params });
    return res.data;
  },

  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const res = await axiosClient.post("/venues/bookings", payload);
    return res.data;
  },

  updateBooking: async (id: string, payload: UpdateBookingPayload): Promise<Booking> => {
    const res = await axiosClient.put(`/venues/bookings/${id}`, payload);
    return res.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await axiosClient.delete(`/venues/bookings/${id}`);
  },
};
