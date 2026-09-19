import { random, randomDate, randomTime } from "../helpers/random.helpers";
import type { Venue } from "../../api/bookings";

// Mock bookings
export const statuses = ["pending", "approved", "rejected", "canceled"];

export const venues: Venue[] = [
    {
        id: "v1",
        name: "Main Conference Hall",
        description: "Large indoor venue for conferences",
        capacity: Math.floor(Math.random() * 300) + 50,
        price_per_hour: `${Math.floor(Math.random() * 200) + 50}`,
        location_geo: {
            location: "52.370216,4.895168",
            area: "Centrum",
            city: "Amsterdam",
        }
    },
    {
        id: "v2",
        name: "Open Air Arena",
        description: "Outdoor venue for concerts and festivals",
        capacity: Math.floor(Math.random() * 300) + 50,
        price_per_hour: `${Math.floor(Math.random() * 200) + 50}`,
        location_geo: {
            location: "51.924419,4.477733",
            area: "Downtown",
            city: "Rotterdam",
        }
    },
    {
        id: "v3",
        name: "Meeting Room A",
        description: "Small private room for workshops",
        capacity: Math.floor(Math.random() * 300) + 50,
        price_per_hour: `${Math.floor(Math.random() * 200) + 50}`,
        location_geo: {
            location: "52.370216,4.895168",
            area: "Centrum",
            city: "Amsterdam",
        }
    },
    {
        id: "v4",
        name: "Design Workshop",
        description: "Community gathering",
        capacity: Math.floor(Math.random() * 300) + 50,
        price_per_hour: `${Math.floor(Math.random() * 200) + 50}`,
        location_geo: {
            location: "51.924419,4.477733",
            area: "Downtown",
            city: "Rotterdam",
        }
    },
    {
        id: "v5",
        name: "Business Forum",
        description: "Annual professional event",
        capacity: Math.floor(Math.random() * 300) + 50,
        price_per_hour: `${Math.floor(Math.random() * 200) + 50}`,
        location_geo: {
            location: "52.370216,4.895168",
            area: "Centrum",
            city: "Amsterdam",
        }
    },
];

export const bookings = Array.from({length: 10}).map((_, i) => ({
    id: `b${i + 1}`,
    venue: random(venues),
    date: randomDate(),
    start_time: randomTime(),
    end_time: randomTime(),
    notes: Math.random() > 0.5 ? "Special requirements" : "",
    status: random(statuses),
    created_at: new Date(
        Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7
    ).toISOString(),
}));
