import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { mockVenues, mockVenueDetails } from "../data/venues.mock";
import { filterPublicVenues } from "../helpers/venues.filters";

export const venuesHandlers = [
  // Venues with Filters Handler
  http.get(`${ENV.API_BASE_URL}/venues/public`, async ({ request }) => {
    const data = filterPublicVenues(request, mockVenues);
    return HttpResponse.json(data);
  }),

  // Specific Venue Handler
  http.get(`${ENV.API_BASE_URL}/venues/public/:id`, async ({ params }) => {
    const id = params.id as string;
    const venue = mockVenueDetails[id];
    if (!venue) return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    return HttpResponse.json(venue);
  }),

  // Recommendations Venues Handler
  http.get(`${ENV.API_BASE_URL}/recommendation/recommendations/venues`, () => {
    const latestVenues = mockVenues.slice(-6);
    return HttpResponse.json({ results: latestVenues }, { status: 200 });
  }),
];
