import React, { cloneElement, useState, type JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMe, useLogout } from "../../../hooks/useAuth";
import { getRole } from "../../../utils/authRole";
import {
  Calendar,
  Users,
  Star,
  Heart,
  MoreVertical,
  LogOut,
  User,
  Building2,
  CalendarDays,
  LayoutDashboard,
  Store,
  BarChart3,
  Building,
  Archive,
  CalendarCheck,
  Image,
  LayoutGrid,
  Mail,
  QrCode,
  Layers,
  CalendarClock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const sidebarVariants: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.15 } },
};

interface SidebarDashboardProps {
  onSectionChange: (section: string) => void;
}

type SidebarItem = {
  name: string;
  label: string;
  path: string;
  icon: JSX.Element;
  isNew?: boolean;
  badge?: string;
};

export const Sidebar: React.FC<SidebarDashboardProps> = ({ onSectionChange }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let currentSection = location.pathname.split("/").pop();

  const { data: me, isLoading } = useMe();
  const { logout } = useLogout();

  const role = getRole(); // "client" | "provider" | "organizer"
  const isProvider = role === "provider";
  const isOrganizer = role === "organizer";

  const roleColors = {
    active: isProvider ? "text-emerald-600" : isOrganizer ? "text-amber-600" : "text-violet-600",
    inactive: "text-gray-500",
    border: isProvider ? "#10b981" : isOrganizer ? "#d97706" : "#7c3aed",
    bgHover: isProvider ? "#ecfdf5" : isOrganizer ? "#fffbeb" : "#f3e8ff",
    badgeBg: isProvider ? "bg-emerald-100" : isOrganizer ? "bg-amber-100" : "bg-violet-100",
    badgeText: isProvider ? "text-emerald-700" : isOrganizer ? "text-amber-700" : "text-violet-700",
    avatarFrom: isProvider ? "from-emerald-400" : isOrganizer ? "from-amber-400" : "from-violet-400",
    avatarTo: isProvider ? "to-emerald-500" : isOrganizer ? "to-orange-500" : "to-purple-500",
  };

  // mappings
  if (currentSection === "events") currentSection = "registrations";
  else if (currentSection === "venues") currentSection = "bookings";
  else if (currentSection === "event-ratings") currentSection = "eventsRatings";
  else if (currentSection === "venue-ratings") currentSection = "venuesRatings";
  else if (currentSection === "my-venues") currentSection = "myVenues";
  else if (currentSection === "archived-venues") currentSection = "archivedVenues";
  else if (currentSection === "manage-bookings") currentSection = "manageBookings";
  else if (currentSection === "my-events") currentSection = "myEvents";
  else if (currentSection === "archived-events") currentSection = "archivedEvents";
  else if (currentSection === "manage-registrations") currentSection = "manageRegistrations";
  else if (currentSection === "e-tickets") currentSection = "e_tickets";
  else if (currentSection === "files") currentSection = "filesAndImages";


  /* =========================================================
          ================ CLIENT MENU =================
     ========================================================= */
  const mainMenuItems: SidebarItem[] = [
    { name: "dashboard", label: "Dashboard", icon: <LayoutGrid />, path: "/client/dashboard" },
  ];

  const managementItems: SidebarItem[] = [
    { name: "bookings", label: "Venue Bookings", icon: <Calendar />, path: "/client/bookings" },
    { name: "registrations", label: "Event Registrations", icon: <Users />, path: "/client/registrations" },
    { name: "venuesRatings", label: "Venue Ratings", icon: <Star />, path: "/client/venue-ratings" },
    { name: "eventsRatings", label: "Event Ratings", icon: <Heart />, path: "/client/event-ratings" },
  ];

  const hosts: SidebarItem[] = [
    { name: "providers", label: "Venue Providers", icon: <Building2 className="h-5 w-5 text-gray-500" />, path: "/client/providers" },
    { name: "organizers", label: "Event Organizers", icon: <CalendarDays className="h-5 w-5 text-gray-500" />, path: "/client/organizers" },
  ];

  /* =========================================================
          ================ PROVIDER MENU =================
     ========================================================= */
  const providerOverviewItems: SidebarItem[] = [
    { name: "dashboard", label: "Dashboard", icon: <LayoutGrid />, path: "/provider/dashboard" },
    { name: "statistics", label: "Statistics", icon: <BarChart3 />, path: "/provider/statistics" },
  ];

  const providerVenueManagementItems: SidebarItem[] = [
    { name: "myVenues", label: "My Venues", icon: <Building />, path: "/provider/my-venues" },
    { name: "archivedVenues", label: "Archived", icon: <Archive />, path: "/provider/archived-venues" },
  ];

  const providerBookingsItems: SidebarItem[] = [
    { name: "manageBookings", label: "Manage Bookings", icon: <CalendarCheck />, path: "/provider/manage-bookings" },
    { name: "calendar", label: "Calendar", icon: <CalendarDays />, path: "/provider/calendar", isNew: true },
  ];

  const providerMediaItems: SidebarItem[] = [
    { name: "filesAndImages", label: "Files & Images", icon: <Image />, path: "/provider/files" },
  ];

    /* =========================================================
          ================ ORGANIZER MENU =================
     ========================================================= */
  const organizerOverviewItems: SidebarItem[] = [
    { name: "dashboard", label: "Dashboard", icon: <LayoutGrid />, path: "/organizer/dashboard" },
    { name: "reports", label: "Reports", icon: <BarChart3 />, path: "/organizer/reports" },
  ];

  const organizerEventManagementItems: SidebarItem[] = [
    { name: "myEvents", label: "My Events", icon: <Layers />, path: "/organizer/my-events" },
    { name: "archivedEvents", label: "Archived", icon: <Archive />, path: "/organizer/archived-events" },
    { name: "bookings", label: "Venue Bookings", icon: <Calendar />, path: "/organizer/bookings" },
  ];

  const organizerAttendeeItems: SidebarItem[] = [
    { name: "manageRegistrations", label: "Registrations", icon: <Users />, path: "/organizer/manage-registrations" },
    { name: "invitations", label: "Invitations", icon: <Mail />, path: "/organizer/invitations",  isNew: true, badge: "QR" },
    { name: "e_tickets", label: "E-Tickets", icon: <QrCode />, path: "/organizer/e-tickets" },
  ];

  const MotionLink = motion(Link);

  const renderItems = (items: SidebarItem[]) =>
    items.map((item, index) => {
      const isActive = currentSection === item.name;

      const iconColorClass = item.name === "dashboard"
          ? roleColors.active
          : (isActive ? roleColors.active : roleColors.inactive);

      return (
        <MotionLink
          key={item.name}
          to={item.path}
          onClick={() => onSectionChange(item.name)}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.03 }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className={`sidebar-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-700 transition-all ${
            isActive ? "active" : ""
          }`}
        >
          {cloneElement(item.icon, {
            className: `w-5 h-5 ${iconColorClass}`,
          })}

          <span className="font-nata-sans-md">{item.label}</span>

          {item.isNew && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`ml-auto rounded-full px-2 py-0.5 font-nata-sans-md text-xs ${roleColors.badgeBg} ${roleColors.badgeText}`}
            >
             {item.badge || "New"}

            </motion.span>
          )}
        </MotionLink>
      );
    });

  const sidebarStyle = `
    .sidebar-item:hover {
      background: linear-gradient(90deg, ${roleColors.bgHover} 0%, transparent 100%);
    }
    .sidebar-item.active {
      background: linear-gradient(90deg, ${roleColors.bgHover} 0%, transparent 100%);
      border-left: 3px solid ${roleColors.border};
    }
    .sidebar-item.active svg {
      color: ${roleColors.border} !important;
    }
  `;

  return (
    <>
      <style>{sidebarStyle}</style>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="flex w-64 flex-col border-r border-gray-200 bg-white"
      >
        {/* Logo */}
        <div className="border-b border-gray-100 p-[16px]">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isProvider ? "bg-emerald-100" : isOrganizer ? "bg-amber-100" : "bg-violet-100"
            }`}>
              {isProvider ? (
                <Store className="text-emerald-600" size={22} />
              ) : isOrganizer ? (
                <CalendarClock className="text-amber-600" size={22} />
              ) : (
                <LayoutDashboard className="text-violet-600" size={22} />
              )}
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center font-nata-sans-eb text-xl tracking-wide">
                <span className={isProvider ? "text-emerald-600" : isOrganizer ? "text-amber-600" : "text-violet-600"}>
                  List
                </span>{" "}
                <span className={`bg-gradient-to-r ${
                  isProvider ? "from-emerald-600 to-teal-400" : isOrganizer ? "from-amber-600 to-yellow-400" : "from-violet-600 to-pink-400"
                } bg-clip-text text-transparent`}>
                  EMO
                </span>
              </div>
              <p className="font-nata-sans-md text-xs tracking-wide text-gray-400">
                {isProvider ? "Provider Suite" : isOrganizer ? "Organizer Suite" : "Client Suite"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {isProvider ? (
            <>
              <SectionTitle title="Overview" />
              {renderItems(providerOverviewItems)}
              <SectionTitle title="Management" />
              {renderItems(providerVenueManagementItems)}
              <SectionTitle title="Bookings" />
              {renderItems(providerBookingsItems)}
              <SectionTitle title="Media" />
              {renderItems(providerMediaItems)}

            </>
          ) : isOrganizer ? (
            <>
              <SectionTitle title="Overview" />
              {renderItems(organizerOverviewItems)}
              <SectionTitle title="Management" />
              {renderItems(organizerEventManagementItems)}
              <SectionTitle title="Attendees" />
              {renderItems(organizerAttendeeItems)}
            </>
          ) : (
            <>
              <SectionTitle title="Main Menu" />
              {renderItems(mainMenuItems)}
              <SectionTitle title="Management" />
              {renderItems(managementItems)}
              <SectionTitle title="Hosts" />
              {renderItems(hosts)}
            </>
          )}
        </nav>

        {/* User Profile */}
        <div className="relative border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 p-2">
            {/* Avatar */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${roleColors.avatarFrom} ${roleColors.avatarTo} font-nata-sans-bd text-white`}
            >
              {" "}
              {me?.full_name
                ? me.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "UM"}
            </div>

            {/* User Info */}
            <div className="flex-1 overflow-hidden">
              {isLoading ? (
                <>
                  <p className="truncate font-nata-sans-md text-sm text-gray-400">
                    username
                  </p>
                  <p className="font-nata-sans-rg text-xs text-gray-200">
                    role
                  </p>
                </>
              ) : (
                <>
                  <p className="truncate font-nata-sans-md text-sm text-gray-800">
                    {me?.full_name}
                  </p>
                  <p className="font-nata-sans-rg text-xs text-gray-400">
                    {me?.role}
                  </p>
                </>
              )}
            </div>

            {/* 3 dots menu */}
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-20 right-8 w-40 rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setOpenMenu(false);
                    // navigate("/account") ← لو عندك صفحة حساب
                  }}
                >
                  <User className="h-4 w-4" />
                  Account
                </button>

                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setOpenMenu(false);
                    logout();
                    toast.success("Logout successfully");
                    navigate("/", { replace: true });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <motion.div
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    className="px-3 py-3 font-nata-sans-md text-[11px] font-semibold uppercase tracking-widest text-gray-400"
  >
    {title}
  </motion.div>
);