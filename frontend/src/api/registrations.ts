import axiosClient from "./axiosClient";
import type { EventType } from "./events.ts";

export type EventRegistrationStatus  = "pending" | "approved" | "rejected" | "canceled";

export interface Event {
    id?: string,
    title: string;
    description: string;
    date: string; 
    start_time: string; 
    end_time: string;
    type: EventType;
    capacity: number;
    attendance_count: number;
    is_registered: boolean;
}

export interface Registration {
    id: string;
    event: string;
    event_data: Event;
    status: EventRegistrationStatus;
    created_at: string;
}

export interface GetRegistrationsParams {
    search?: string; // search keyword
    ordering?: string; // e.g. "date", "-created_at"
}

export interface CreateRegistrationPayload {
    event: string; // event id
}

export type UpdateRegistrationPayload = Partial<CreateRegistrationPayload>;

export const registrationsApi = {
    getRegistrations: async (params?: GetRegistrationsParams): Promise<Registration[]> => {
        const res = await axiosClient.get("/events/registrations", { params });
        return res.data;
    },

    createRegistration: async (payload: CreateRegistrationPayload): Promise<Registration> => {
        const res = await axiosClient.post("/events/registrations", payload);
        return res.data;
    },

    updateRegistration: async (id: string, payload: UpdateRegistrationPayload): Promise<Registration> => {
        const res = await axiosClient.put(`/events/registrations/${id}`, payload);
        return res.data;
    },

    deleteRegistration: async (id: string): Promise<void> => {
        await axiosClient.delete(`/events/registrations/${id}`);
    },
};
