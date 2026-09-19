import React from "react";
import { useOrganizerStats } from "../../../hooks/useOrganizerDashboard";
import { 
  Layers, 
  Users, 
  Ticket, 
  Archive, 
  Loader2 
} from "lucide-react";

export const Stats: React.FC = () => {
  const { data, isLoading, isError } = useOrganizerStats();

  const statsConfig = [
    {
      id: "totalEvents",
      label: "Total Events",
      value: data?.totalEvents ?? 0,
      icon: Layers,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badge: "Active",
      badgeClass: "bg-green-100 text-green-600",
    },
    {
      id: "totalRegistrations",
      label: "Total Registrations",
      value: data?.totalRegistrations ?? 0,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: `${data?.pendingRegistrations ?? 0} Pending`,
      badgeClass: "bg-amber-100 text-amber-700",
    },
    {
      id: "totalTickets",
      label: "Tickets Sold",
      value: data?.totalTickets ?? 0,
      icon: Ticket,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badge: null, 
      badgeClass: "bg-green-100 text-green-700",
    },
    {
      id: "archivedEvents",
      label: "Archived Events",
      value: data?.archivedEvents ?? 0,
      icon: Archive,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      badge: null,
      badgeClass: "",
    },
  ];

  if (isError) return <div className="p-4 text-red-500">Error loading stats.</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <div
          key={stat.id}
          className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md"
        >
          <div className="mb-4 flex items-center justify-between">
            {/* Icon Container */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} transition-transform group-hover:scale-110`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>

            {/* Badge */}
            {stat.badge && (
              <span className={`rounded-full px-2 py-1 font-nata-sans-md text-xs ${stat.badgeClass}`}>
                {isLoading ? "..." : stat.badge}
              </span>
            )}
          </div>

          {/* Content */}
          <div>
            <h3 className="font-nata-sans-bd text-3xl text-gray-800">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
              ) : (
                stat.value.toLocaleString() 
              )}
            </h3>
            <p className="mt-1 font-nata-sans-rg text-sm text-gray-500">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};