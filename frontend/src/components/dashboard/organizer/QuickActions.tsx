import React from "react";
import { Plus, Ticket, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionsProp {
  onOpen: () => void;
}

export const QuickActions: React.FC<QuickActionsProp> = ({ onOpen }) => {

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 pb-8 shadow-sm">
      <h3 className="mb-4 font-nata-sans-bd text-lg text-gray-800">
        Quick Actions
      </h3>

      <div className="space-y-4">
        {/* ===== Create New Event ===== */}
        <button
          onClick={onOpen}
          className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-all hover:border-amber-400 hover:bg-amber-50/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 transition-colors group-hover:bg-amber-200">
            <Plus className="h-5 w-5 text-amber-600" />
          </div>
          <span className="font-nata-sans-md text-gray-600 transition-colors group-hover:text-amber-700">
            Create New Event
          </span>
        </button>

        {/* ===== Create Ticket Type ===== */}
        <Link
          to="/organizer/venues"
          className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-all hover:border-emerald-400 hover:bg-emerald-50/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 transition-colors group-hover:bg-emerald-200">
            <Calendar className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="font-nata-sans-md text-gray-600 transition-colors group-hover:text-emerald-700">
            Create New Booking
          </span>
        </Link>

        {/* ===== Send Invitations ===== */}
        <Link
          to="/organizer/invitations"
          className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-3 transition-all hover:border-blue-400 hover:bg-blue-50/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-nata-sans-md text-gray-600 transition-colors group-hover:text-blue-700">
            Send Invitations
          </span>
        </Link>
      </div>
    </div>
  );
};
