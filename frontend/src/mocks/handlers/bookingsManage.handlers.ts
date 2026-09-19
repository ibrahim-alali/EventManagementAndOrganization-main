import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";

import { bookingsManageDB } from "../data/bookingsManage.mock";
import {
  filterBookings,
  updateBookingStatus,
} from "../helpers/bookingsManage.helpers";

let db = [...bookingsManageDB];

export const bookingsManageHandlers = [
  /* =======================
     GET – Provider Bookings
  ======================= */
  http.get(`${ENV.API_BASE_URL}/venues/provider-bookings`, ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search") ?? undefined;

    const data = filterBookings(db, search);

    return HttpResponse.json(data, { status: 200 });
  }),

  /* =======================
     POST – Accept
  ======================= */
  http.post(`${ENV.API_BASE_URL}/venues/bookings/:id/accept`, ({ params }) => {
    db = updateBookingStatus(db, params.id as string, "approved");
    return HttpResponse.json(null, { status: 200 });
  }),

  /* =======================
     POST – Reject
  ======================= */
  http.post(`${ENV.API_BASE_URL}/venues/bookings/:id/reject`, ({ params }) => {
    db = updateBookingStatus(db, params.id as string, "rejected");
    return HttpResponse.json(null, { status: 200 });
  }),

  /* =======================
     POST – Cancel by Provider
  ======================= */
  http.post(
    `${ENV.API_BASE_URL}/venues/bookings/:id/cancel-by-provider`,
    ({ params }) => {
      db = updateBookingStatus(db, params.id as string, "canceled");
      return HttpResponse.json(null, { status: 200 });
    }
  ),
];
