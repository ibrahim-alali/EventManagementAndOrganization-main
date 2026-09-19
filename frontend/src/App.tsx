import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PrivateRoute } from "./components/common/PrivateRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { Home } from "./pages/visitor/Home";
import { Login } from "./pages/visitor/Login";
import { Signup } from "./pages/visitor/Signup";
import { Events } from "./pages/common/Events";
import { Venues } from "./pages/common/Venues";
import { Hosts } from "./pages//common/Hosts";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { Bookings } from "./pages/client/Bookings";
import { Registrations } from "./pages/client/Registrations";
import { Ratings } from "./pages/client/Ratings";
import { ProviderDashboard } from "./pages/provider/ProviderDashboard";
import { VenuesManage } from "./pages/provider/VenuesManage";
import { VenuesArchive } from "./pages/provider/VenuesArchive";
import { BookingsManage } from "./pages/provider/BookingsManage";
import { OrganizerDashboard } from "./pages/organizer/OrganizerDashboard";
import { EventsManage } from "./pages/organizer/EventsManage";
import { EventsArchive } from "./pages/organizer/EventsArchive";
import { RegistrationsManage } from "./pages/organizer/RegistrationsManage";
import { Invitations } from "./pages/organizer/Invitations";
import { E_Ticket } from "./pages/organizer/E_Ticket.tsx";
import { BookingsCalendar } from "./pages/provider/BookingsCalendar";
import { VenueFiles } from "./pages/provider/VenueFiles";

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Router>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/providers" element={<Hosts key="provider" role="provider" />} />
            <Route path="/organizers" element={<Hosts key="organizer" role="organizer" />} />
          </Route>

          {/* ===== AUTH ===== */}
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/client" element={<Signup role="client" />} />
          <Route path="/signup/provider" element={<Signup role="provider" />} />
          <Route path="/signup/organizer" element={<Signup role="organizer" />} />

          {/* ===== CLIENT DASHBOARD ===== */}
          <Route element={<PrivateRoute requiredRole="client" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/events" element={<Events showHero={false} />} />
              <Route path="/client/registrations" element={<Registrations />} />
              <Route path="/client/venues" element={<Venues showHero={false} />} />
              <Route path="/client/bookings" element={<Bookings />} />
              <Route path="/client/event-ratings" element={<Ratings key="event" type="event" />} />
              <Route path="/client/venue-ratings" element={<Ratings key="venue" type="venue" />} />
              <Route path="/client/providers" element={<Hosts key="provider" role="provider" />} />
              <Route
                path="/client/organizers"
                element={<Hosts key="organizer" role="organizer" />}
              />
            </Route>
          </Route>

          {/* ===== PROVIDER DASHBOARD ===== */}
          <Route element={<PrivateRoute requiredRole="provider" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/my-venues" element={<VenuesManage />} />
              <Route path="/provider/archived-venues" element={<VenuesArchive />} />
              <Route path="/provider/manage-bookings" element={<BookingsManage />} />
              <Route path="/provider/calendar" element={<BookingsCalendar />} />
              <Route path="/provider/files" element={<VenueFiles />} />
            </Route>
          </Route>

          {/* ===== ORGANIZER DASHBOARD ===== */}
          <Route element={<PrivateRoute requiredRole="organizer" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
              <Route path="/organizer/bookings" element={<Bookings />} />
              <Route path="/organizer/venues" element={<Venues showHero={false} />} />
              <Route path="/organizer/my-events" element={<EventsManage />} />
              <Route path="/organizer/archived-events" element={<EventsArchive />} />
              <Route path="/organizer/manage-registrations" element={<RegistrationsManage />} />
              <Route path="/organizer/invitations" element={<Invitations />} />
              <Route path="/organizer/e-tickets" element={<E_Ticket />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
