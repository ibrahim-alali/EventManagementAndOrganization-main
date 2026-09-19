import React, { useEffect, useState } from "react";
import { Edit, Archive, Trash2, CalendarDays } from "lucide-react";
import { toast } from "react-hot-toast";

import type { Event } from "../../api/eventsManage";

import { useArchiveEvent } from "../../hooks/useEventsManage";
import { useOutletContext } from "react-router-dom";
import { StarRating } from "../rating/StarRating";
import { VenueTooltip } from "./VenueTooltip";

/* =======================
   Props
======================= */

interface EventRowProps {
  event: Event;
  onDelete: () => void;
  onEdit: () => void;
}

type LayoutContextType = {
  scrollableNodeRef: React.RefObject<HTMLDivElement>;
}

/* =======================
   Component
======================= */

export const EventRow: React.FC<EventRowProps> = ({
  event,
  onDelete,
  onEdit,
}) => {
  const archiveEvent = useArchiveEvent();
  const { scrollableNodeRef } = useOutletContext<LayoutContextType>();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollableNodeRef.current) {
      setPortalContainer(scrollableNodeRef.current);
    }
  }, [scrollableNodeRef]);

  /* ---------- Handlers ---------- */

  const handleArchiveToggle = () => {
    archiveEvent.mutate(event.id, {
      onSuccess: () => {
        toast.success("Event archived");
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
      {/* ---------- Event ---------- */}
      <td className="px-6 py-4 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <CalendarDays className="text-amber-700" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-nata-sans-md text-gray-800">
              {event.title}
            </p>

            {/* Event Type Badge */}
            <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 font-nata-sans-bd text-xs text-amber-700">
              {event.type}
            </span>
          </div>
        </div>
      </td>

      {/* ---------- Date & Time ---------- */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="flex flex-col">
          <span className="font-nata-sans-md text-gray-700">{event.date}</span>
          <span className="text-xs text-gray-500">
            {event.start_time} – {event.end_time}
          </span>
        </div>
      </td>

      {/* ---------- Venue ---------- */}
      <td className="px-6 py-4 text-gray-600">
        <VenueTooltip 
          venue={event.venue} 
          portalContainer={portalContainer}
        />
      </td>

      {/* ---------- Registrations ---------- */}
      <td className="px-6 py-4 text-gray-600">
        <span className="font-nata-sans-md">{event.attendance_count}</span>
        <span className="text-gray-400"> / {event.capacity}</span>
      </td>

      {/* ---------- Ratings ---------- */}
      <td className="mt-8 flex justify-center text-gray-600">
        <StarRating rating={event.average_rating.average_rating} size={12} />
      </td>

      {/* ---------- Status ---------- */}
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 font-nata-sans-bd text-xs
          ${
            event.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {event.status}
        </span>
      </td>

      {/* ---------- Actions ---------- */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          {/* Edit */}
          <button
            onClick={onEdit}
            className="rounded-lg p-2 text-gray-500 transition
                       hover:bg-amber-50 hover:text-amber-600"
            title="Edit"
          >
            <Edit size={16} />
          </button>

          {/* Archive */}
          <button
            onClick={handleArchiveToggle}
            className="rounded-lg p-2 text-gray-500 transition
                       hover:bg-amber-50 hover:text-amber-600"
            title="Archive"
          >
            <Archive size={16} />
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-gray-500 transition
                       hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </>
  );
};
