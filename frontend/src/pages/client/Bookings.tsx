import React, {useState} from "react";
import {motion} from "framer-motion";
import {Plus, Calendar} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

import {useBookings} from "../../hooks/useBookings";
import {useVenue} from "../../hooks/useVenue";

import {BookingsFilter} from "../../components/booking/BookingsFilter";
import {BookingsGrid} from "../../components/booking/BookingsGrid";
import {VenueCardDetails} from "../../components/venue/VenueCardDetails";

import type {Booking} from "../../api/bookings";
import {Loader} from "../../components/common/Loader";

export const Bookings: React.FC = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const isOrganizer = location.pathname === "/organizer/bookings";

    const [search, setSearch] = useState("");
    const [ordering, setOrdering] = useState("-created_at");
    const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

    const {
        data: bookings,
        isLoading,
        isError,
        error,
    } = useBookings({
        search,
        ordering,
    });

    const {data: venueDetails} = useVenue(selectedVenueId);

    const handleCreateBooking = () => {
        if (!isOrganizer) {
            navigate("/client/venues");
        } else {
            navigate("/organizer/venues");
        }
    };

    return (
        <div className="w-full px-6 py-8 font-nata-sans-rg">
            {/* ===== Header ===== */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                        <Calendar className="text-primary h-6 w-6"/>
                        Bookings
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your event bookings
                    </p>
                </div>

                {/* Create Booking Button */}
                <motion.button
                    whileHover={{scale: 1.04}}
                    whileTap={{scale: 0.97}}
                    onClick={handleCreateBooking}
                    className={`flex items-center gap-2 rounded-xl
                     ${isOrganizer ? "bg-amber-500 hover:bg-amber-600" : "bg-violet-500 hover:bg-violet-600"} 
                     px-5 py-2.5 font-nata-sans-md text-white shadow-sm transition hover:shadow-md`}
                >
                    <Plus className="h-5 w-5"/>
                    New Booking
                </motion.button>
            </div>

            {/* ===== Filters ===== */}
            <BookingsFilter
                search={search}
                ordering={ordering}
                onSearchChange={setSearch}
                onOrderingChange={setOrdering}
            />

            {/* ===== Content ===== */}
            <div className="mt-8">
                {isLoading && (
                    <Loader text={"Loading bookings..."}/>
                )}

                {isError && (
                    <div className="py-20 text-center text-red-500">
                        {error?.message || "Something went wrong"}
                    </div>
                )}

                {!isLoading && bookings && !selectedVenueId && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4}}
                    >
                        <BookingsGrid
                            key={search + "-" + ordering + "-" + bookings}
                            bookings={bookings as Booking[]}
                            onSelect={(id: string) => setSelectedVenueId(id)}
                        />
                    </motion.div>
                )}

                {/* Single Venue */}
                {selectedVenueId && venueDetails && (
                    <VenueCardDetails
                        venue={venueDetails}
                        onBack={() => setSelectedVenueId(null)}
                    />
                )}

                {!isLoading && bookings?.length === 0 && (
                    <div className="py-20 text-center text-gray-500">
                        No bookings found
                    </div>
                )}
            </div>
        </div>
    );
};
