import axiosClient from "./axiosClient";

/* =======================
   Types & Interfaces
======================= */

export type RatingTargetType = "event" | "venue";

/* ---------- Reviewer ---------- */
export interface Reviewer {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    role: string;
}

/* ---------- Review ---------- */
export interface Review {
    id: string;
    reviewer: Reviewer;
    target_type: RatingTargetType;
    target_id: string;
    rating: number;          // 1 → 5 (0.5 steps supported)
    comment: string;
    is_own: boolean;
    created_at: string;
    edited_at?: string | null;
}

/* ---------- Create / Update Review ---------- */
export interface ReviewPayload {
    target_type: RatingTargetType;
    target_id: string;
    rating: number;
    comment: string;
}

/* ---------- User Event Review ---------- */
export interface UserEventReview {
    id: string;
    event_id: string;
    event_title: string;
    rating: number;
    comment: string;
    created_at: string;
}

/* ---------- User Venue Review ---------- */
export interface UserVenueReview {
    id: string;
    venue_id: string;
    venue_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

/* ---------- Average Rating ---------- */
export interface AverageRatingResponse {
    average_rating: number;
    count: number;
}

// ===== Params =====
export interface fetchUserReviewsParams {
    search?: string;
    sort?: string;
}

/* =======================
   API Methods
======================= */

export const ratingsApi = {
    /* ===== Event Reviews ===== */

    fetchEventReviews: async (eventId: string): Promise<Review[]> => {
        const res = await axiosClient.get(`/events/${eventId}/reviews`);
        return res.data;
    },

    createEventReview: async (eventId: string, payload: ReviewPayload): Promise<Review> => {
        const res = await axiosClient.post(
            `/events/${eventId}/reviews`,
            payload
        );
        return res.data;
    },

    updateEventReview: async (eventId: string, reviewId: string, payload: ReviewPayload): Promise<Review> => {
        const res = await axiosClient.put(
            `/events/${eventId}/reviews/${reviewId}`,
            payload
        );
        return res.data;
    },

    deleteEventReview: async (eventId: string, reviewId: string): Promise<void> => {
        await axiosClient.delete(
            `/events/${eventId}/reviews/${reviewId}`
        );
    },

    /* ===== Venue Reviews ===== */

    fetchVenueReviews: async (venueId: string): Promise<Review[]> => {
        const res = await axiosClient.get(`/venues/${venueId}/reviews`);
        return res.data;
    },

    createVenueReview: async (venueId: string, payload: ReviewPayload): Promise<Review> => {
        const res = await axiosClient.post(
            `/venues/${venueId}/reviews`,
            payload
        );
        return res.data;
    },

    updateVenueReview: async (venueId: string, reviewId: string, payload: ReviewPayload): Promise<Review> => {
        const res = await axiosClient.put(
            `/venues/${venueId}/reviews/${reviewId}`,
            payload
        );
        return res.data;
    },

    deleteVenueReview: async (venueId: string, reviewId: string): Promise<void> => {
        await axiosClient.delete(
            `/venues/${venueId}/reviews/${reviewId}`
        );
    },

    /* ===== User Reviews ===== */

    fetchUserEventReviews: async (filters?: fetchUserReviewsParams): Promise<UserEventReview[]> => {
        const params = new URLSearchParams();

        if (filters?.search) params.append("search", filters.search);
        if (filters?.sort) params.append("sort", filters.sort);

        const res = await axiosClient.get(
            `/general/user-event-reviews?${params.toString()}`
        );
        return res.data;
    },

    fetchUserVenueReviews: async (filters?: fetchUserReviewsParams): Promise<UserVenueReview[]> => {
        const params = new URLSearchParams();

        if (filters?.search) params.append("search", filters.search);
        if (filters?.sort) params.append("sort", filters.sort);

        const res = await axiosClient.get(
            `/general/user-venue-reviews?${params.toString()}`
        );
        return res.data;
    },

    /* ===== Average Ratings ===== */

    fetchAverageRating: async (targetId: string, targetType: RatingTargetType): Promise<AverageRatingResponse> => {
        const res = await axiosClient.get(
            `/general/average-ratings`,
            {
                params: {
                    id: targetId,
                    type: targetType,
                },
            }
        );
        return res.data;
    },
};