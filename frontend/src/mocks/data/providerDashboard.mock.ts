import { v4 as uuid } from "uuid";

// ===== Mock Data =====

export const statsMock = {
  totalVenues: 6,
  totalBookings: 12,
  pendingBookings: 3,
  acceptedBookings: 7,
  archivedVenues: 1,
};

export const recentBookingsMock = [
  {
    id: uuid(),
    venueName: "Venue One",
    requestedDate: new Date().toISOString(),
    status: "pending",
  },
  {
    id: uuid(),
    venueName: "Venue Two",
    requestedDate: new Date().toISOString(),
    status: "approved",
  },
  {
    id: uuid(),
    venueName: "Venue Three",
    requestedDate: new Date().toISOString(),
    status: "pending",
  },
];

export const providerVenuesMock = [
  {
    id: uuid(),
    name: "Main Hall",
    location_geo: {
      city: "Amsterdam",
      area: "Center",
    },
    price_per_hour: 50,
    bookingsCount: 4,
    status: "active",
  },
  {
    id: uuid(),
    name: "Conference Room",
    location_geo: {
      city: "Rotterdam",
      area: "North",
    },
    price_per_hour: 35,
    bookingsCount: 2,
    status: "active",
  },
  {
    id: uuid(),
    name: "Banquet Hall",
    location_geo: {
      city: "Utrecht",
      area: "South",
    },
    price_per_hour: 40,
    bookingsCount: 6,
    status: "archived",
  },
  {
    id: uuid(),
    name: "Sky Lounge",
    location_geo: {
      city: "Amsterdam",
      area: "West",
    },
    price_per_hour: 60,
    bookingsCount: 1,
    status: "active",
  },
  {
    id: uuid(),
    name: "Event Hall A",
    location_geo: {
      city: "Eindhoven",
      area: "Center",
    },
    price_per_hour: 45,
    bookingsCount: 3,
    status: "active",
  },
  {
    id: uuid(),
    name: "Event Hall B",
    location_geo: {
      city: "The Hague",
      area: "North",
    },
    price_per_hour: 55,
    bookingsCount: 5,
    status: "archived",
  },
];
