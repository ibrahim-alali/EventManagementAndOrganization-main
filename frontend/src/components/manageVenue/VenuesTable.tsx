import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VenueRow } from "./VenueRow.tsx";
import type { Venue } from "../../api/venuesManage";
import { Loader } from "../common/Loader";

/* =======================
   Props
======================= */

interface VenuesTableProps {
  venues: Venue[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (venue: Venue) => void;
}

/* =======================
   Component
======================= */

export const VenuesTable: React.FC<VenuesTableProps> = ({
  venues,
  isLoading,
  isError,
  onDelete,
}) => {
  /* ---------- Loading ---------- */
  if (isLoading) {
    return <Loader text={"Loading venues..."} />;
  }

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <div className="rounded-2xl border bg-white p-6 font-nata-sans-rg">
        <p className="text-sm text-red-500">Failed to load venues.</p>
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!venues.length) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border bg-white p-10 font-nata-sans-rg">
        <p className="text-gray-500">No venues found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <table className="w-full">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Venue
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Location
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Capacity
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Price / Hour
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Ratings
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-center">
          <AnimatePresence>
            {venues.map((venue) => (
              <motion.tr
                key={venue.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="transition-colors duration-200 hover:bg-emerald-50/30"
              >
                <VenueRow venue={venue} onDelete={() => onDelete(venue)} />
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
