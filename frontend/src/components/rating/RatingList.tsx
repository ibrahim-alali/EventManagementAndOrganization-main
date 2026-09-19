import React from "react";

import { MessageSquare } from "lucide-react";
import type { Review } from "../../api/ratings";

import { RatingItem } from "./RatingItem";
import { Loader } from "../common/Loader";

import { motion, AnimatePresence } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 15 },
};

type RatingListProps = {
  reviews: Review[];
  isLoading?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
};

export const RatingList: React.FC<RatingListProps> = ({
  reviews,
  isLoading = false,
  onEdit,
  onDelete,
}) => {

  /* =======================
       Loading
    ======================= */
  if (isLoading) {
    return <Loader text={"Loading reviews..."} />;
  }

  /* =======================
       Empty State
    ======================= */
  if (!reviews.length) {
    return (
      <div
        className="flex flex-col items-center justify-center
                    rounded-2xl border border-dashed
                    border-gray-300 px-6 py-16 text-center
                    dark:border-gray-700"
      >
        <MessageSquare className="mb-4 h-8 w-8 text-gray-400" />

        <p className="font-nata-sans-md text-base text-gray-700 dark:text-gray-300">
          No reviews yet
        </p>

        <p className="mt-1 font-nata-sans-rg text-sm text-gray-500">
          Be the first to share your experience.
        </p>
      </div>
    );
  }

  /* =======================
       List
    ======================= */
  return (
    <motion.div className="space-y-6">
      <AnimatePresence>
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            layout
          >
            <RatingItem
              review={review}
              {...(review.target_id && { targetId: review.target_id })}
              {...(review.target_type && { targetType: review.target_type })}
              isOwnReview={review.is_own}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
