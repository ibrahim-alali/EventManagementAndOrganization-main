import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronRight,
  Users,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

import { useDeleteRegistration } from "../../hooks/useRegistrations";
import type { Registration } from "../../api/registrations";

import { RegistrationForm } from "./RegistrationForm";
import { ModalPortal } from "../common/ModalPortal";

/* ================= Props ================= */

interface RegistrationCardProps {
  registration: Registration;
  onSelect?: (id: string) => void;
}

/* ================= Status styles ================= */

const statusStyles: Record<
  Registration["status"],
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

export const RegistrationCard: React.FC<RegistrationCardProps> = ({
  registration,
  onSelect,
}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const deleteMutation = useDeleteRegistration();

  const { event, event_data, status } = registration;

  const attendanceRatio =
      event_data.capacity > 0
          ? event_data.attendance_count / event_data.capacity
          : 0;

  const attendancePercent = Math.min(attendanceRatio * 100, 100);

  const attendanceColor =
      attendanceRatio >= 1
          ? "bg-red-500"
          : attendanceRatio >= 0.7
              ? "bg-amber-500"
              : "bg-[#5a2ea6]";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col justify-between
                 rounded-2xl border border-gray-100
                 bg-white p-5 shadow-sm hover:shadow-md"
    >
      {/* ===== Top Section ===== */}
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {event_data.title}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 font-nata-sans-md text-xs
                        ${statusStyles[status].className}`}
          >
            {statusStyles[status].label}
          </span>

        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-500">
          {event_data.description}
        </p>

        {/* Event Type */}
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="capitalize">{event_data.type}</span>
        </div>

        {/* ===== Date & Time ===== */}
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{event_data.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>
              {event_data.start_time} – {event_data.end_time}
            </span>
          </div>
        </div>

        {/* ===== Attendance ===== */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            Attendance
          </span>

            <span className="font-nata-sans-md text-gray-800">
              {event_data.attendance_count} / {event_data.capacity}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-purple-100">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendancePercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`h-full rounded-full ${attendanceColor}`}
            />
          </div>
        </div>
      </div>

      {/* ===== Actions ===== */}
      <div className="mt-2 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenEdit(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            title="Edit registration"
          >
            <Edit className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenDelete(true)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            title="Delete registration"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ x: 3 }}
          onClick={() => onSelect?.(event)}
          className="text-primary flex items-center gap-1
                     text-sm font-medium"
        >
          View event
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* ===== Delete Modal ===== */}
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
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Delete registration
                </h3>

                <p className="mb-6 text-sm text-gray-500">
                  Are you sure you want to delete this registration? This action
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
                      deleteMutation.mutate(registration.id, {
                        onSuccess: () => {
                          toast.success("Registration deleted successfully");
                          setOpenDelete(false);
                        },
                        onError: () => {
                          toast.error("Failed to delete registration");
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

      {/* ===== Edit Modal ===== */}
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
                <h3 className="mb-4 text-lg font-semibold">
                  Edit Registration
                </h3>

                <RegistrationForm
                  registration={registration}
                  eventId={event}
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
