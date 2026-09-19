import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Send } from "lucide-react";

import { useCreateReview, useUpdateReview } from "../../hooks/useRatings";

import type {
  Review,
  ReviewPayload,
  RatingTargetType,
} from "../../api/ratings";

import { StarRating } from "./StarRating";

import toast from "react-hot-toast";

import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const formVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 15, scale: 0.97 },
};

/* =========================
   Schema
========================= */
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z.string().max(500, "Comment too long").optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type RatingFormProps = {
  targetId: string;
  targetType: RatingTargetType;
  initialReview?: Review;
  onClose: () => void;
};

export const RatingForm: React.FC<RatingFormProps> = ({
  targetId,
  targetType,
  initialReview,
  onClose,
}) => {
  const location = useLocation();
  const isOrganizer =
    location.pathname === "/organizer/venues" ||
    location.pathname === "/organizer/bookings";

  const isEditMode = !!initialReview;

  /* =========================
       React Hook Form
    ========================== */
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    defaultValues: {
      rating: initialReview?.rating ?? 0,
      comment: initialReview?.comment ?? "",
    },
    resolver: zodResolver(reviewSchema),
  });

  /* =========================
       Mutations
    ========================== */
  const createMutation = useCreateReview(targetType, targetId);

  const updateMutation = useUpdateReview(
    targetType,
    targetId,
    initialReview?.id ?? ""
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  /* =========================
       Submit
    ========================== */
  const onSubmit = (data: ReviewFormValues) => {
    const payload: ReviewPayload = {
      target_type: targetType,
      target_id: targetId,
      rating: data.rating,
      comment: data.comment!,
    };

    if (isEditMode) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Review updated successfully ✏️");
          onClose();
        },
        onError: () => {
          toast.error("Failed to update review");
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Review submitted successfully ⭐");
          onClose();
        },
        onError: () => {
          toast.error("Failed to submit review");
        },
      });
    }
  };

  return (
    <motion.div
      className="relative"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {" "}
      {/* Close */}
      <button
        onClick={onClose}
        className={`absolute right-4 top-0 rounded-lg p-1.5
                  ${isOrganizer ? "text-amber-800" : "text-violet-800"}
                  text-violet-800 transition hover:bg-gray-50`}
      >
        <X className="h-4 w-4" />
      </button>
      {/* Title */}
      <h4
        className={`${
          isOrganizer ? "text-amber-900" : "text-violet-900"
        } mb-4 font-nata-sans-bd text-lg`}
      >
        {isEditMode ? "Edit your review" : "Write a review"}
      </h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Rating */}
        <div className="mb-5">
          <p className="mb-2 font-nata-sans-md text-sm text-gray-400">
            Your rating
          </p>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating
                rating={field.value}
                showValue={true}
                interactive
                onChange={field.onChange}
              />
            )}
          />
          {errors.rating && (
            <p className="mt-1 font-nata-sans-md text-xs text-red-500">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-5">
          <label className="mb-2 block font-nata-sans-md text-sm text-gray-400">
            Comment (optional)
          </label>

          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                placeholder="Share your experience..."
                className={`w-full rounded-xl border 
                  ${
                    isOrganizer
                      ? "border-amber-300 text-amber-800 placeholder-amber-400 focus:ring-amber-600/40"
                      : "border-violet-300 text-violet-800 placeholder-violet-300 focus:ring-[#5a2ea6]/40"
                  }
                           bg-white/80 px-4 py-3 font-nata-sans-rg text-sm 
                           focus:outline-none focus:ring-1`}
              />
            )}
          />
          {errors.comment && (
            <p className="mt-1 font-nata-sans-md text-xs text-red-400">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-600/50 px-4 py-2
                     font-nata-sans-md text-sm text-gray-500 transition hover:bg-gray-400/50
                     hover:text-white"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 rounded-lg 
              ${isOrganizer ? "bg-amber-500" : "bg-[#5a2ea6]"}
                       px-5 py-2 font-nata-sans-md text-sm text-white
                       transition hover:opacity-90 disabled:opacity-50`}
          >
            <Send className="h-4 w-4" />
            {isEditMode ? "Save changes" : "Submit review"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
