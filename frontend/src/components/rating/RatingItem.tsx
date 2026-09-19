import React from "react";
import { useLocation } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

import type { RatingTargetType, Review } from "../../api/ratings";
import { StarRating } from "./StarRating";

import { motion } from "framer-motion";

import { useAverageRating } from "../../hooks/useRatings";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

type RatingItemProps = {
  review: Review;
  targetType?: RatingTargetType;
  targetId?: string;
  isOwnReview?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
};

export const RatingItem: React.FC<RatingItemProps> = ({
  review,
  isOwnReview = false,
  targetType,
  targetId,
  onEdit,
  onDelete,
}) => {
  const { data: average } = useAverageRating(targetType!, targetId ?? null);
  const location = useLocation();
  const showAverage = location.pathname === `/client/${targetType}-ratings`;
  const isOrganizer =
    location.pathname === "/organizer/venues" ||
    location.pathname === "/organizer/bookings";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border p-6 transition
      ${
        isOwnReview
          ? `${
              isOrganizer
                ? "border-amber-600/40 bg-amber-200/5"
                : "border-[#5a2ea6]/40 bg-violet-100/70"
            }`
          : "border-gray-200 dark:border-gray-500"
      }`}
    >
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between gap-4">
        {/* User + Date */}
        <div>
          <p
            className={`font-nata-sans-bd text-sm 
              ${isOrganizer ? "text-amber-600" : "text-[#5a2ea6]"}`}
          >
            {review.reviewer.full_name || "Anonymous"}
          </p>

          {/* ===== Average Rating ===== */}
          {average && showAverage && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <StarRating
                rating={average.average_rating}
                showValue={false}
                size={12}
              />
              <span className="font-nata-sans-rg">({average.count})</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {isOwnReview && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(review)}
              className="rounded-lg p-1.5 text-gray-500 transition hover:bg-blue-600/10 hover:text-blue-600"
              title="Edit review"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={() => onDelete?.(review.id)}
              className="rounded-lg p-1.5 text-gray-500
                        transition hover:bg-red-500/10
                        hover:text-red-500"
              title="Delete review"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* ===== Comment ===== */}
      {review.comment && (
        <p
          className="mt-4 font-nata-sans-rg text-sm
                    leading-relaxed text-gray-700
                    dark:text-gray-500"
        >
          {review.comment}
        </p>
      )}

      {/* ===== Rating ===== */}
      <div className="mt-3">
        <StarRating rating={review.rating} showValue={true} />
      </div>

      <p className="mt-3 font-nata-sans-rg text-xs text-gray-500">
        {format(new Date(review.created_at), "MMM dd, yyyy")}
        {review.edited_at && <span className="ml-1 italic">(edited)</span>}
      </p>
    </motion.div>
  );
};
