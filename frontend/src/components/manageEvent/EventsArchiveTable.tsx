import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { EventArchiveRow } from "./EventArchiveRow";

import type { Event } from "../../api/eventsManage";

import { Loader } from "../common/Loader";

/* =======================
   Props
======================= */

interface EventsArchiveTableProps {
    events: Event[];
    isLoading: boolean;
    isError: boolean;
}

/* =======================
   Component
======================= */

export const EventsArchiveTable: React.FC<EventsArchiveTableProps> = ({
    events,
    isLoading,
    isError,
}) => {
    /* ---------- Loading ---------- */
    if (isLoading) {
        return <Loader text={"Loading events..."} />;
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
    if (!events.length) {
        return (
            <div className="flex h-96 items-center justify-center rounded-2xl border bg-white p-10 font-nata-sans-rg">
                <p className="text-gray-500">No archived events.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <table className="w-full">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Event {/*Event & Type*/}
                    </th>
                    <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Date & Time {/*Date & Time*/}
                    </th>
                    <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Attendees {/*Attendance*/}
                    </th>
                    <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Venue {/*Venue Name*/}
                    </th>
                    <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Location {/*Venue Location*/}
                    </th>
                    <th className="px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Status
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 font-nata-sans-md text-xs uppercase tracking-wider text-gray-500">
                        Archived Date
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
                            className="transition-colors duration-200 hover:bg-gray-50"
                        >
                            <EventArchiveRow event={event} />
                        </motion.tr>
                    ))}
                </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};
