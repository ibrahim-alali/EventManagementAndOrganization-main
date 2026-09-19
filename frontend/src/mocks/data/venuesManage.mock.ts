import type { VenueImage } from "../../api/venues";
import type { Venue } from "../../api/venuesManage";
import { randomDate } from "../helpers/random.helpers";

/* =======================
   In-memory Database
======================= */

export const venueManageDB: Venue[] = Array.from({ length: 20 }, (_, i) => ({
  id: `venue-${i + 1}`,
  name: `Venue #${i + 1}`,
  description: "Mock venue description",
  location_geo: {
    location: "33.514,36.277",
    area: "Damascus",
    city: "Midan",
  },
  capacity: 100 + i * 10,
  price_per_hour: 50 + i * 5,
  status: "active",
  created_at: new Date().toISOString(),
  average_rating: {
    average_rating: Math.round(Math.random() * 5 * 2) / 2,
    count: Math.floor(Math.random() * 200),
  },
  last_time_archived: "",
}));

export const archivedVenuesDB: Venue[] = Array.from({ length: 20 }, (_, i) => {
  const index = i + 21;
  return {
    id: `venue-${index}`,
    name: `Venue #${index}`,
    description: "Mock venue description",
    location_geo: {
      location: "33.514,36.277",
      area: "Damascus",
      city: "Zahera",
    },
    capacity: 100 + i * 10,
    price_per_hour: 50 + i * 5,
    status: "archived",
    created_at: new Date().toISOString(),
    average_rating: {
      average_rating: Math.round(Math.random() * 5 * 2) / 2,
      count: Math.floor(Math.random() * 200),
    },
    last_time_archived: randomDate(),
  };
});

// In-memory database for venue images
export const venueImagesDB: Record<string, VenueImage[]> = {};