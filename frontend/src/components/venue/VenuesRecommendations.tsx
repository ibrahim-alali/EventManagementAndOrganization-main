import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVenuesRecommendations } from "../../hooks/useVenue";
import { VenuesGrid } from "./VenuesGrid";
import { AnimatePresence, motion } from "framer-motion";

interface VenuesRecommendationsProps {
  onSelect: (id: string) => void;
}

export const VenuesRecommendations: React.FC<VenuesRecommendationsProps> = ({ onSelect }) => {
  const { data: recommendations } = useVenuesRecommendations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const visibleCount = 3;

  const results = recommendations?.results;
  const length = results?.length;

  const visibleVenues = results?.slice(currentIndex, currentIndex + visibleCount);

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex >= length! - visibleCount) return;
    setDirection(1);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="relative my-10 border-t border-gray-200 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-nata-sans-bd text-2xl text-gray-900">Venues you may like</h3>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`rounded-full p-2 transition ${
              currentIndex === 0
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 shadow hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= length! - visibleCount}
            className={`rounded-full p-2 transition ${
              currentIndex >= length! - visibleCount
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-gray-700 shadow hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="my-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex + "-" + results}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <VenuesGrid venues={visibleVenues} isRecommended={true} onSelect={onSelect} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
