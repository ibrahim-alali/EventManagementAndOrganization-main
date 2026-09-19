import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/* =======================
   Types
======================= */
import type { OrganizerRegistration as Registration } from "../../api/registrationsManage";
import { RegistrationRow } from "./RegistrationRow";

/* =======================
   Props
======================= */
interface RegistrationsTableProps {
  registrations: Registration[];
  isLoading?: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}

/* =======================
   Component
======================= */
export const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  registrations,
  isLoading,
  onAccept,
  onReject,
  onCancel,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      {/* ---------- Table ---------- */}
      <table className="w-full">
        {/* ---------- Head ---------- */}
        <thead className="bg-amber-50">
          <tr>
            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Registration
            </th>

            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Attendee
            </th>

            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Event
            </th>

            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Type
            </th>

            <th className="whitespace-nowrap px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Registration Date
            </th>

            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Status
            </th>

            <th className="px-6 py-4 font-nata-sans-bd text-xs uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        {/* ---------- Body ---------- */}
        <tbody className="divide-y divide-slate-100">
          {/* ---------- Loading ---------- */}
          {isLoading && (
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-60"
            >
              <td colSpan={10} className="py-16">
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-nata-sans-md text-sm">
                    Loading registrations...
                  </span>
                </div>
              </td>
            </motion.tr>
          )}

          {/* ---------- Empty ---------- */}
          {!isLoading && registrations.length === 0 && (
            <tr>
              <td colSpan={6} className="py-16 text-center">
                <p className="font-nata-sans-md text-sm text-slate-500">
                  No registrations found
                </p>
              </td>
            </tr>
          )}

          {/* ---------- Rows ---------- */}
          {!isLoading &&
            registrations.map((registration, index) => (
              <RegistrationRow
                key={registration.id}
                registration={registration}
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
