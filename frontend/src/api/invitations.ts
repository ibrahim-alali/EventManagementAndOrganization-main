import axiosClient from "./axiosClient";

/* =======================
   Types
======================= */

export type TicketType = "student" | "vip" | "regular";
export type TicketStatus = "created" | "sent" | "delivered" | "failed" | "used" | "revoked";

export interface EventItem {
  id: string;
  title: string;
}

export interface Invitations {
  id: string;
  receiver_phone: string;
  event: EventItem;
  qr_code_text: string;
  qr_code_image: string;
  status: TicketStatus;
  guest_name: string;
  ticket_type: TicketType;
  send_via_whatsapp: boolean;
  created_at: string;
}

export interface TicketsStats {
  totalguests: number;
  totalstudent: number;
  totalvip: number;
  totalregular: number;
}

export interface InvitationsRequest {
  receiver_phone: string;
  event: string;
  guest_name: string;
  ticket_type: TicketType;
  send_via_whatsapp: boolean;
}

export type InvitationsResponse = Invitations;

/* =======================
   API Methods
======================= */

export const invitationsApi = {
  /**
   * GET /api/events/invitations
   * Get all invitations
   */
  getAll: async (): Promise<Invitations[]> => {
    const res = await axiosClient.get("/events/invitations");
    return res.data;
  },

  /**
   * POST /api/events/invitations/create
   * Create new invitation
   */
  getTicketsStats: async (): Promise<TicketsStats> => {
    const res = await axiosClient.get("/events/total-guests");
    return res.data;
  },

  /**
   * POST /api/events/invitations/create
   * Create new invitation
   */
  createInvitation: async (data: InvitationsRequest): Promise<InvitationsResponse> => {
    const res = await axiosClient.post("/events/invitations/create", data);
    return res.data;
  },
};
