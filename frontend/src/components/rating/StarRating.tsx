import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const starVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};

const fillVariants = {
  initial: { width: 0 },
  animate: (width: number) => ({ width: `${width}%` }),
};

interface StarRatingProps {
  rating: number; // 0 → 5 (0.5 steps)
  size?: number; // px
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 18,
  showValue = false,
  interactive = false,
  onChange,
}) => {
  const location = useLocation();
  const isOrganizer =
    location.pathname === "/organizer/venues" ||
    location.pathname === "/organizer/my-events" ||
    location.pathname === "/organizer/bookings";

  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayRating = hoverValue ?? rating;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, star: number) => {
    if (!interactive) return;

    const { offsetX } = e.nativeEvent;
    const value = offsetX < size / 2 ? star - 0.5 : star;

    onChange?.(value);
  };

  const handleMouseEnter = (value: number) => {
    if (!interactive) return;
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverValue(null);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage =
          displayRating >= star ? 100 : displayRating >= star - 0.5 ? 50 : 0;

        return (
          <motion.div
            key={star}
            className={`relative ${
              interactive ? "cursor-pointer" : "cursor-default"
            }`}
            style={{ width: size, height: size }}
            onClick={(e) => handleClick(e, star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            variants={starVariants}
            initial="initial"
            whileHover={interactive ? "hover" : "initial"}
            whileTap={interactive ? "tap" : "initial"}
          >
            <Star size={size} className="text-gray-300" />

            <motion.div
              custom={fillPercentage}
              variants={fillVariants}
              initial={{ width: 0 }}
              animate="animate"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0 overflow-hidden"
            >
              <Star
                size={size}
                className={`${
                  isOrganizer
                    ? "fill-amber-600 text-amber-600"
                    : "fill-[#5a2ea6] text-[#5a2ea6]"
                }`}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {showValue && (
        <span className="ml-2 text-sm text-gray-500">{rating}</span>
      )}
    </div>
  );
};
