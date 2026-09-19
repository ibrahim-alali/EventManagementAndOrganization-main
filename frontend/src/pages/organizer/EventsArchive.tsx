import React, { useState } from "react";
import { motion } from "framer-motion";

import { useEventsArchiveQuery } from "../../hooks/useEventsManage";

import { EventsFilter } from "../../components/manageEvent/EventsFilter";
import { EventsArchiveTable } from "../../components/manageEvent/EventsArchiveTable";

import type { EventsFilterState } from "./EventsManage";

import { Archive } from "lucide-react";

export const EventsArchive: React.FC = () => {
    const [filter, setFilter] = useState<EventsFilterState>({});

    const { data: events, isLoading, isError } =
        useEventsArchiveQuery(filter);

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
                        <Archive />
                        Archived Events
                    </h1>
                    <p className="pt-1 text-sm text-gray-500">
                        View and restore archived events
                    </p>
                </div>
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
                key={filter.search + "-" + filter.ordering}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <EventsArchiveTable
                    events={events ?? []}
                    isLoading={isLoading}
                    isError={isError}
                />
            </motion.div>
        </motion.div>
    );
};
