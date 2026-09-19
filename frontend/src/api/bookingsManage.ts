import axiosClient from "./axiosClient";
import type { BookingStatus } from "./bookings";

export interface Bookings {
  id: string;
  venue_name: string;
  booker_name: string;
  booker_email: string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status: BookingStatus;
  created_at: string;
}

export const bookingsManageApi = {
  getBookings: async (query?: { search?: string }): Promise<Bookings[]> => {
    const res = await axiosClient.get("/venues/provider-bookings", {
      params: {
        ...(query?.search && { search: query.search }),
      },
    });
    return res.data;
  },

  acceptBooking: async (id: string): Promise<void> => {
    await axiosClient.post(`/venues/bookings/${id}/accept`);
  },

  rejectBooking: async (id: string): Promise<void> => {
    await axiosClient.post(`/venues/bookings/${id}/reject`);
  },

  canceledBooking: async (id: string): Promise<void> => {
    await axiosClient.post(`/venues/bookings/${id}/cancel-by-provider`);
  },
};
