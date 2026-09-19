import React, { useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

// Components
import { Sidebar } from "../components/dashboard/common/Sidebar";
import { Header } from "../components/dashboard/common/Header";
import { ScrollToTop } from "../components/common/ScrollToTop";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { getRole } from "../utils/authRole";

export type LayoutContextType = {
  scrollableNodeRef: React.RefObject<HTMLDivElement | null>;
};

export const DashboardLayout: React.FC = () => {
  const [_currentSection, setCurrentSection] = useState("dashboard");
  const location = useLocation();
  let current = location.pathname.split("/").pop()!;


  const scrollableNodeRef = useRef<HTMLDivElement | null>(null);

  if (current === "events") current = "registrations";
  else if (current === "venues") current = "bookings";
  else if (current === "event-ratings") current = "eventsRatings";
  else if (current === "venue-ratings") current = "venuesRatings";
  else if (current === "my-venues") current = "myVenues";
  else if (current === "archived-venues") current = "archivedVenues";
  else if (current === "manage-bookings") current = "manageBookings";
  else if (current === "my-events") current = "myEvents";
  else if (current === "archived-events") current = "archivedEvents";
  else if (current === "manage-registrations") current = "manageRegistrations";
  else if (current === "e-tickets") current = "e_tickets";
  else if (current === "files") current = "filesAndImages";


  const titles: Record<string, { title: string; subtitle: string }> = {
    // Client Link
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome back! Here's your overview.",
    },
    bookings: {
      title: "Venue Bookings",
      subtitle: "Manage all your event bookings in one place.",
    },
    registrations: {
      title: "Registrations",
      subtitle: "Track and manage event registrations.",
    },
    venuesRatings: {
      title: "Venue Ratings",
      subtitle: "View and manage venue ratings and reviews.",
    },
    eventsRatings: {
      title: "Event Ratings",
      subtitle: "Monitor event feedback and ratings.",
    },
    providers: {
      title: "venue providers",
      subtitle: "View People who list and manage venues.",
    },
    organizers: {
      title: "event organizers",
      subtitle: "View People who responsible for events organization.",
    },
    // Provider Link
    statistics: {
      title: "Statistics",
      subtitle: "Analyze your venues performance and key metrics.",
    },
    myVenues: {
      title: "My Venues",
      subtitle: "View and manage all venues you provide.",
    },
    archivedVenues: {
      title: "Archived Venues",
      subtitle: "Access venues that are no longer active or published.",
    },
    manageBookings: {
      title: "Manage Bookings",
      subtitle: "Handle and track bookings for your venues.",
    },
    calendar: {
      title: "Calendar",
      subtitle: "View venue availability and scheduled bookings.",
    },
    filesAndImages: {
      title: "Files & Images",
      subtitle: "Upload and manage images for your venues.",
    },
    // Organizer Link
    reports: {
      title: "Reports & Analytics",
      subtitle: "Track your event performance.",
    },
    myEvents: {
      title: "My Events",
      subtitle: "Manage your event listings.",
    },
    archivedEvents: {
      title: "Archived Events",
      subtitle: "View and restore completed events.",
    },
    manageRegistrations: {
      title: "Manage Registrations",
      subtitle: "View and manage attendee registrations.",
    },
    invitations: {
      title: "Invitations",
      subtitle: "Generate and send QR-coded e-tickets.",
    },
    e_tickets: {
      title: "E-Tickets",
      subtitle: "View all generated electronic tickets.",
    },
  };

  const role = getRole();
  const isProvider = role === "provider";
  const isOrganizer = role === "organizer";

  return (
    <>
      <ScrollToTop scrollableRef={scrollableNodeRef} />

      <div className="flex h-screen bg-gray-50 font-nata-sans-rg">
        {/* Sidebar */}
        <Sidebar onSectionChange={setCurrentSection} />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header
            pageTitle={titles[current].title}
            pageSubtitle={titles[current].subtitle}
          />

          <SimpleBar
            scrollableNodeProps={{ ref: scrollableNodeRef }}
            style={{ maxHeight: "90vh" }}
            className={isProvider ? `custom-scrollbar-provider` : isOrganizer ? `custom-scrollbar-organizer` : `custom-scrollbar`}
          >
            {/* Page Content */}
            <main className="min-h-screen flex-1 p-4">
              <Outlet
                context={{ scrollableNodeRef } satisfies LayoutContextType}
              />
            </main>
          </SimpleBar>
        </div>
      </div>
    </>
  );
};
