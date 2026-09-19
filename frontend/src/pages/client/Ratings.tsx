import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
    useUserEventReviews,
    useUserVenueReviews,
    useDeleteReview,
} from "../../hooks/useRatings";

import type {
    UserEventReview,
    UserVenueReview,
    RatingTargetType,
    Review,
} from "../../api/ratings";

import { RatingList } from "../../components/rating/RatingList";
import { RatingForm } from "../../components/rating/RatingForm";
import { RatingFilter } from "../../components/rating/RatingFilter";
import { ModalPortal } from "../../components/common/ModalPortal";
import { Heart, Star } from "lucide-react";

type RatingsDashboardProps = {
    type: RatingTargetType; // "event" | "venue"
};

export const Ratings: React.FC<RatingsDashboardProps> = ({type}) => {
    /* ===============================
          State
    ================================ */
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<"latest" | "highest" | "lowest">("latest");

    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    /* ===============================
          Fetch Reviews
    ================================ */
    const eventReviewsQuery = useUserEventReviews({search, sort});
    const venueReviewsQuery = useUserVenueReviews({search, sort});

    const reviewsQuery = type === "event" ? eventReviewsQuery : venueReviewsQuery;

    const reviews = reviewsQuery.data ?? [];

    /* ===============================
          Delete Mutation
    ================================ */
    const deleteMutation = useDeleteReview(
        type,
        deleteTargetId ?? "",
        deleteReviewId ?? ""
    );

    const handleDelete = (reviewId: string) => {
        const review = adaptedReviews.find((r) => r.id === reviewId);
        if (!review) return;

        setDeleteReviewId(reviewId);
        setDeleteTargetId(review.target_id);
    };

    const confirmDelete = () => {
        if (!deleteReviewId || !deleteTargetId) return;

        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Review deleted successfully 🗑️");
                setDeleteReviewId(null);
                setDeleteTargetId(null);
            },
            onError: () => {
                toast.error("Failed to delete review");
            },
        });
    };

    /* ===============================
          Edit Handlers
    ================================ */
    const handleEdit = (review: Review) => {
        setEditingReview(review);
    };

    const closeEditForm = () => {
        setEditingReview(null);
    };

    const DASHBOARD_REVIEWER = {
        id: 0,
        full_name: "",
        email: "",
        role: "client",
    };

    const adaptedReviews: Review[] = reviews.map((review) => {
        if (type === "event") {
            const r = review as UserEventReview;

            return {
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                created_at: r.created_at,
                edited_at: null,

                target_type: "event" as RatingTargetType,
                target_id: r.event_id,

                reviewer: {
                    ...DASHBOARD_REVIEWER,
                    full_name: r.event_title,
                },

                is_own: true,
                source: "event",
                event_id: r.event_id,
            };
        }

        const r = review as UserVenueReview;

        return {
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            edited_at: null,

            target_type: "venue" as RatingTargetType,
            target_id: r.venue_id,

            reviewer: {
                ...DASHBOARD_REVIEWER,
                full_name: r.venue_name,
            },

            is_own: true,
            source: "venue",
            venue_id: r.venue_id,
        };
    });

    /* ===============================
          Render
    ================================ */
    return (
        <section className="px-6 py-8">
            {/* ===== Header ===== */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 font-nata-sans-bd text-2xl text-gray-900">
                    {type === "venue" ? <Star className="h-6 w-6"/> : <Heart className="h-6 w-6"/>}
                    {type === "event" ? "Rating Events" : "Rating Venues"}
                </h2>

                <Link
                    to={type === "event" ? "/client/events" : "/client/venues"}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-500
                     px-5 py-2.5 font-nata-sans-md text-sm text-white
                     transition hover:bg-violet-600 hover:opacity-90
                     hover:shadow-md"
                >
                    Browse {type === "event" ? "Events" : "Venues"}
                </Link>
            </div>

            {/* ===== Filter / Search ===== */}
            <RatingFilter
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
            />

            {/* ===== Reviews List ===== */}
            <div
                className="mt-6">
                {!editingReview && (
                    <RatingList
                        reviews={adaptedReviews}
                        isLoading={reviewsQuery.isLoading}
                        onEdit={handleEdit}
                        onDelete={(reviewId: string) => handleDelete(reviewId)}
                    />
                )}
            </div>

            {/* ===== Edit Form ===== */}
            <AnimatePresence>
                {editingReview && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 20}}
                        className="mt-8 rounded-2xl border border-violet-300 bg-violet-200/50 p-6"
                    >
                        <RatingForm
                            targetType={type}
                            targetId={editingReview.target_id}
                            initialReview={editingReview as any}
                            onClose={closeEditForm}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== Delete Modal ===== */}
            <AnimatePresence>
                {deleteReviewId && (
                    <ModalPortal>
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >
                            <motion.div
                                className="w-full max-w-sm rounded-2xl bg-violet-50 p-6"
                                initial={{scale: 0.95, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                exit={{scale: 0.95, opacity: 0}}
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
                                        onClick={() => {
                                            setDeleteReviewId(null);
                                            setDeleteTargetId(null);
                                        }}
                                        className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={confirmDelete}
                                        disabled={deleteMutation.isPending}
                                        className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </ModalPortal>
                )}
            </AnimatePresence>
        </section>
    );
};
