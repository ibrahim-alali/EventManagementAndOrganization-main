import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { EventItem } from "../../api/events";
import { EventCard } from "./EventCard";
import { ArrowLeft } from "lucide-react";
import { getToken } from "../../utils/authToken";

interface EventsGridProps {
  events?: EventItem[];
  isRecommended?: boolean;
  onSelect?: (id: string) => void;
}

export const EventsGrid: React.FC<EventsGridProps> = ({ events, isRecommended = false, onSelect }) => {

  const location = useLocation();
  const showLink = location.pathname === "/client/events";

  const token = getToken();

  const visibleEvents = events?.filter((event) => {
    if (!token) return true;
    return !event.is_registered;
  })

  return (
    <>
      {/* Back */}
      {showLink && !isRecommended && (
        <Link
          to="/client/registrations"
          className="mb-6 inline-flex items-center gap-2 font-nata-sans-md text-sm text-[#5a2ea6] hover:text-purple-700"
        >
          <ArrowLeft size={18} className="transition hover:translate-x-1" />
          Back to registrations
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
        {visibleEvents?.map((event) => (
          <motion.div
            key={event.id}
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
            <EventCard event={event} onSelect={onSelect} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};
