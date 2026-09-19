import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import { v4 as uuid } from "uuid";
import { applySearchAndOrdering } from "../helpers/bookings.filters";
import { bookings, venues } from "../data/bookings.mock";
import type {CreateBookingPayload, UpdateBookingPayload} from "../../api/bookings.ts";

export const bookingsHandlers = [
    // Get Bookings Handler
    http.get(`${ENV.API_BASE_URL}/venues/bookings`, ({request}) => {
        const url = new URL(request.url);
        const search = url.searchParams.get("search") || undefined;
        const ordering = url.searchParams.get("ordering") || undefined;

        const result = applySearchAndOrdering(bookings, search, ordering);

        return HttpResponse.json(result);
    }),

    // Create Booking Handler
    http.post(`${ENV.API_BASE_URL}/venues/bookings`, async ({request}) => {
        const body = (await request.json()) as CreateBookingPayload;

        const newBooking = {
            id: uuid(),
            venue: {
                id: body.venue_id,
                name: "Main Conference Hall",
                description: "Large indoor venue for conferences",
            },
            status: "pending",
            created_at: new Date().toISOString(),
            date: body.date,
            start_time: body.start_time,
            end_time: body.end_time,
            notes: body.notes || "",
        };

        bookings.unshift(newBooking);

        return HttpResponse.json(newBooking, {status: 201});
    }),

    // Update Booking Handler
    http.put(`${ENV.API_BASE_URL}/venues/bookings/:id`, async ({params, request}) => {
            const {id} = params as { id: string };
            const body = (await request.json()) as UpdateBookingPayload;

            const index = bookings.findIndex((b) => b.id === id);

            if (index === -1) {
                return HttpResponse.json(
                    {message: "Booking not found"},
                    {status: 404}
                );
            }

            const updatedBooking = {
                ...bookings[index],
                ...body,
            };

            if (typeof body.venue_id === "string") {
                const venueObj = venues.find((v) => v.id === body.venue_id);

                if (!venueObj) {
                    return HttpResponse.json(
                        {message: "Venue not found"},
                        {status: 400}
                    );
                }

                updatedBooking.venue = venueObj;
            }

            bookings[index] = updatedBooking;

            return HttpResponse.json(bookings[index]);
        }
    ),

    // Delete Booking Handler
    http.delete(`${ENV.API_BASE_URL}/venues/bookings/:id`, ({params}) => {
        const {id} = params as { id: string };

        const index = bookings.findIndex((b) => b.id === id);

        if (index === -1) {
            return HttpResponse.json(
                {message: "Booking not found"},
                {status: 404}
            );
        }

        bookings.splice(index, 1);

        return HttpResponse.json(null, {status: 204});
    }),
];