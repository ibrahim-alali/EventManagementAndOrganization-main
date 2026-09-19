import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VenueArchiveRow } from "./VenueArchiveRow";
import type { Venue } from "../../api/venuesManage";
import { Loader } from "../common/Loader";

/* =======================
   Props
======================= */

interface VenuesArchiveTableProps {
  venues: Venue[];
  isLoading: boolean;
  isError: boolean;
}

/* =======================
   Component
======================= */

export const VenuesArchiveTable: React.FC<VenuesArchiveTableProps> = ({
  venues,
  isLoading,
  isError,
}) => {
  /* ---------- Loading ---------- */
  if (isLoading) {
    return <Loader text={"Loading venues..."} />;
  }

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <div className="rounded-2xl border bg-white p-6 font-nata-sans-rg">
        <p className="text-sm text-red-500">Failed to load archive.</p>
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!venues.length) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border bg-white p-10 font-nata-sans-rg">
        <p className="text-gray-500">No archived venues.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <table className="w-full">
        <thead className="bg-gray-100">
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
              Status
            </th>
            <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
              Archived Date
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
                className="transition-colors duration-200 hover:bg-gray-50"
              >
                <VenueArchiveRow venue={venue} />
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
