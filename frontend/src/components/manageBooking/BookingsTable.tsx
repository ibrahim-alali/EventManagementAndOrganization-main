import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import type { Bookings } from "../../api/bookingsManage";
import { BookingRow } from "./BookingRow";

/* =======================
   Props
======================= */

interface BookingsTableProps {
  bookings: Bookings[];
  isLoading?: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}

/* =======================
   Component
======================= */

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  isLoading,
  onAccept,
  onReject,
  onCancel,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {/* ---------- Table ---------- */}
      <table className="w-full">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Booking
            </th>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Venue
            </th>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Client
            </th>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Date & Time
            </th>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Notes
            </th>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-center">
          {/* ---------- Loading ---------- */}
            {isLoading && (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeIn", duration: 0.4 }}
                className="h-60 transition-colors duration-200 hover:bg-emerald-50/30"

              >
                <td colSpan={7} className="py-16">
                  <div className="flex items-center justify-center gap-2 text-emerald-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-nata-sans-md text-sm">
                      Loading bookings...
                    </span>
                  </div>
                </td>
              </motion.tr>
            )}

          {/* ---------- Empty ---------- */}
          {!isLoading && bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="py-16 text-center">
                <p className="font-nata-sans-md text-sm text-gray-500">
                  No bookings found
                </p>
              </td>
            </tr>
          )}

          {/* ---------- Rows ---------- */}
            {!isLoading &&
              bookings.map((booking, index) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  index={index}
                  onAccept={onAccept}
                  onReject={onReject}
                  onCancel={onCancel}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
};
