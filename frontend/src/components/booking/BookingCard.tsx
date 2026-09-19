import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronRight,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import { useDeleteBooking } from "../../hooks/useBookings";
import type { Booking } from "../../api/bookings";

import { BookingForm } from "./BookingForm";
import { ModalPortal } from "../common/ModalPortal";

/* ================= Props ================= */

interface BookingCardProps {
  booking: Booking;
  onSelect?: (id: string) => void;
}

/* ================= Status styles ================= */

const statusStyles: Record<
  Booking["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
  canceled: {
    label: "Canceled",
    className: "bg-red-100 text-red-700",
  },
};

/* ================= Component ================= */

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onSelect,
}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const deleteMutation = useDeleteBooking();

  const { venue, date, start_time, end_time, notes, status } = booking;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col justify-between
                 rounded-2xl border
                 border-gray-100 bg-white
                 p-5 shadow-sm hover:shadow-md"
    >
      {/* ===== Top Section ===== */}
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {venue.name}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 font-nata-sans-md text-xs
                        ${statusStyles[status].className}`}
          >
            {statusStyles[status].label}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-500">
          {venue.description}
        </p>

        {/* ===== Date & Time ===== */}
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>
              {start_time} – {end_time}
            </span>
          </div>
        </div>

        {/* ===== Notes ===== */}
        {notes && (
          <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
            <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <p className="line-clamp-2" title={notes}>
              {notes}
            </p>
          </div>
        )}
      </div>

      {/* ===== Actions ===== */}
      <div className="mt-2 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenEdit(true)}
            className="rounded-lg p-2
                       text-gray-500 hover:bg-gray-100"
            title="Edit booking"
          >
            <Edit className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenDelete(true)}
            className="rounded-lg p-2
                       text-red-500 hover:bg-red-50"
            title="Delete booking"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ x: 3 }}
          onClick={() => onSelect?.(venue.id)}
          className="text-primary flex items-center
                     gap-1 text-sm font-medium"
        >
          View more
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {openDelete && (
          <ModalPortal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenDelete(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              >
                <h3 className="mb-2 font-nata-sans-md text-lg text-gray-900">
                  Delete booking
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  Are you sure you want to delete this booking? This action
                  cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setOpenDelete(false)}
                    className="rounded-xl border px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      deleteMutation.mutate(booking.id, {
                        onSuccess: () => {
                          toast.success("Booking deleted successfully");
                          setOpenDelete(false);
                        },
                        onError: () => {
                          toast.error("Failed to delete booking");
                        },
                      });
                    }}
                    className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {openEdit && (
          <ModalPortal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenEdit(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              >
                <h3 className="mb-4 text-lg font-semibold">Edit Booking</h3>

                <BookingForm
                  booking={booking}
                  venueId={venue.id}
                  onClose={() => setOpenEdit(false)}
                />
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
