import React from "react";
import { useDashboardStats } from "../../../hooks/useClientDashboard";
import {
  CalendarCheck,
  Users,
  Star,
  Heart,
  Users as OrganizerIcon,
  Building as ProviderIcon,
} from "lucide-react";

export const Stats: React.FC = () => {

  const { data } = useDashboardStats();

  const stats = [
    {
      label: "Total Bookings",
      value: data ? data.totalBookings.toLocaleString() : "...",
      icon: CalendarCheck,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      label: "Registrations",
      value: data ? data.registrations.toLocaleString() : "...",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Venue Ratings",
      value: data ? data.venueRatings.toLocaleString() : "...",
      icon: Star,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Event Ratings",
      value: data ? data.eventRatings.toLocaleString() : "...",
      icon: Heart,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  const entityStats = [
    {
      label: "Event Organizers",
      value: data ? data.eventOrganizers.toLocaleString() : "...",
      icon: OrganizerIcon,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Venue Providers",
      value: data ? data.venueProviders.toLocaleString() : "...",
      icon: ProviderIcon,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const renderCard = (stat: (typeof stats)[0]) => {
    const Icon = stat.icon;
    return (
      <div
        key={stat.label}
        className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-nata-sans-md text-sm text-gray-500">
              {stat.label}
            </p>
            <p className="mt-1 font-nata-sans-bd text-3xl text-gray-800">
              {stat.value}
            </p>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} transition-transform group-hover:scale-110`}
          >
            <Icon className={`h-8 w-8 ${stat.iconColor}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* الصف العلوي - الكروت العامة */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(renderCard)}
      </div>

      {/* الصف الجديد - Event Organizers و Venue Providers */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2">
        {entityStats.map(renderCard)}
      </div>
    </div>
  );
};
