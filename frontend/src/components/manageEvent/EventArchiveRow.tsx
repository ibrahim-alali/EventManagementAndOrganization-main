import React from "react";
import {
    ArchiveRestore,
    CalendarDays,
    MapPin,
    Users,
} from "lucide-react";

import { toast } from "react-hot-toast";

import type { Event } from "../../api/eventsManage";

import { useUnArchiveEvent } from "../../hooks/useEventsManage";

/* =======================
   Props
======================= */

interface EventArchiveRowProps {
    event: Event;
}

/* =======================
   Component
======================= */

export const EventArchiveRow: React.FC<EventArchiveRowProps> = ({ event }) => {
    const unArchiveEvent = useUnArchiveEvent();

    /* ---------- Handlers ---------- */

    const handleRestore = () => {
        unArchiveEvent.mutate(event.id, {
            onSuccess: () => {
                toast.success("Event restored");
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
            {/* Event */}
            <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <CalendarDays className="text-gray-700"/>
                    </div>

                    <div>
                        <p className="font-nata-sans-md text-gray-800">
                            {event.title}
                        </p>
                        <p className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-center font-nata-sans-bd text-xs text-gray-600">
                            {event.type ?? "—"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Date & Time */}
            <td className="w-32 px-6 py-4 text-gray-600">
                <div className="flex flex-col text-sm">
                  <span className="font-nata-sans-md text-gray-700">
                    {event.date}
                  </span>
                  <span className="text-xs text-gray-500">
                    {event.start_time}-{event.end_time}
                  </span>
                </div>
            </td>

            {/* Attendees */}
            <td className="px-6 py-4 text-gray-600">
                <div className="flex items-center justify-center gap-1">
                    <Users size={14}/>
                    <span>
                        {event.attendance_count ?? 0}
                    </span>
                </div>
            </td>

            {/* Venue */}
            <td className="px-6 py-4 text-gray-600">
                {event.venue?.name ?? "—"}
            </td>

            {/* Location */}
            <td className="px-6 py-4 text-gray-600 ">
                    <span className="">
                        {event.venue?.location_geo?.city}, {event.venue?.location_geo?.area}
                    </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <span className="rounded-full bg-gray-200 px-3 py-1 font-nata-sans-bd text-xs text-gray-600">
                  {event.status}
                </span>
            </td>

            {/* Archived Date */}
            <td className="px-6 py-4 text-gray-600">
                {event.last_time_archived}
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-1">
                    <button
                        onClick={handleRestore}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Restore"
                    >
                        <ArchiveRestore size={16}/>
                    </button>
                </div>
            </td>
        </>
    );
};
