import type { 
  DashboardStats, 
  RecentRegistration, 
  UpcomingEvent 
} from "../../api/organizerDashboard"; 

export const mockOrganizerStats: DashboardStats = {
  totalEvents: 12,
  totalRegistrations: 840,
  pendingRegistrations: 15,
  totalTickets: 1250,
  archivedEvents: 5,
};

export const mockRecentRegistrations: RecentRegistration[] = [
  {
    id: "reg-101",
    clientName: "Ahmed Mohamed",
    eventTitle: "Tech Conference 2024",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "reg-102",
    clientName: "Sara Johnson",
    eventTitle: "Art Exhibition",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "reg-103",
    clientName: "Mike Ross",
    eventTitle: "Music Festival",
    status: "canceled",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
//   {
//     id: "reg-104",
//     clientName: "Layla Hassan",
//     eventTitle: "Tech Conference 2024",
//     status: "rejected",
//     createdAt: new Date(Date.now() - 259200000).toISOString(),
//   },
];

export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: "ev-1",
    title: "Global AI Summit",
    description: "A summit discussing the future of AI.",
    type: "conference",
    date: "2024-12-15T10:00:00Z",
    location: "Dubai Hub, UAE",
    ticketsSold: 450,
  },
  {
    id: "ev-2",
    title: "Startup Pitch Night",
    description: "Entrepreneurs pitching to VCs.",
    type: "workshop",
    date: "2024-11-20T18:30:00Z",
    location: "Online (Zoom)",
    ticketsSold: 120,
  },
  {
    id: "ev-3",
    title: "Modern Art Gala",
    description: "Evening celebrating contemporary artists.",
    type: "exhibition",
    date: "2024-11-05T19:00:00Z",
    location: "Downtown Gallery",
    ticketsSold: 85,
  },
    {
    id: "ev-4",
    title: "Global AI Summit",
    description: "A summit discussing the future of AI.",
    type: "conference",
    date: "2024-12-15T10:00:00Z",
    location: "Dubai Hub, UAE",
    ticketsSold: 450,
  },
  {
    id: "ev-5",
    title: "Startup Pitch Night",
    description: "Entrepreneurs pitching to VCs.",
    type: "workshop",
    date: "2024-11-20T18:30:00Z",
    location: "Online (Zoom)",
    ticketsSold: 120,
  },
  {
    id: "ev-6",
    title: "Modern Art Gala",
    description: "Evening celebrating contemporary artists.",
    type: "exhibition",
    date: "2024-11-05T19:00:00Z",
    location: "Downtown Gallery",
    ticketsSold: 85,
  },
];