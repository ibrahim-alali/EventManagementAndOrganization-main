import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";

import {
  getEventsHelper,
  getArchivedEventsHelper,
  getMyBookingsHelper,
  createEventHelper,
  updateEventHelper,
  deleteEventHelper,
  archiveEventHelper,
  unArchiveEventHelper,
} from "../helpers/eventsManage.helpers";

import type { FetchEventsParams } from "../../api/eventsManage";
import type { Event } from "../../api/eventsManage";

export const eventsManageHandlers = [
  // GET /events
  http.get(`${ENV.API_BASE_URL}/events`, ({ request }) => {
    const url = new URL(request.url);
    const params: FetchEventsParams = Object.fromEntries(url.searchParams);
    const data = getEventsHelper(params);
    return HttpResponse.json(data);
  }),

  // GET /events/archived
  http.get(`${ENV.API_BASE_URL}/events/archived`, ({ request }) => {
    const url = new URL(request.url);
    const params: FetchEventsParams = Object.fromEntries(url.searchParams);
    const data = getArchivedEventsHelper(params);
    return HttpResponse.json(data);
  }),

  // POST /events
  http.post(`${ENV.API_BASE_URL}/events`, async ({ request }) => {
    const data = (await request.json()) as Event;
    const created = createEventHelper(data);
    return HttpResponse.json(created, { status: 201 });
  }),

  // PATCH /events/:id
  http.patch(`${ENV.API_BASE_URL}/events/:id`, async ({ params, request }) => {
    const id = params.id as string;
    const data = (await request.json()) as Event;
    try {
      const updated = updateEventHelper(id, data);
      return HttpResponse.json(updated, { status: 200 });
    } catch {
      return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    }
  }),

  // DELETE /events/:id
  http.delete(`${ENV.API_BASE_URL}/events/:id`, ({ params }) => {
    const id = params.id as string;
    deleteEventHelper(id);
    return HttpResponse.json({}, { status: 204 });
  }),

  // POST /events/:id/archive
  http.post(`${ENV.API_BASE_URL}/events/:id/archive`, ({ params }) => {
    const id = params.id as string;
    try {
      archiveEventHelper(id);
      return HttpResponse.json({}, { status: 200 });
    } catch {
      return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    }
  }),

  // POST /events/:id/unarchive
  http.post(`${ENV.API_BASE_URL}/events/:id/unarchive`, ({ params }) => {
    const id = params.id as string;
    try {
      unArchiveEventHelper(id);
      return HttpResponse.json({}, { status: 200 });
    } catch {
      return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    }
  }),

  // GET /venues/bookings/organizer
  http.get(`${ENV.API_BASE_URL}/venues/bookings/organizer`, ({ request }) => {
    const url = new URL(request.url);
    const params: FetchEventsParams = Object.fromEntries(url.searchParams);
    const data = getMyBookingsHelper(params);
    return HttpResponse.json(data);
  }),
];
