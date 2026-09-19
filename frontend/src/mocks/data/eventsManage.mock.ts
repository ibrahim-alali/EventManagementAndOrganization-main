import { random, randomDate } from "../helpers/random.helpers";
import { bookings } from "./bookings.mock";

import type {
  Event,
  EventStatus,
} from "../../api/eventsManage";
import type { EventType } from "../../api/events";
import type { AverageRating } from "../../api/venues";

/* =======================
    Static Data
======================= */

const eventTypes: EventType[] = [
    "seminar",
    "workshop",
    "lecture",
    "panel",
    "roundedTable",
    "networking",
    "webinar",
    "training",
    "discussion",
    "exhibition",
    "conference",
];

const eventStatuses: EventStatus[] = ["active", "archived"];


const createAverageRating = (): AverageRating => ({
  average_rating: Number((Math.random() * 2 + 3).toFixed(1)), 
  count: Math.floor(Math.random() * 50) + 5,
});

/* =======================
   Mock Events Generator
======================= */

export const events: Event[] = Array.from({ length: 10 }).map((_, i) => {
  const booking = random(bookings);
  const status = random(eventStatuses);
  return {
    id: `e${i + 1}`,
    title: `Event ${i + 1}`,
    description: `Mock description for event ${i + 1}`,
    date: booking.date,
    start_time: booking.start_time,
    end_time: booking.end_time,
    type: random(eventTypes),
    status,
    venue: booking.venue,
    booking: booking.id,
    capacity: Math.min(
      booking.venue.capacity,
      Math.floor(Math.random() * 200) + 20
    ),
    attendance_count: Math.floor(Math.random() * 50),
    average_rating: createAverageRating(),
    created_at: new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 14
    ).toISOString(),
    last_time_archived:
      status === "archived" ? randomDate() : "",
  };
});
