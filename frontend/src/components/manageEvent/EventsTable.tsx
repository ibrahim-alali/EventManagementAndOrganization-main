import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { EventRow } from "./EventRow";

import type { Event } from "../../api/eventsManage";

import { Loader } from "../common/Loader";
import { EventForm } from "./eventForm/EventForm";

/* =======================
   Props
======================= */

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (event: Event) => void;
}

/* =======================
   Component
======================= */

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading,
  isError,
  onDelete,
}) => {
  useEffect(() => {
    const hintShown = sessionStorage.getItem("venue-hover-hint");

    if (hintShown === null) {
      setTimeout(() => {
        toast.custom(
          (t) => (
            <div
              className={`
                ${t.visible ? "animate-enter" : "animate-leave"}
                flex items-center gap-2 rounded-xl
                border border-amber-200 bg-amber-50 px-4
                py-3 shadow-lg
              `}
            >
              <Info size={16} className="text-amber-600" />
              <span className="font-nata-sans-rg text-sm">
                Hover on <b>venue name</b> to see more details
              </span>
            </div>
          ),
          {
            duration: 5000,
            position: "bottom-right",
          }
        );
      }, 2000);

      sessionStorage.setItem("venue-hover-hint", "shown");
    }
  }, [isLoading]);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  /* ---------- Loading ---------- */
  if (isLoading) {
    return <Loader text="Loading events..." />;
  }

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <div className="rounded-2xl border bg-white p-6 font-nata-sans-rg">
        <p className="text-sm text-red-500">Failed to load events.</p>
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!events.length) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border bg-white p-10 font-nata-sans-rg">
        <p className="text-gray-500">No events found.</p>
      </div>
    );
  }

  return (
    <>
      {/* ---------- Table ---------- */}
      {!editingEvent && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                  Event
                </th>
                <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                  Date & Time
                </th>
                <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                  Venue
                </th>
                <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                  Registrations
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
                {events.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="transition-colors duration-200 hover:bg-amber-50/40"
                  >
                    <EventRow
                      event={event}
                      onDelete={() => onDelete(event)}
                      onEdit={() => setEditingEvent(event)}
                    />
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* =======================
           Edit Modal
      ======================= */}
      <AnimatePresence>
        {editingEvent && (
          <EventForm
            mode="edit"
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
