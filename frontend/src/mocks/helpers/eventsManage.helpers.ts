import type { Event } from "../../api/eventsManage";
import type { Booking } from "../../api/bookings";
import type { FetchEventsParams } from "../../api/eventsManage";

import { events } from "../data/eventsManage.mock";
import { bookings, venues } from "../data/bookings.mock";
import { random } from "./random.helpers";

/* =======================
   Utils
======================= */

const includes = (value: string, search?: string) =>
  search ? value.toLowerCase().includes(search.toLowerCase()) : true;

const inDateRange = (date: string, min?: string, max?: string) => {
  if (min && date < min) return false;
  if (max && date > max) return false;
  return true;
};

const applyOrdering = <T extends { date?: string }>(
  data: T[],
  ordering?: string
) => {
  if (!ordering) return data;

  const isDesc = ordering.startsWith("-");
  const field = isDesc ? ordering.slice(1) : ordering;

  return [...data].sort((a: any, b: any) => {
    if (!a[field] || !b[field]) return 0;
    return isDesc
      ? b[field].localeCompare(a[field])
      : a[field].localeCompare(b[field]);
  });
};

/* =======================
   GET EVENTS
======================= */

export const getEventsHelper = (filters: FetchEventsParams): Event[] => {
  const filtered = events.filter(
    (e) =>
      e.status === "active" &&
      includes(e.title, filters.search) &&
      inDateRange(e.date, filters.min_date, filters.max_date)
  );

  return applyOrdering(filtered, filters.ordering);
};

/* =======================
   GET ARCHIVED EVENTS
======================= */

export const getArchivedEventsHelper = (
  filters: FetchEventsParams
): Event[] => {
  const filtered = events.filter(
    (e) =>
      e.status === "archived" &&
      includes(e.title, filters.search) &&
      inDateRange(e.date, filters.min_date, filters.max_date)
  );

  return applyOrdering(filtered, filters.ordering);
};

/* =======================
   GET MY BOOKINGS
======================= */

export const getMyBookingsHelper = (filters: FetchEventsParams): Booking[] => {
  const filtered = bookings.filter(
    (b) =>
      b.status === "approved" &&
      (includes(b.venue.name, filters.search) ||
        includes(b.date, filters.search))
  );

  return applyOrdering(filtered, filters.ordering);
};

/* =======================
   CREATE EVENT
======================= */

export const createEventHelper = (
  event: Omit<
    Event,
    | "id"
    | "status"
    | "attendance_count"
    | "venue"
    | "average_rating"
    | "created_at"
  >
): Event => {
  const venue = random(venues);
  const newEvent: Event = {
    id: `e${events.length + 1}`,
    status: "active",
    attendance_count: 0,
    average_rating: { average_rating: 0, count: 0 },
    created_at: new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 14
    ).toISOString(),
    venue: venue,
    last_time_archived: "",
    ...event,
  };
  events.unshift(newEvent);
  return newEvent;
};

/* =======================
   UPDATE EVENT
======================= */

export const updateEventHelper = (id: string, data: Partial<Event>): Event => {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Event not found");

  events[index] = {
    ...events[index],
    ...data,
  };

  return events[index];
};

/* =======================
   DELETE EVENT
======================= */

export const deleteEventHelper = (id: string): void => {
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) events.splice(index, 1);
};

/* =======================
   ARCHIVE / UNARCHIVE
======================= */

export const archiveEventHelper = (id: string): void => {
  const event = events.find((e) => e.id === id);
  if (!event) throw new Error("Event not found");

  event.status = "archived";
  event.last_time_archived = new Date().toISOString();
};

export const unArchiveEventHelper = (id: string): void => {
  const event = events.find((e) => e.id === id);
  if (!event) throw new Error("Event not found");

  event.status = "active";
  event.last_time_archived = undefined;
};
