import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users, Loader2 } from "lucide-react";
import { useOrganizerRecentRegistrations } from "../../../hooks/useOrganizerDashboard";
import { getInitials } from "../../../utils/setAvatar";

export const RecentRegistrationsRequests: React.FC = () => {
  const { data = [], isLoading } = useOrganizerRecentRegistrations();

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-nata-sans-bd text-lg text-gray-800">
          Recent Registrations
        </h3>

        <Link
          to="/organizer/manage-registrations"
          className="flex items-center gap-1 font-nata-sans-md text-sm text-amber-600 transition-colors hover:text-amber-800"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center py-12 text-gray-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-amber-500" />
            <span className="font-nata-sans-md text-sm">
              Loading registrations...
            </span>
          </div>
        ) : data.length > 0 ? (
          data.map((reg) => (
            <div
              key={reg.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {/* Avatar with Initials */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-nata-sans-bd text-xs text-amber-700">
                  {getInitials(reg.clientName)}
                </div>

                <div className="space-y-1">
                  <p className="font-nata-sans-md text-sm text-gray-800">
                    {reg.clientName}
                  </p>
                  <p className="font-nata-sans-rg text-xs text-gray-400">
                    <span className="text-amber-500">{reg.eventTitle}</span> • Requested on {" "}{" "}
                    {new Date(reg.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`rounded-full px-2 py-1 font-nata-sans-md text-[10px] uppercase ${getStatusStyles(
                  reg.status
                )}`}
              >
                {reg.status}
              </span>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center">
            <Users className="mb-2 h-8 w-8 text-gray-300" />
            <p className="font-nata-sans-md text-sm text-gray-500">
              No recent registrations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
