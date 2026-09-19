import type { Bookings } from "../../api/bookingsManage";
import type { BookingStatus } from "../../api/bookings";

/* =======================
   Filters
======================= */

export const filterBookings = (
  bookings: Bookings[],
  search?: string,
): Bookings[] => {
  let result = [...bookings];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (b) =>
        b.venue_name.toLowerCase().includes(q) ||
        b.booker_name.toLowerCase().includes(q) ||
        b.booker_email.toLowerCase().includes(q)
    );
  }

  return result;
};

/* =======================
   Mutations
======================= */

export const updateBookingStatus = (
  bookings: Bookings[],
  id: string,
  status: BookingStatus
): Bookings[] => {
  return bookings.map((b) => (b.id === id ? { ...b, status } : b));
};
