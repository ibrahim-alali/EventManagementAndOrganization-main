import axiosClient from "./axiosClient";
import type { Booking } from "./bookings";
import type { EventType } from "./events";
import type { AverageRating } from "./venues";
import type { VenueLocation } from "./venuesManage";

/* =======================
   Types
======================= */

export type EventStatus = "active" | "archived";

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    type: EventType;
    status: EventStatus;
    venue: Venue;
    booking: string;
    capacity: number;
    attendance_count: number;
    average_rating: AverageRating;
    created_at: string;
    last_time_archived?: string;
}

export interface Venue {
    id: string;
    name: string;
    description?: string;
    location_geo?: VenueLocation;
    date?: string;
    start_time?: string;
    end_time?: string;
    capacity?: number;
    price_per_hour?: string;
}

export interface CreateEventPayload {
    title: string;
    description?: string;
    date: string;
    start_time: string;
    end_time: string;
    type: EventType;
    capacity: number;
    booking: string;
    venue: Venue;
}

export interface UpdateEventPayload {
    id: string;
    title?: string;
    description?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    type?: EventType;
    capacity?: number;
    booking?: string;
    venue?: Venue;
}

// ===== Params =====
export interface FetchEventsParams {
    search?: string;
    min_date?: string;
    max_date?: string;
    ordering?: string;
}

/* =======================
   API
======================= */

export const eventsManageApi = {
    getEvents: async (filters: FetchEventsParams): Promise<Event[]> => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.min_date) params.append("min_date", filters.min_date);
        if (filters.max_date) params.append("max_date", filters.max_date);
        if (filters.ordering) params.append("ordering", filters.ordering);

        const res = await axiosClient.get(`/events?${params.toString()}`);

        return res.data;
    },

    /* -------- CREATE -------- */
    createEvent: async (payload: CreateEventPayload): Promise<Event> => {
        const res = await axiosClient.post("/events", payload);
        return res.data;
    },

    /* -------- UPDATE -------- */
    updateEvent: async (payload: UpdateEventPayload): Promise<Event> => {
        const { id, ...data } = payload;
        const res = await axiosClient.patch(`/events/${id}`, data);
        return res.data;
    },

    /* -------- ARCHIVE -------- */
    getArchivedEvents: async (filters: FetchEventsParams): Promise<Event[]> => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.min_date) params.append("min_date", filters.min_date);
        if (filters.max_date) params.append("max_date", filters.max_date);
        if (filters.ordering) params.append("ordering", filters.ordering);

        const res = await axiosClient.get(`/events/archived?${params.toString()}`);
        return res.data;
    },

    archiveEvent: async (id: string): Promise<void> => {
        await axiosClient.post(`/events/${id}/archive`);
    },

    unArchiveEvent: async (id: string): Promise<void> => {
        await axiosClient.post(`/events/${id}/unarchive`);
    },

    /* -------- DELETE -------- */
    deleteEvent: async (id: string): Promise<void> => {
        await axiosClient.delete(`/events/${id}`);
    },

    getMyBookings: async (filters: FetchEventsParams): Promise<Booking[]> => {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.ordering) params.append("ordering", filters.ordering);

        const res = await axiosClient.get(`/venues/bookings/organizer?${params.toString()}`);
        return res.data;
    },
};