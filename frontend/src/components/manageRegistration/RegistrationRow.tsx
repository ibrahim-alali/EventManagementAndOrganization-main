import React from "react";
import { motion } from "framer-motion";
import { Check, X, Ban, CalendarDays, Tag } from "lucide-react";

/* =======================
   Types
======================= */
import type { OrganizerRegistration as Registration } from "../../api/registrationsManage";
import { getInitials } from "../../utils/setAvatar";

/* =======================
   Props
======================= */
interface RegistrationRowProps {
  registration: Registration;
  index: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}

/* =======================
   Helpers
======================= */

const statusStyles: Record<Registration["status"], { bg: string; text: string }> = {
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  approved: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  rejected: {
    bg: "bg-rose-100",
    text: "text-rose-700",
  },
  canceled: {
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
};

/* =======================
   Component
======================= */
export const RegistrationRow: React.FC<RegistrationRowProps> = ({
  registration,
  index,
  onAccept,
  onReject,
  onCancel,
}) => {
  const statusConfig = statusStyles[registration.status];

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="transition-colors hover:bg-amber-50/40"
    >
      {/* ---------- Registration ---------- */}
      <td className="px-6 py-4">
        <div>
          <span className="font-nata-sans-md text-gray-800">
            #RG-{(index + 1).toString().padStart(4, "0")}
          </span>
          <p className="text-sm text-gray-500">RG request</p>
        </div>
      </td>

      {/* ---------- Attendee ---------- */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
            {getInitials(registration.attendee.full_name)}
          </div>

          <div>
            <p className="font-nata-sans-md text-slate-800">{registration.attendee.full_name}</p>
            <p className="text-sm text-slate-500">{registration.attendee.email}</p>
          </div>
        </div>
      </td>

      {/* ---------- Event ---------- */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <CalendarDays className="h-4 w-4 text-amber-600" />
          </div>
          <span className="text-slate-700">{registration.event_data.title}</span>
        </div>
      </td>

      {/* ---------- Event Type ---------- */}
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-nata-sans-md text-xs text-slate-700">
          <Tag className="h-3.5 w-3.5 text-slate-500" />
          {registration.event_data.type}
        </span>
      </td>

      {/* ---------- Registration Date ---------- */}
      <td className="px-6 py-4 text-center">
        <span className="text-slate-700">
          {new Date(registration.created_at).toLocaleDateString()}
        </span>
      </td>

      {/* ---------- Status ---------- */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 font-nata-sans-md text-xs ${statusConfig.bg} ${statusConfig.text}`}
        >
          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
        </span>
      </td>

      {/* ---------- Actions ---------- */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-center">
          {registration.status === "pending" && (
            <>
              <button
                onClick={() => onAccept(registration.id)}
                title="Accept"
                className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
              >
                <Check className="h-4 w-4" />
              </button>

              <button
                onClick={() => onReject(registration.id)}
                title="Reject"
                className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                onClick={() => onCancel(registration.id)}
                title="Cancel"
                className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-100"
              >
                <Ban className="h-4 w-4" />
              </button>
            </>
          )}

          {registration.status === "approved" && (
            <button
              onClick={() => onCancel(registration.id)}
              title="Cancel"
              className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-100"
            >
              <Ban className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};
