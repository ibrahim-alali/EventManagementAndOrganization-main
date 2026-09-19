import React from "react";
import { motion } from "framer-motion";
import type { VenueItem } from "../../api/venues";
import { VenueCard } from "./VenueCard";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface VenuesGridProps {
  venues?: VenueItem[];
  isRecommended?: boolean;
  onSelect?: (id: string) => void;
}

export const VenuesGrid: React.FC<VenuesGridProps> = ({
  venues,
  isRecommended = false,
  onSelect,
}) => {
  const location = useLocation();
  const isClient = location.pathname === "/client/venues";
  const isOrganizer = location.pathname === "/organizer/venues";
  const showLink = isClient || isOrganizer;
  const destinationLink = isClient ? "/client/bookings" : "/organizer/bookings";

  return (
    <>
      {/* Back */}
      {showLink && !isRecommended && (
        <Link
          to={destinationLink}
          className={`mb-6 inline-flex items-center gap-2 font-nata-sans-md text-sm ${
            isOrganizer
              ? "text-amber-600 hover:text-amber-700"
              : "text-[#5a2ea6] hover:text-purple-700"
          }`}
        >
          <ArrowLeft size={18} className="transition hover:translate-x-1" />
          Back to bookings
        </Link>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className={`grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 ${isRecommended ? "" : "pb-8 xl:grid-cols-4"}`}
      >
        {venues?.map((venue) => (
          <motion.div
            key={venue.id}
            initial={
              isRecommended
                ? { opacity: 0, scale: 0.96 }
                : { opacity: 0, y: 15 }
            }
            animate={
              isRecommended
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[280px]"
          >
            <VenueCard venue={venue} onSelect={onSelect} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};
