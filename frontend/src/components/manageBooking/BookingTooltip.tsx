import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, MapPin, User } from "lucide-react";

import type { Bookings } from "../../api/bookingsManage";

interface BookingTooltipProps {
  booking: Bookings | null;
  position: { x: number; y: number };
}

export const BookingTooltip: React.FC<BookingTooltipProps> = ({ booking, position }) => {
  return (
    <AnimatePresence>
      {booking && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            top: position.y + 12,
            left: position.x + 12,
          }}
          className="fixed z-50 w-72 rounded-xl border border-emerald-100 bg-white p-4 shadow-xl"
        >
          <h4 className="mb-3 font-nata-sans-bd text-sm text-emerald-700">Booking Details</h4>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" />
              <span className="font-nata-sans-md">{booking.venue_name}</span>
            </div>

            <div className="flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              <span>{booking.booker_name}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarClock size={16} className="text-emerald-500" />
              <span>
                {booking.start_time} – {booking.end_time}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
