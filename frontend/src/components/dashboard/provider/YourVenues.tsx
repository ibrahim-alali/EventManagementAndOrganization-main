import React, { useState } from "react";
import { useProviderVenues } from "../../../hooks/useProviderDashboard";
import { Store, Plus, MapPin, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ModalPortal } from "../../common/ModalPortal";
import { VenueForm } from "../../manageVenue/VenueForm";

export const YourVenues: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data = [], isLoading } = useProviderVenues();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-nata-sans-bd text-lg text-gray-800">Your Venues</h3>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1 font-nata-sans-md text-sm text-emerald-600 transition-colors hover:text-emerald-800"
        >
          <Plus className="h-4 w-4" />
          Add Venue
        </button>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Venue Card */}
        {isLoading ? (
          <div className="h-50 col-span-full flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span className="font-nata-sans-md text-sm">Loading...</span>
          </div>
        ) : data.length > 0 ? (
          data.slice(0, 5).map((venue) => (
            <div
              key={venue.id}
              className="rounded-xl border border-gray-100 p-6 transition-all hover:border-emerald-200 hover:bg-emerald-50/30"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <Store className="h-6 w-6 text-emerald-600" />
                </div>

                <span className="rounded-full bg-emerald-100 px-2 py-1 font-nata-sans-md text-xs text-emerald-600">
                  {venue.status === "active" ? "Active" : "Archived"}
                </span>
              </div>

              <h4 className="mb-1 font-nata-sans-md text-gray-800">
                {venue.name}
              </h4>

              <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {venue.location_geo.city}, {venue.location_geo.area}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-nata-sans-rg text-gray-500">
                  {venue.bookingsCount} bookings
                </span>
                <span className="font-nata-sans-md text-emerald-600">
                  ${venue.price_per_hour} / hr
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12">
            <Store className="mb-2 h-6 w-6 text-gray-300" />
            <p className="font-nata-sans-md text-sm text-gray-500">
              No venues available
            </p>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="mt-3 text-xs text-emerald-600 underline"
            >
              Start by Add one
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <ModalPortal>
            <VenueForm mode="create" onClose={() => setIsCreateOpen(false)} />
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
};
