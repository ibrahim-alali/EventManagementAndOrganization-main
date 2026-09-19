import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import {
    useEventsQuery,
    useDeleteEvent,
} from "../../hooks/useEventsManage";

import type { Event, FetchEventsParams } from "../../api/eventsManage";

import { EventsFilter } from "../../components/manageEvent/EventsFilter";
import { EventsTable } from "../../components/manageEvent/EventsTable";
import { EventForm } from "../../components/manageEvent/eventForm/EventForm";
import { ModalPortal } from "../../components/common/ModalPortal";

/* =======================
   Types
======================= */

export type EventsFilterState = FetchEventsParams

/* =======================
   Component
======================= */

export const EventsManage: React.FC = () => {
    /* -------- State -------- */
    const [filter, setFilter] = useState<EventsFilterState>({});
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

    /* -------- Queries -------- */
    const { data: events, isLoading, isError } = useEventsQuery(filter);
    const deleteEventMutation = useDeleteEvent();

    /* -------- Handlers -------- */
    const handleDeleteConfirm = () => {
        if (!eventToDelete) return;

        deleteEventMutation.mutate(eventToDelete.id, {
            onSuccess: () => {
                toast.success("Event deleted successfully");
                setEventToDelete(null);
            },
            onError: () => {
                toast.error("Failed to delete event");
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

            {!isCreateOpen && (
                <>
                    {/* ---------- Header ---------- */}
                    <motion.div
                        className="mb-4 flex items-center justify-between"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <CalendarDays />
                                Events Management
                            </h1>
                            <p className="pt-1 text-sm text-gray-500">
                                Manage and control your events
                            </p>
                        </div>

                        <motion.button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 font-nata-sans-md text-white transition hover:bg-amber-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus size={18} />
                            Create Event
                        </motion.button>
                    </motion.div>
                    {/* ---------- Filters ---------- */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <EventsFilter value={filter} onChange={setFilter} />
                    </motion.div>

                    {/* ---------- Table ---------- */}
                    <motion.div
                        key={`${filter.search}-${filter.ordering}-${filter.min_date}-${filter.max_date}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <EventsTable
                            events={events ?? []}
                            isLoading={isLoading}
                            isError={isError}
                            onDelete={(event) => setEventToDelete(event)}
                        />
                    </motion.div>
                </>
            )}

            {/* =======================
                  Create Event Modal
              ======================= */}
            <AnimatePresence>
                {isCreateOpen && (
                    <EventForm
                        mode="create"
                        onClose={() => setIsCreateOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* =======================
               Delete Confirmation Modal
             ======================= */}
            <AnimatePresence>
                {eventToDelete && (
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
                                <h3 className="mb-2 font-nata-sans-bd text-lg">
                                    Delete Event
                                </h3>
                                <p className="mb-6 font-nata-sans-rg text-sm text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <span className="font-nata-sans-md">
                                        {eventToDelete.title}
                                    </span>
                                    ?
                                </p>

                                <div className="flex justify-end gap-3 font-nata-sans-md text-sm">
                                    <motion.button
                                        onClick={() => setEventToDelete(null)}
                                        className="rounded-lg border px-4 py-2 text-gray-600"
                                        whileHover={{ backgroundColor: "#f3f4f6" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>

                                    <motion.button
                                        onClick={handleDeleteConfirm}
                                        disabled={deleteEventMutation.isPending}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                                        whileHover={{ backgroundColor: "#dc2626" }}
                                        whileTap={{ scale: 0.98 }}
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