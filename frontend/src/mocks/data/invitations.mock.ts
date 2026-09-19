import { type Invitations, type TicketsStats } from "../../api/invitations";
import { random } from "../helpers/random.helpers.ts";

/**
 * Generate QR payload helper (static for mock)
 */
const qr = (id: string, event: string, guest: string, type: string, date: string) =>
  JSON.stringify({
    ticket_id: id,
    event,
    guest,
    ticket_type: type,
    created_at: date,
  });

/**
 * In-memory mock database
 * MSW will mutate this directly
 */
const eventTitle = ["Art Exhibition", "Music Night", "Heritage Lecture", "Tech Conference 2025", "Startup Meetup", "Design Summit"];
const ticketStatus = ["created", "sent", "delivered", "failed", "used", "revoked"];

export const invitationsMockDB: Invitations[] = [
  {
    id: "TKT-00001",
    receiver_phone: "+31611111111",
    event: {
      id: "e1",
      title: random(eventTitle),
    },
    guest_name: "Ahmed Ali",
    ticket_type: "vip",
    send_via_whatsapp: true,
    status: random(ticketStatus),
    created_at: "2025-01-05T10:00:00Z",
    qr_code_text: qr("TKT-00001", "Tech Conference 2025", "Ahmed Ali", "vip", "2025-01-05T10:00:00Z"),
    qr_code_image: "",
  },
  {
    id: "TKT-00002",
    receiver_phone: "+31622222222",
    event: {
      id: "e2",
      title: random(eventTitle),
    },
    guest_name: "Sara Khaled",
    ticket_type: "regular",
    send_via_whatsapp: false,
    status: random(ticketStatus),
    created_at: "2025-01-06T12:30:00Z",
    qr_code_text: qr("TKT-00002", "Startup Meetup", "Sara Khaled", "regular", "2025-01-06T12:30:00Z"),
    qr_code_image: "",
  },
  {
    id: "TKT-00003",
    receiver_phone: "+31633333333",
    event: {
      id: "e3",
      title: random(eventTitle),
    },
    guest_name: "Omar Hassan",
    ticket_type: "student",
    send_via_whatsapp: true,
    status: random(ticketStatus),
    created_at: "2025-01-07T09:15:00Z",
    qr_code_text: qr("TKT-00003", "Design Summit", "Omar Hassan", "student", "2025-01-07T09:15:00Z"),
    qr_code_image: "",
  },

  // -------- bulk mock data --------
  ...Array.from({ length: 17 }).map((_, i): Invitations => {
    const index = i + 4;
    const id = `TKT-${String(index).padStart(5, "0")}`;
    const event_id = `e${i + 3}`;
    const event_title = random(eventTitle);

    const type = ["vip", "regular", "student"][i % 3] as any;
    const date = new Date(2025, 0, index).toISOString();

    return {
      id,
      receiver_phone: `+3169${1000000 + i}`,
      event: {
        id: event_id,
        title: event_title,
      },
      guest_name: `Guest ${index}`,
      ticket_type: type,
      send_via_whatsapp: i % 2 === 0,
      status: random(ticketStatus),
      created_at: date,
      qr_code_text: qr(id, event_title, `Guest ${index}`, type, date),
      qr_code_image: "",
    };
  }),
];

export const ticketsStats: TicketsStats = {
    totalguests: 35,
    totalstudent: 20,
    totalvip: 5,
    totalregular: 10,
}

/**
 * Ticket counter starts AFTER mock data
 */
let ticketCounter = invitationsMockDB.length + 1;

/**
 * Generate readable ticket id
 */
export const generateTicketId = () => {
  const id = `TKT-${String(ticketCounter).padStart(5, "0")}`;
  ticketCounter += 1;
  return id;
};
