import React from "react";
import { motion } from "framer-motion";
import { Check, X, Ban, Building2 } from "lucide-react";

import type { Bookings } from "../../api/bookingsManage";
import { formatDate, formatTime12h } from "../../utils/dateFormat";
import { getInitials } from "../../utils/setAvatar";

/* =======================
   Props
======================= */

interface BookingRowProps {
  booking: Bookings;
  index: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}

/* =======================
   Helpers
======================= */

const statusStyles: Record<Bookings["status"], { bg: string; text: string }> = {
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  approved: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
  },
  canceled: {
    bg: "bg-gray-100",
    text: "text-gray-700",
  },
};

/* =======================
   Component
======================= */

export const BookingRow: React.FC<BookingRowProps> = ({
  booking,
  index,
  onAccept,
  onReject,
  onCancel,
}) => {
  const statusConfig = statusStyles[booking.status];

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-emerald-50/30"
    >
      {/* ---------- Booking ---------- */}
      <td className="whitespace-nowrap px-6 py-4 text-left">
        <div>
          <span className="font-nata-sans-md text-gray-800">
            #BK-{(index + 1).toString().padStart(4, "0")}
          </span>
          <p className="text-sm text-gray-500">Booking request</p>
        </div>
      </td>

      {/* ---------- Venue ---------- */}
      <td className="w-1/6 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <Building2 className="h-4 w-4 text-emerald-700" />
          </div>
          <span
            className="max-w-[10rem] truncate text-gray-600"
            title={booking.venue_name}
          >
            {booking.venue_name}
          </span>
        </div>
      </td>

      {/* ---------- Client ---------- */}
      <td className="px-2 py-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
            {getInitials(booking.booker_name)}
          </div>
          <div className="min-w-0">
            <span
              className="block max-w-[10rem] truncate font-nata-sans-md text-gray-800"
              title={booking.booker_name}
            >
              {booking.booker_name}
            </span>
            <p
              className="max-w-[10rem] truncate text-sm text-gray-500"
              title={booking.booker_email}
            >
              {booking.booker_email}
            </p>
          </div>
        </div>
      </td>

      {/* ---------- Date & Time ---------- */}
      <td className="w-1/2 py-4">
        <div>
          <span className="text-gray-800">{formatDate(booking.date)}</span>

          <p className="text-sm text-gray-500">
            {formatTime12h(booking.start_time)} – {formatTime12h(booking.end_time)}
          </p>
        </div>
      </td>

      {/* ---------- Notes ---------- */}
      <td className="w-1/4 px-6 py-4">
        <span
          className="block max-w-[10rem] truncate text-gray-700"
          title={booking.notes || "—"}
        >
          {booking.notes || "—"}
        </span>
      </td>

      {/* ---------- Status ---------- */}
      <td className="p-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 font-nata-sans-md text-xs ${statusConfig.bg} ${statusConfig.text}`}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </td>

      {/* ---------- Actions ---------- */}
      <td className="p-4">
        <div className="flex items-center justify-center">
          {booking.status === "pending" && (
            <>
              <button
                onClick={() => onAccept(booking.id)}
                title="Accept"
                className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
              >
                <Check className="h-4 w-4" />
              </button>

              <button
                onClick={() => onReject(booking.id)}
                title="Reject"
                className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                onClick={() => onCancel(booking.id)}
                title="Cancel"
                className="rounded-lg p-2 text-orange-600 transition hover:bg-orange-100"
              >
                <Ban className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {booking.status === "approved" && (
            <button
              onClick={() => onCancel(booking.id)}
              title="Cancel"
              className="rounded-lg p-2 text-orange-600 transition hover:bg-orange-100"
            >
              <Ban className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};
