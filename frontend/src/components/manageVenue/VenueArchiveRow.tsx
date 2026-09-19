import React from "react";
import {ArchiveRestore, Building2} from "lucide-react";
import { toast } from "react-hot-toast";

import type { Venue } from "../../api/venuesManage";
import { useUnArchiveVenue } from "../../hooks/useVenuesManage";

/* =======================
   Props
======================= */

interface VenueRowArchiveProps {
  venue: Venue;
}

/* =======================
   Component
======================= */

export const VenueArchiveRow: React.FC<VenueRowArchiveProps> = ({ venue }) => {
  const unArchiveVenue = useUnArchiveVenue();

  /* ---------- Handlers ---------- */

  const handleArchiveToggle = () => {
    const action = unArchiveVenue.mutate;

    action(venue.id, {
      onSuccess: () => {
        toast.success("Venue restored");
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Building2 className="text-gray-700" />
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

      <td className="px-6 py-4">
        <span className="rounded-full bg-gray-200 px-3 py-1 font-nata-sans-bd text-xs text-gray-600">
          {venue.status}
        </span>
      </td>

      <td className="px-6 py-4 text-gray-600">{venue.last_time_archived}</td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          {/* Archive / Restore */}
          <button
            onClick={handleArchiveToggle}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
            title="Restore"
          >
            <ArchiveRestore size={16} />
          </button>
        </div>
      </td>
    </>
  );
};
