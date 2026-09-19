import { type Invitations, type TicketType } from "../../api/invitations";
import { invitationsMockDB, generateTicketId } from "../data/invitations.mock";
import { delay } from "msw";

/**
 * Generate QR text payload
 * (this is what QRCode component will encode)
 */
export const generateQrPayload = (invitation: Invitations) => {
  return JSON.stringify({
    ticket_id: invitation.id,
    event: invitation.event,
    guest: invitation.guest_name,
    ticket_type: invitation.ticket_type,
    created_at: invitation.created_at,
  });
};

/**
 * Create a new invitation (mocked)
 */
export const createInvitationMock = async (payload: {
  receiver_phone: string;
  event: string;
  guest_name: string;
  ticket_type: TicketType;
  send_via_whatsapp: boolean;
}): Promise<Invitations> => {
  // simulate network latency
  await delay(1200);

  const newInvitation: Invitations = {
    id: generateTicketId(),
    receiver_phone: payload.receiver_phone,
    event: {
      id: payload.event,
      title: "Heritage Lecture",
    },
    guest_name: payload.guest_name,
    ticket_type: payload.ticket_type,
    send_via_whatsapp: payload.send_via_whatsapp,

    status: "created",
    qr_code_text: "",
    qr_code_image: "", // optional, not needed for preview
    created_at: new Date().toISOString(),
  };

  // generate QR text AFTER object exists
  newInvitation.qr_code_text = generateQrPayload(newInvitation);

  invitationsMockDB.push(newInvitation);

  return newInvitation;
};

/**
 * Get all invitations
 */
export const getInvitationsMock = async (): Promise<Invitations[]> => {
  await delay(600);
  return invitationsMockDB;
};