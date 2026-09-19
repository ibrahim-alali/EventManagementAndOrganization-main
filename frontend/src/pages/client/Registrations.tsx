import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useRegistrations } from "../../hooks/useRegistrations";
import { useEvent } from "../../hooks/useEvent";

import { RegistrationsFilter } from "../../components/registration/RegistrationsFilter";
import { RegistrationsGrid } from "../../components/registration/RegistrationsGrid";
import { EventCardDetails } from "../../components/event/EventCardDetails";
import { Loader } from "../../components/common/Loader";

import type { Registration } from "../../api/registrations";

export const Registrations: React.FC = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [ordering, setOrdering] = useState("-created_at");
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const {
        data: registrations,
        isLoading,
        isError,
        error,
    } = useRegistrations({
        search,
        ordering,
    });

    const {data: eventDetails} = useEvent(selectedEventId);

    const handleBrowseEvents = () => {
        navigate("/client/events");
    };

    return (
        <div className="w-full px-6 py-8 font-nata-sans-rg">
            {/* ===== Header ===== */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                        <Calendar className="h-6 w-6"/>
                        Registrations
                    </h1>
                    <p className="mt-1 font-nata-sans-md text-sm text-gray-500">
                        Manage your event registrations
                    </p>
                </div>

                {/* Browse Events Button */}
                <motion.button
                    whileHover={{scale: 1.04}}
                    whileTap={{scale: 0.97}}
                    onClick={handleBrowseEvents}
                    className="flex items-center gap-2 rounded-xl
                     bg-violet-500 px-5 py-2.5 font-nata-sans-md
                     text-white shadow-sm transition
                     hover:bg-violet-600 hover:shadow-md"
                >
                    <Plus className="h-5 w-5"/>
                    Browse Events
                </motion.button>
            </div>

            {/* ===== Filters ===== */}
            <RegistrationsFilter
                search={search}
                ordering={ordering}
                onSearchChange={setSearch}
                onOrderingChange={setOrdering}
            />

            {/* ===== Content ===== */}
            <div className="mt-8">
                {isLoading && (
                    <Loader text={"Loading registrations..."} />
                )}

                {isError && (
                    <div className="py-20 text-center text-red-500">
                        {error?.message || "Something went wrong"}
                    </div>
                )}

                {!isLoading && registrations && !selectedEventId && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4}}
                    >
                        <RegistrationsGrid
                            key={search + "-" + ordering + "-" + registrations}
                            registrations={registrations as Registration[]}
                            onSelect={(id: string) => setSelectedEventId(id)}
                        />
                    </motion.div>
                )}

                {/* Single Event */}
                {selectedEventId && eventDetails && (
                    <EventCardDetails
                        event={eventDetails}
                        onBack={() => setSelectedEventId(null)}
                    />
                )}

                {!isLoading && registrations?.length === 0 && (
                    <div className="py-20 text-center text-gray-500">
                        No registrations found
                    </div>
                )}
            </div>
        </div>
    );
};
