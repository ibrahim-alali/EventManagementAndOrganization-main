import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {Edit, Archive, Trash2, Building2} from "lucide-react";
import { toast } from "react-hot-toast";

import type { Venue } from "../../api/venuesManage";
import {
  useArchiveVenue,
} from "../../hooks/useVenuesManage";

import { VenueForm } from "./VenueForm";
import { StarRating } from "../rating/StarRating";
import { ModalPortal } from "../common/ModalPortal";

/* =======================
   Props
======================= */

interface VenueRowProps {
  venue: Venue;
  onDelete: () => void;
}

/* =======================
   Component
======================= */

export const VenueRow: React.FC<VenueRowProps> = ({ venue, onDelete }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const archiveVenue = useArchiveVenue();

  /* ---------- Handlers ---------- */

  const handleArchiveToggle = () => {
    const action = archiveVenue.mutate;

    action(venue.id, {
      onSuccess: () => {
        toast.success(
          "Venue archived"
        );
      },
      onError: () => {
        toast.error("Operation failed");
      },
    });
  };

  /* =======================
       Render
    ======================= */

  return (
    <>
      {/* ---------- Row ---------- */}
      <td className="px-6 py-4 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <Building2 className="text-emerald-700" />
          </div>

          <div>
            <p className="font-nata-sans-md text-gray-800">{venue.name}</p>
            <p className="text-sm text-gray-500">
              {venue.description?.slice(0, 30) ?? ""}…
            </p>
          </div>
        </div>
      </td>

      <td className="max-w-8 px-6 py-4 text-gray-600">
        {venue.location_geo.city}, {venue.location_geo.area}
      </td>

      <td className="px-6 py-4 text-gray-600">{venue.capacity} guests</td>

      <td className="px-6 py-4 text-gray-600">${venue.price_per_hour}</td>

      <td className="mt-8 flex justify-center text-gray-600">
        <StarRating rating={venue.average_rating.average_rating} size={12} />
      </td>

      <td className="px-6 py-4">
        <span
          className="rounded-full bg-green-100 px-3 py-1 font-nata-sans-bd text-xs text-green-700"           
        >
          {venue.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          {/* Edit */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"
            title="Edit"
          >
            <Edit size={16} />
          </button>

          {/* Archive */}
          <button
            onClick={handleArchiveToggle}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
            title="Archive"
          >
              <Archive size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>

      {/* =======================
                  Edit Modal
              ======================= */}
      <AnimatePresence>
        {isEditOpen && (
          <ModalPortal>
            <VenueForm
              mode="edit"
              venue={venue}
              onClose={() => setIsEditOpen(false)}
            />
          </ModalPortal>
        )}
      </AnimatePresence>
    </>
  );
};
