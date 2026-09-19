import React, { useRef, useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../../layouts/PublicLayout";

import { useVenues, useVenue } from "../../hooks/useVenue";

// Components
import { VenuesHeader } from "../../components/venue/VenuesHeader";
import { VenuesFilters } from "../../components/venue/VenuesFilters";
import { VenuesGrid } from "../../components/venue/VenuesGrid";
import { VenueCardDetails } from "../../components/venue/VenueCardDetails";
import { Pagination } from "../../components/common/Pagination";
import { Loader } from "../../components/common/Loader";

import { motion, AnimatePresence } from "framer-motion";

export const Venues: React.FC<{ showHero?: boolean }> = ({showHero = true}) => {
    const {scrollableNodeRef} = useOutletContext<LayoutContextType>();

    const [searchParams] = useSearchParams();
    const providerFromUrl = searchParams.get("provider");

    const [filters, setFilters] = useState({
        search: "",
        min_capacity: undefined as number | undefined,
        max_capacity: undefined as number | undefined,
        min_price: undefined as number | undefined,
        max_price: undefined as number | undefined,
        ordering: "",
        provider: providerFromUrl ? Number(providerFromUrl) : 0,
        page: 1,
        page_size: 12,
    });

    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

    const venuesGridTopRef = useRef<HTMLDivElement | null>(null);

    // ===== React Query Get Venues =====
    const {
        data: venuesData,
        isLoading: venuesLoading,
        isError: venuesError,
        error: venuesErrorObject,
        refetch: refetchVenues,
    } = useVenues(filters);

    const {
        data: venueDetails,
        isLoading: singleLoading,
        isError: singleError,
        error: singleErrorObject,
        refetch: refetchSingle,
    } = useVenue(selectedVenueId);

    if (venuesError) console.error("Failed to fetch venues:", venuesErrorObject);
    if (singleError) console.error("Failed to fetch venue:", singleErrorObject);


    const page = venuesData?.page ?? filters.page;
    const totalCards = venuesData?.total ?? 0;
    const pageSize = venuesData?.page_size ?? filters.page_size;
    const totalPages = Math.ceil(totalCards / pageSize);
    const results = venuesData?.results ?? [];

    return (
        <div className="mx-auto flex w-full flex-col">

            {/* Optional Hero */}
            {showHero && <VenuesHeader/>}

            <div ref={venuesGridTopRef}/>

            {/* Filters */}
            <VenuesFilters
                filters={filters}
                onChange={(newFilters) => {
                    setFilters((prev) => ({...prev, ...newFilters, page: 1}));
                    setSelectedVenueId(null);
                }}
            />

            {/* Loading */}
            {(venuesLoading || singleLoading) && (
                <Loader text={venuesLoading ? "Loading venues..." : "Loading venue..."} />
            )}

            {/* Error */}
            {venuesError && (
                <div className="flex min-h-96 flex-col items-center justify-center pb-20 text-center">
                    <p className="mb-4 text-red-600">
                        Failed to load venues. Try again.
                    </p>
                    <button
                        onClick={() => refetchVenues()}
                        className="rounded-lg bg-violet-700 px-6 py-2 text-white hover:bg-violet-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {singleError && (
                <div className="flex min-h-96 flex-col items-center justify-center pb-20 text-center">
                    <p className="mb-4 text-red-600">
                        Failed to load venue. Try again.
                    </p>
                    <button
                        onClick={() => refetchSingle()}
                        className="rounded-lg bg-violet-700 px-6 py-2 text-white hover:bg-violet-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty */}
            {!venuesLoading && !venuesError && results.length === 0 && (
                <p className="flex min-h-96 flex-col justify-center pb-20 text-center text-lg text-gray-600">
                    No venues found.
                </p>
            )}

            {/* Venues Grid */}
            {!selectedVenueId && !venuesLoading && results.length > 0 && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={
                            filters.page +
                            "-" +
                            filters.ordering +
                            "-" +
                            filters.max_capacity +
                            "-" +
                            filters.min_capacity +
                            "-" +
                            filters.max_price +
                            "-" +
                            filters.min_price +
                            "-" +
                            filters.search
                        }
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="mx-auto my-1 w-full max-w-max rounded-3xl bg-white p-8 pb-0 shadow-xl"
                    >
                        <VenuesGrid
                            venues={results}
                            onSelect={(id: string) => setSelectedVenueId(id)}
                        />
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Single Venue */}
            {selectedVenueId && venueDetails && (
                <VenueCardDetails
                    venue={venueDetails}
                    onBack={() => setSelectedVenueId(null)}
                />
            )}

            {/* Pagination */}
            {!selectedVenueId && !venuesLoading && !venuesError && totalCards > 0 && (
                <Pagination
                    page={page}
                    lastPage={totalPages}
                    onPageChange={(page) => {
                        setFilters((prev) => ({...prev, page}));

                        const container = scrollableNodeRef.current;
                        const target = venuesGridTopRef.current;

                        if (container && target) {
                            const top =
                                target.getBoundingClientRect().top -
                                container.getBoundingClientRect().top +
                                container.scrollTop + 90;

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
