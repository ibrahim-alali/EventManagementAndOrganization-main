import React from "react";
import { Loader } from "../../common/Loader";
import { useRecentActivity } from "../../../hooks/useClientDashboard";
import type { RecentActivityItem } from "../../../api/clientDashboard";
import {
  CalendarCheck,
  UserPlus,
  Star,
  Heart,
  Award,
  Trophy,
} from "lucide-react";

export const RecentActivity: React.FC = () => {
  const { data, isLoading } = useRecentActivity();

  if (isLoading) {
    return <Loader text={"Loading activity..."} />;
  }

  const activityIconMap = {
    booking: {
      icon: CalendarCheck,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    registration: {
      icon: UserPlus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    venue_rating: {
      icon: Star,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    event_rating: {
      icon: Heart,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    provider_rating: {
      icon: Award,
      iconBg: "bg-yellow-100",
      iconColor: "text-emerald-600",
    },
    organizer_rating: {
      icon: Trophy,
      iconBg: "bg-yellow-100",
      iconColor: "text-orange-600",
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 font-nata-sans-bd text-lg text-gray-800">
        Recent Activity
      </h3>

      <ul className="space-y-4">
        {data?.map((activity: RecentActivityItem) => {
          const config = activityIconMap[activity.type];
          const Icon = config.icon;

          return (
            <li
              key={activity.id}
              className="flex items-start gap-4 rounded-xl p-2 transition-all duration-200 hover:bg-gray-50"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
              </div>

              <div className="flex-1">
                <p className="font-nata-sans-md text-gray-800">
                  {activity.title}
                </p>
                <p className="font-nata-sans-rg text-sm text-gray-500">
                  {activity.description}
                </p>
              </div>

              <span className="whitespace-nowrap font-nata-sans-rg text-xs text-gray-400">
                {activity.time}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
