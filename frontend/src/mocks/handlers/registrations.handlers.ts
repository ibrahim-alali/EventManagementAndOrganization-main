import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { v4 as uuid } from "uuid";
import { mockEvents, registrations } from "../data/registrations.mock";
import { applySearchAndOrdering } from "../helpers/registrations.filters";
import type {
  CreateRegistrationPayload,
  Registration,
  UpdateRegistrationPayload,
} from "../../api/registrations";

export const registrationsHandlers = [
  // Get Registrations Handler
  http.get(`${ENV.API_BASE_URL}/events/registrations`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;
    const ordering = url.searchParams.get("ordering") || undefined;

    const result = applySearchAndOrdering(registrations, search, ordering);

    return HttpResponse.json(result);
  }),

  // Create Registration Handler
  http.post(`${ENV.API_BASE_URL}/events/registrations`, async ({ request }) => {
    const body = (await request.json()) as CreateRegistrationPayload;

    const eventObj = mockEvents.find((e) => e.id === body.event);
    eventObj!.is_registered  = true;

    if (!eventObj) {
      return HttpResponse.json({ message: "Event not found" }, { status: 400 });
    }

    const newRegistration: Registration = {
      id: uuid(),
      event: eventObj.id as string,
      event_data: eventObj,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    registrations.unshift(newRegistration);
    return HttpResponse.json(newRegistration, { status: 201 });
  }),

  // Update Registration Handler
  http.put(`${ENV.API_BASE_URL}/events/registrations/:id`, async ({ params, request }) => {
    const { id } = params as { id: string };
    const body = (await request.json()) as UpdateRegistrationPayload;

    const index = registrations.findIndex((r) => r.id === id);

    if (index === -1) {
    return HttpResponse.json(
        { message: "Registration not found" },
        { status: 404 }
    );
    }

    const updatedRegistration = {
    ...registrations[index],
    ...body,
    };

    if (body.event) {
    const eventObj = mockEvents.find((e) => e.id === body.event);
    if (eventObj) {
        updatedRegistration.event = eventObj.id as string;
        updatedRegistration.event_data = eventObj;
    }
    }

    registrations[index] = updatedRegistration;
    return HttpResponse.json(updatedRegistration);
  }),

  // Delete Registration Handler
  http.delete(`${ENV.API_BASE_URL}/events/registrations/:id`, ({ params }) => {
    const { id } = params as { id: string };
    const index = registrations.findIndex((r) => r.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Registration not found" },
        { status: 404 }
      );
    }

    registrations.splice(index, 1);
    return HttpResponse.json(null, { status: 204 });
  }),
];
