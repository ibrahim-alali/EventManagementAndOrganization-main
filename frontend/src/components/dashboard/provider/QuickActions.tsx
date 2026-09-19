import React, { useState } from "react";
import { Plus, ClipboardList, Calendar } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ModalPortal } from "../../common/ModalPortal";
import { VenueForm } from "../../manageVenue/VenueForm";
import { Link } from "react-router-dom";

export const QuickActions: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 pb-8 shadow-sm">
      <h3 className="mb-4 font-nata-sans-bd text-lg text-gray-800">
        Quick Actions
      </h3>

      <div className="space-y-4">
        {/* ===== Add New Venue ===== */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-all hover:border-amber-400 hover:bg-amber-50/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 transition-colors group-hover:bg-amber-200">
            <Plus className="h-5 w-5 text-amber-600" />
          </div>
          <span className="font-nata-sans-md text-gray-600 transition-colors group-hover:text-amber-700">Add New Venue</span>
        </button>

        {/* ===== View Pending Bookings ===== */}
        <Link
          to="/provider/manage-bookings"
          className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-all hover:border-blue-400 hover:bg-blue-50/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-nata-sans-md text-gray-600 transition-colors group-hover:text-blue-700">
            View Pending Bookings
          </span>
        </Link>

        {/* ===== Open Calendar ===== */}
        <Link
          to="/provider/calendar"
          className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-all hover:border-green-400 hover:bg-green-50/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <span className="font-nata-sans-md text-gray-600 transition-colors group-hover:text-green-700">Open Calendar</span>
        </Link>
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
