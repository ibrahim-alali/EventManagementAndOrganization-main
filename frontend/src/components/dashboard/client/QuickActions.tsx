import React, { act } from "react";
import {
  PlusCircle,
  UserPlus,
  Star,
  Heart,
  Building2,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

type Action = {
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  hoverBg: string;
  hoverText: string;
  path: string;
};

export const QuickActions: React.FC = () => {
  const actions: Action[] = [
    {
      label: "New Registration",
      description: "Add a new event registration",
      icon: UserPlus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      hoverBorder: "group hover:border-blue-300",
      hoverBg: "group hover:bg-blue-50/30",
      hoverText: "group-hover:text-blue-700",
      path: "/client/events",
    },
    {
      label: "Rate Event",
      description: "Submit an event rating",
      icon: Heart,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      hoverBorder: "group hover:border-pink-300",
      hoverBg: "group hover:bg-pink-50/30",
      hoverText: "group-hover:text-pink-700",
      path: "/client/event-ratings",
    },
    {
      label: "Venue Providers",
      description: "Browse all venue providers",
      icon: Building2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      hoverBorder: "group hover:border-emerald-300",
      hoverBg: "group hover:bg-emerald-50/30",
      hoverText: "group-hover:text-emerald-700",
      path: "/client/providers",
    },
    {
      label: "New Booking",
      description: "Create a new venue booking",
      icon: PlusCircle,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      hoverBorder: "group hover:border-violet-300",
      hoverBg: "group hover:bg-violet-50/30",
      hoverText: "group-hover:text-violet-700",
      path: "/client/venues",
    },
    {
      label: "Rate Venue",
      description: "Submit a venue rating",
      icon: Star,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      hoverBorder: "group hover:border-yellow-300",
      hoverBg: "group hover:bg-yellow-50/30",
      hoverText: "group-hover:text-yellow-700",
      path: "/client/venue-ratings",
    },
    {
      label: "Event Organizers",
      description: "Browse event organizers",
      icon: CalendarDays,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      hoverBorder: "group hover:border-indigo-300",
      hoverBg: "group hover:bg-indigo-50/30",
      hoverText: "group-hover:text-indigo-700",
      path: "/client/organizers",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-nata-sans-bd text-lg text-gray-800">
        Quick Actions
      </h3>

      <div
        className="grid gap-4
                   [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]"
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.path}
              className={`
                group flex items-center justify-center gap-4 rounded-xl
                border-2 border-dashed border-gray-200 p-6 text-left
                transition-all duration-200
                hover:shadow-sm
                ${action.hoverBg}
                ${action.hoverBorder}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex h-12 w-12 items-center justify-center rounded-lg
                  transition-transform duration-200
                  ${action.iconBg}
                  group-hover:scale-105
                `}
              >
                <Icon className={`h-8 w-12 ${action.iconColor}`} />
              </div>

              {/* Text */}
              <div>
                <p className={`font-nata-sans-md text-gray-800 transition-colors ${action.hoverText}`}>
                  {action.label}
                </p>
                <p className="whitespace-nowrap font-nata-sans-rg text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
