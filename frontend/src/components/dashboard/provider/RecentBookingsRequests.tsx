import React from "react";
import { useRecentBookingRequests } from "../../../hooks/useProviderDashboard";
import { ChevronRight, CalendarDays, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const RecentBookingsRequests: React.FC = () => {
  const { data = [], isLoading } = useRecentBookingRequests();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-nata-sans-bd text-lg text-gray-800">
          Recent Booking Requests
        </h3>

        <Link
          to="/provider/manage-bookings"
          className="flex items-center gap-1 font-nata-sans-md text-sm text-emerald-600  transition-colors hover:text-emerald-800"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center py-12 text-gray-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span className="font-nata-sans-md text-sm">Loading...</span>
          </div>
        ) : data?.length > 0 ? (
          data?.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    booking.status === "pending"
                      ? `bg-gray-100`
                      : booking.status === "approved"
                      ? `bg-green-100`
                      : `bg-red-100`
                  }`}
                >
                  <CalendarDays
                    className={`h-5 w-5 ${
                      booking.status === "pending"
                        ? `text-gray-600`
                        : booking.status === "approved"
                        ? `text-green-600`
                        : `text-red-600`
                    }`}
                  />
                </div>

                <div>
                  <p className="font-nata-sans-md text-sm text-gray-800">
                    {booking.venueName}
                  </p>
                  <p className="font-nata-sans-rg text-xs text-gray-400">
                    Requested for{" "}
                    {new Date(booking.requestedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full ${
                  booking.status === "pending"
                    ? `bg-gray-100 text-gray-600`
                    : booking.status === "approved"
                    ? `bg-green-100 text-green-600`
                    : `bg-red-100 text-red-600`
                } px-2 py-1 font-nata-sans-md text-[10px] uppercase`}
              >
                {booking.status}
              </span>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center">
            <CalendarDays className="mb-2 h-6 w-6 text-gray-300" />
            <p className="font-nata-sans-md text-sm text-gray-500">
              No recent booking requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
