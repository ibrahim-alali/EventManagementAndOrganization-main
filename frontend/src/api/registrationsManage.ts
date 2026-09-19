import axiosClient from "./axiosClient";
import type { Registration } from "./registrations";

export interface OrganizerRegistration extends Registration {
    attendee: Attendee;
}

interface Attendee {
    id: string;
    email: string;
    full_name: string;
}

export const registrationsManageApi = {
  getRegistrations: async (): Promise<OrganizerRegistration[]> => {
    const res = await axiosClient.get("/events/registrations/organizer");
    return res.data;
  },

  acceptRegistration: async (id: string): Promise<void> => {
    await axiosClient.post(`/events/${id}/accept`);
  },

  rejectRegistration: async (id: string): Promise<void> => {
    await axiosClient.post(`/events/${id}/reject`);
  },

  canceledRegistration: async (id: string): Promise<void> => {
    await axiosClient.post(`/events/${id}/cancel-by-organizer`);
  },
};
