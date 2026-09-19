import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import type { Booking } from "../../../../api/bookings";
import { useMyBookingsQuery } from "../../../../hooks/useEventsManage";

interface StepSelectBookingProps {
  selectedBooking: Booking | null;
  setSelectedBooking: (booking: Booking) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepSelectBooking: React.FC<StepSelectBookingProps> = ({
  selectedBooking,
  setSelectedBooking,
  onNext,
  onBack,
}) => {
  const [search, setSearch] = useState("");
  const { data: bookings, isLoading } = useMyBookingsQuery({ search });

  const handleNext = () => {
    if (!selectedBooking) {
      toast.error("Please select a booking first");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by venue, city or date..."
          className="
            w-full rounded-xl border border-gray-300 py-2 pl-10 pr-3
            font-nata-sans-rg
            focus:outline-none focus:ring-1 focus:ring-amber-500
          "
        />
      </div>

      {/* List */}
      <div className="flex max-h-[46vh] flex-col gap-3 overflow-y-auto pr-1">
        {isLoading && (
          <p className="text-center font-nata-sans-md text-gray-500">
            Loading bookings...
          </p>
        )}

        {!isLoading && bookings?.length === 0 && (
          <p className="text-center font-nata-sans-md text-gray-500">
            No bookings found
          </p>
        )}

        {bookings?.map((booking) => {
          const isSelected = selectedBooking?.id === booking.id;

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedBooking(booking)}
              className={`
                cursor-pointer rounded-xl border p-4 transition-all duration-200 ease-in
                ${
                  isSelected
                    ? "border-amber-500 bg-amber-50/50"
                    : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm"
                }
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-nata-sans-bd text-gray-800">
                    {booking.venue.name}
                  </p>
                  <p className="line-clamp-2 font-nata-sans-rg text-sm text-gray-600">
                    {booking.venue.description}
                  </p>
                </div>

                <span
                  className={`
                    shrink-0 rounded-full px-2 py-1 font-nata-sans-bd text-xs capitalize
                    ${
                      booking.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {booking.status}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {booking.date}
                </div>

                {booking.venue.capacity && (
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    {booking.venue.capacity} seats
                  </div>
                )}

                {booking.venue.location_geo && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {booking.venue.location_geo.city},{" "}
                    {booking.venue.location_geo.area}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>


      {/* ================= Actions ================= */}
      <div className="mt-6 flex justify-end gap-3">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="
            rounded-lg border border-gray-300
            px-6 py-2 font-nata-sans-md text-gray-700
            transition hover:bg-gray-100
          "
        >
          Back
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          className="
            rounded-lg bg-amber-500 px-6 py-2
            font-nata-sans-bd text-white
            transition hover:bg-amber-600
          "
        >
          Next
        </button>
      </div>
    </div>
  );
};
