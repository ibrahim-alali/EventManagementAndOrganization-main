import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { useVenuesQuery, useDeleteVenue } from "../../hooks/useVenuesManage";
import type { Venue } from "../../api/venuesManage";

import { VenuesFilter } from "../../components/manageVenue/VenuesFilter";
import { VenuesTable } from "../../components/manageVenue/VenuesTable";
import { VenueForm } from "../../components/manageVenue/VenueForm";
import { ModalPortal } from "../../components/common/ModalPortal";

/* =======================
   Types
======================= */

export interface VenuesFilterState {
  search?: string;
  ordering?: string;
}

/* =======================
   Component
======================= */

export const VenuesManage: React.FC = () => {
  /* -------- State -------- */
  const [filter, setFilter] = useState<VenuesFilterState>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

  /* -------- Queries -------- */
  const { data: venues, isLoading, isError } = useVenuesQuery(filter);

  const deleteVenueMutation = useDeleteVenue();

  /* -------- Handlers -------- */
  const handleDeleteConfirm = () => {
    if (!venueToDelete) return;

    deleteVenueMutation.mutate(venueToDelete.id, {
      onSuccess: () => {
        toast.success("Venue deleted successfully");
        setVenueToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete venue");
      },
    });
  };

  /* =======================
       Render
    ======================= */

  return (
    <motion.div
      className="px-6 py-4 font-nata-sans-rg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ---------- Header ---------- */}
      <motion.div
        className="mb-4 flex items-center justify-between"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Building />
             Venues Management
          </h1>
          <p className="pt-1 text-sm text-gray-500">
            Manage and control your venues
          </p>
        </div>

        <motion.button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-nata-sans-md text-white transition hover:bg-emerald-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
          Add Venue
        </motion.button>
      </motion.div>

      {/* ---------- Filters ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <VenuesFilter value={filter} onChange={setFilter} />
      </motion.div>

      {/* ---------- Table ---------- */}
      <motion.div
        key={filter.search + "-" + filter.ordering}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <VenuesTable
          venues={venues ?? []}
          isLoading={isLoading}
          isError={isError}
          onDelete={(venue) => setVenueToDelete(venue)}
        />
      </motion.div>

      {/* =======================
                Create Venue Modal
             ======================= */}
      <AnimatePresence>
        {isCreateOpen && (
          <ModalPortal>
            <VenueForm mode="create" onClose={() => setIsCreateOpen(false)} />
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* =======================
          Delete Confirmation Modal
         ======================= */}
      <AnimatePresence>
        {venueToDelete && (
          <ModalPortal>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md rounded-2xl bg-white p-6"
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <h3 className="mb-2 font-nata-sans-bd text-lg">Delete Venue</h3>
                <p className="mb-6 font-nata-sans-rg text-sm text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-nata-sans-md">
                    {venueToDelete.name}
                  </span>
                  ?
                </p>

                <div className="flex justify-end gap-3 font-nata-sans-md text-sm">
                  <motion.button
                      onClick={() => setVenueToDelete(null)}
                      className="rounded-lg border px-4 py-2 text-gray-600"
                      whileHover={{backgroundColor: "#f3f4f6"}}
                      whileTap={{scale: 0.98}}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                      onClick={handleDeleteConfirm}
                      disabled={deleteVenueMutation.isPending}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                      whileHover={{backgroundColor: "#dc2626"}}
                      whileTap={{scale: 0.98}}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
