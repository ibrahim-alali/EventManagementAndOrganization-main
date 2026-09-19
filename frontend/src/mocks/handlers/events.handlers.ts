import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { mockEvents, mockEventDetails } from "../data/events.mock";
import { filterPublicEvents } from "../helpers/events.filters";

export const eventsHandlers = [
  // Events with Filters Handler
  http.get(`${ENV.API_BASE_URL}/events/public`, ({ request }) => {
    const data = filterPublicEvents(request, mockEvents);
    return HttpResponse.json(data);
  }),

  // Specific Event Handler
  http.get(`${ENV.API_BASE_URL}/events/public/:id`, ({ params }) => {
    const id = params.id as string;

    if (!mockEventDetails[id]) {
      return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    }

    return HttpResponse.json(mockEventDetails[id], { status: 200 });
  }),

  // Recommendations Events Handler
  http.get(`${ENV.API_BASE_URL}/recommendation/recommendations/events`, () => {
    const latestEvents = mockEvents.results.slice(-6);
    return HttpResponse.json({ results: latestEvents }, { status: 200 });
  }),
];
