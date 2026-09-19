import { getRandomInt, random, randomDate, randomTime } from "../helpers/random.helpers";
import type { EventDetails, EventsResponse } from "../../api/events";

// ===== EVENT LIST GENERATION =====
export const mockEvents: EventsResponse = {
  results: Array.from({ length: 50 }, (_, i) => {
    const capacity = getRandomInt(10, 500);
    return {
      id: `e${i + 1}`,
      title: random([
        "Cultural Dance Show",
        "Art Exhibition",
        "Traditional Food Festival",
        "Music Night",
        "Historical Workshop",
        "Crafts Training",
        "Heritage Lecture",
        "Local Market Day",
        "Photography Walk",
        "Folk Storytelling",
      ]),
      description: random([
        "A vibrant celebration of culture.",
        "Join us for an immersive experience.",
        "An event showcasing local talent.",
        "Discover the roots of our heritage.",
        "A hands-on experience for all ages.",
      ]),
      type: random([
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
      ]),
      date: randomDate(),
      start_time: randomTime(),
      end_time: randomTime(),
      capacity,
      attendance_count: getRandomInt(0, capacity),
      organizer: {
        id: i + 1,
        email: "",
        full_name: "",
        phone: "",
      },
      average_rating: {
        average_rating: Math.round(Math.random() * 5 * 2) / 2,
        count: Math.floor(Math.random() * 200),
      },
      is_registered: i > 2 ? false : true,
    };
  }),
  total: 50,
  page: 1,
  page_size: 12,
};

// ===== EVENT DETAILS GENERATOR =====
export const mockEventDetails: Record<string, EventDetails> = {};

Array.from({ length: 50 }, (_, idx) => {
  const id = `e${idx + 1}`;

  mockEventDetails[id] = {
    id,
    created_at: new Date(Date.now() - Math.random() * 1e10).toISOString(),
    organizer: {
      id: idx + 1,
      email: `organizer${idx + 1}@mail.com`,
      full_name:
        random([
          "Cultural Org",
          "Art House",
          "Folk Heritage Team",
          "Community Center",
          "Local Arts Group",
          "Traditions Hub",
        ]) + ` #${idx + 1}`,
    },
    venue: {
      id: `v${idx + 1}`,
      name:
        random([
          "Main Cultural Hall",
          "Art Complex",
          "Community Theater",
          "Outdoor Heritage Park",
          "Historic Exhibition Hall",
        ]) + ` #${idx + 1}`,
      location_geo: {
        location: `${35 + Math.random()},${139 + Math.random()}`,
        area: "Tokyo",
        city: "Shibuya",
      },
      capacity: Math.floor(Math.random() * 300) + 50,
      images: [
        {
          id: `img-${id}-1`,
          image_url: `/venue_images/${id}_cover.jpg`,
          alt_text: "venue cover",
          is_cover: true,
        },
        {
          id: `img-${id}-2`,
          image_url: `/venue_images/${id}_extra.jpg`,
          alt_text: "extra view",
          is_cover: false,
        },
        {
          id: `img-${id}-3`,
          image_url: `/venue_images/${id}_extra.jpg`,
          alt_text: "extra view",
          is_cover: false,
        },
        {
          id: `img-${id}-4`,
          image_url: `/venue_images/${id}_extra.jpg`,
          alt_text: "extra view",
          is_cover: false,
        },
      ],
      average_rating: {
        average_rating: Math.round(Math.random() * 5 * 2) / 2,
        count: Math.floor(Math.random() * 200),
      },
    },
    is_registered: idx > 2 ? false : true,
  };
});
