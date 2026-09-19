import {v4 as uuid} from "uuid";
import {getRandomInt, random, randomDate, randomTime} from "../helpers/random.helpers";
import type {Event, Registration} from "../../api/registrations";

export const statuses = ["pending", "approved", "rejected", "canceled"];

// Mock Registrations
const eventType = [
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
    "conference"
];
const createEvent = (
    id: string,
    title: string,
    description: string
): Event => {
    const capacity = getRandomInt(10, 500);

    return {
        id,
        title,
        description,
        type: random(eventType),
        date: randomDate(),
        start_time: randomTime(),
        end_time: randomTime(),
        capacity,
        attendance_count: getRandomInt(0, capacity),
        is_registered: true,
    };
};

export const mockEvents: Event[] = [
    createEvent("e1", "Tech Conference", "Annual technology conference"),
    createEvent("e2", "Music Festival", "Live music festival"),
    createEvent("e3", "Startup Meetup", "Networking for startups"),
];


export const registrations: Registration[] = Array.from({length: 6}).map(() => {
    const selectedEvent = random(mockEvents);
    return {
        id: uuid(),
        event: selectedEvent.id,
        event_data: selectedEvent,
        status: random(statuses),
        created_at: new Date(
            Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7
        ).toISOString(),
    };
});
