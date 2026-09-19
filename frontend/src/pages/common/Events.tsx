import React, { useRef, useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../../layouts/PublicLayout";

import { useEvents, useEvent } from "../../hooks/useEvent";

// Components
import { EventsHeader } from "../../components/event/EventsHeader";
import { EventsFilters } from "../../components/event/EventsFilters";
import { EventsGrid } from "../../components/event/EventsGrid";
import { EventCardDetails } from "../../components/event/EventCardDetails";
import { Pagination } from "../../components/common/Pagination";
import { Loader } from "../../components/common/Loader";

import { motion, AnimatePresence } from "framer-motion";

export const Events: React.FC<{ showHero?: boolean }> = ({showHero = true}) => {
    const {scrollableNodeRef} = useOutletContext<LayoutContextType>();

    const [searchParams] = useSearchParams();
    const organizerFromUrl = searchParams.get("organizer");

    const [filters, setFilters] = useState({
        search: "",
        min_date: "",
        max_date: "",
        ordering: "",
        organizer: organizerFromUrl ? Number(organizerFromUrl) : 0,
        page: 1,
        page_size: 12,
    });

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const eventsGridTopRef = useRef<HTMLDivElement | null>(null);

    // ===== React Query Get Events =====
    const {
        data: eventsData,
        isLoading: eventsLoading,
        isError: eventsError,
        error: eventsErrorObject,
        refetch: refetchEvents,
    } = useEvents(filters);

    const {
        data: eventDetails,
        isLoading: singleLoading,
        isError: singleError,
        error: singleErrorObject,
        refetch: refetchSingle,
    } = useEvent(selectedEventId);

    if (eventsError) console.error("Failed to fetch events:", eventsErrorObject);
    if (singleError) console.error("Failed to fetch single event:", singleErrorObject);

    const page = eventsData?.page ?? filters.page;
    const totalCards = eventsData?.total ?? 0;
    const pageSize = eventsData?.page_size ?? filters.page_size;
    const totalPages = Math.ceil(totalCards / pageSize);
    const results = eventsData?.results ?? [];

    return (
        <div className="mx-auto flex w-full flex-col">

            {/* Optional Hero */}
            {showHero && <EventsHeader/>}

            <div ref={eventsGridTopRef}/>

            {/* Filters */}
            <EventsFilters
                filters={filters}
                onChange={(newFilters) => {
                    setFilters((prev) => ({...prev, ...newFilters, page: 1}));
                    setSelectedEventId(null);
                }}
            />

            {/* Loading States */}
            {(eventsLoading || singleLoading) && (
                <Loader text={eventsLoading ? "Loading events..." : "Loading event..."} />
            )}

            {/* Error State */
            }
            {
                eventsError && (
                    <div className="flex min-h-96 flex-col items-center justify-center pb-20 text-center">
                        <p className="mb-4 text-red-600">Failed to load events. Try again.</p>
                        <button
                            onClick={() => refetchEvents()}
                            className="rounded-lg bg-violet-700 px-6 py-2 text-white hover:bg-violet-800"
                        >
                            Retry
                        </button>
                    </div>
                )}

            {singleError && (
                <div className="flex min-h-96 flex-col items-center justify-center pb-20 text-center">
                    <p className="mb-4 text-red-600">Failed to load event. Try again.</p>
                    <button
                        onClick={() => refetchSingle()}
                        className="rounded-lg bg-violet-700 px-6 py-2 text-white hover:bg-violet-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!eventsLoading && !eventsError && results.length === 0 && (
                <p className="flex min-h-96 flex-col justify-center pb-20 text-center text-lg text-gray-600">
                    No events found.
                </p>
            )}

            {/* Events List */}
            {!selectedEventId && !eventsLoading && results.length > 0 && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={
                            filters.page +
                            "-" +
                            filters.ordering +
                            "-" +
                            filters.max_date +
                            "-" +
                            filters.min_date +
                            "-" +
                            filters.search
                        }
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="mx-auto my-1 w-full max-w-max rounded-3xl bg-white p-8 pb-0 shadow-xl"
                    >
                        <EventsGrid
                            events={results}
                            onSelect={(id: string) => setSelectedEventId(id)}
                        />
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Show Single Event */}
            {selectedEventId && eventDetails && (
                <EventCardDetails
                    event={eventDetails}
                    onBack={() => setSelectedEventId(null)}
                />
            )}

            {/* Pagination */}
            {!selectedEventId && !eventsLoading && !eventsError && totalCards > 0 && (
                <Pagination
                    page={page}
                    lastPage={totalPages}
                    onPageChange={(page) => {
                        setFilters((prev) => ({...prev, page}));
                        const container = scrollableNodeRef.current;
                        const target = eventsGridTopRef.current;

                        if (container && target) {
                            const top =
                                target.getBoundingClientRect().top -
                                container.getBoundingClientRect().top +
                                container.scrollTop + 30;

                            container.scrollTo({
                                top,
                                behavior: "smooth",
                            });
                        }
                    }}
                />
            )}
        </div>
    );
};
