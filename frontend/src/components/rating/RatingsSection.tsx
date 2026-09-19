import React, { useState } from "react";
import { MessageSquarePlus, ChevronDown, ChevronUp } from "lucide-react";

import {
  useEventReviews,
  useVenueReviews,
  useAverageRating,
  useDeleteReview,
} from "../../hooks/useRatings";

import type { RatingTargetType, Review } from "../../api/ratings";

import toast from "react-hot-toast";

// Shared components
import { StarRating } from "./StarRating";
import { ModalPortal } from "../common/ModalPortal";

// Children components
import { RatingList } from "./RatingList";
import { RatingForm } from "./RatingForm";

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const fadeSlide = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 15 },
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

type RatingsSectionProps = {
  targetId: string;
  targetType: RatingTargetType;
};

export const RatingsSection: React.FC<RatingsSectionProps> = ({
  targetId,
  targetType,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

  /* =======================
         Data
      ======================= */

  const eventReviewsQuery = useEventReviews(targetId);
  const venueReviewsQuery = useVenueReviews(targetId);

  const reviewsQuery =
    targetType === "event" ? eventReviewsQuery : venueReviewsQuery;

  const averageQuery = useAverageRating(targetType, targetId);

  const reviews = reviewsQuery.data ?? [];
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const deleteMutation = useDeleteReview(
    targetType,
    targetId,
    reviewToDelete ?? ""
  );

  const location = useLocation();
  const isOrganizer =
    location.pathname === "/organizer/venues" ||
    location.pathname === "/organizer/bookings";

  const handleDeleteReview = () => {
    if (!reviewToDelete) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Review deleted successfully 🗑️");
        setReviewToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete review");
      },
    });
  };

  /* =======================
         UI
      ======================= */

  return (
    <section className="my-8 border-t border-gray-200 pt-10 dark:border-gray-800">
      {/* ===== Header ===== */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Title + Average */}
        <div>
          <h3 className="font-nata-sans-bd text-2xl text-gray-900">
            Ratings & Reviews
          </h3>

          {averageQuery.data && (
            <div className="mt-4 flex items-center gap-3">
              <StarRating
                rating={averageQuery.data.average_rating}
                showValue={true}
              />

              <span className="font-nata-sans-md text-sm text-gray-600 dark:text-gray-400">
                ({averageQuery.data.count} reviews)
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className={`${
            isOrganizer
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-[#5a2ea6] hover:bg-purple-800"
          } inline-flex items-center justify-center gap-2 rounded-xl
                     px-5 py-2.5 font-nata-sans-md text-sm text-white transition hover:opacity-90`}
        >
          <MessageSquarePlus className="h-4 w-4" />
          Write a review
        </button>
      </div>

      {/* ===== Rating Form ===== */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`${
              isOrganizer
                ? "border-amber-300 bg-amber-50/70"
                : "border-violet-300 bg-violet-100/70"
            } mb-10 rounded-2xl border p-6`}
          >
            <RatingForm
              targetId={targetId}
              targetType={targetType}
              initialReview={reviewToEdit ?? undefined}
              onClose={() => {
                setShowForm(false);
                setReviewToEdit(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Reviews List ===== */}
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <RatingList
          reviews={displayedReviews}
          isLoading={reviewsQuery.isLoading}
          onEdit={(review) => {
            setReviewToEdit(review);
            setShowForm(true);
          }}
          onDelete={(id) => setReviewToDelete(id)}
        />
      </motion.div>

      {/* ===== Show More / Less ===== */}
      {reviews.length > 3 && (
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={() => setShowAll((prev) => !prev)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 font-nata-sans-md
                       text-sm hover:underline
                       ${isOrganizer ? "text-amber-600" : "text-[#5a2ea6]"}`}
          >
            {showAll ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show more
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      )}

      {reviewToDelete && (
        <AnimatePresence>
          {reviewToDelete && (
            <ModalPortal>
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  variants={scaleFade}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="w-full max-w-sm rounded-2xl bg-white p-6"
                >
                  <h4 className="font-nata-sans-md text-lg text-gray-900">
                    Delete review?
                  </h4>

                  <p className="mt-2 font-nata-sans-rg text-sm text-gray-500">
                    Are you sure you want to delete this review? This action
                    cannot be undone.
                  </p>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setReviewToDelete(null)}
                      className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleDeleteReview}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white
                       hover:bg-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </ModalPortal>
          )}
        </AnimatePresence>
      )}
    </section>
  );
};
