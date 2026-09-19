import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ratingsApi,
  type Review,
  type ReviewPayload,
  type UserEventReview,
  type UserVenueReview,
  type AverageRatingResponse,
  type RatingTargetType,
  type fetchUserReviewsParams,
} from "../api/ratings";
import { getToken } from "../utils/authToken";

/* =======================
   Query Keys
======================= */

const ratingKeys = {
  all: (token: string) => ["ratings", token] as const,
  eventReviews: (eventId: string, token: string) =>
    [...ratingKeys.all(token), "event", eventId] as const,
  venueReviews: (venueId: string, token: string) =>
    [...ratingKeys.all(token), "venue", venueId] as const,
  userEventReviews: (token: string, filters?: fetchUserReviewsParams) =>
    filters
      ? ([...ratingKeys.all(token), "user", "events", filters] as const)
      : ([...ratingKeys.all(token), "user", "events"] as const),

  userVenueReviews: (token: string, filters?: fetchUserReviewsParams) =>
    [...ratingKeys.all(token), "user", "venues", filters] as const,
  average: (targetType: RatingTargetType, targetId: string, token: string) =>
    [...ratingKeys.all(token), "average", targetType, targetId] as const,
};

/* =======================
   Queries
======================= */

/* ----- Event Reviews ----- */
export const useEventReviews = (eventId: string | null) => {
  const token = getToken();

  return useQuery<Review[]>({
    queryKey: ratingKeys.eventReviews(eventId ?? "", token!),
    queryFn: () => ratingsApi.fetchEventReviews(eventId!),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2,
  });
};

/* ----- Venue Reviews ----- */
export const useVenueReviews = (venueId: string | null) => {
  const token = getToken();

  return useQuery<Review[]>({
    queryKey: ratingKeys.venueReviews(venueId ?? "", token!),
    queryFn: () => ratingsApi.fetchVenueReviews(venueId!),
    enabled: !!venueId,
    staleTime: 1000 * 60 * 2,
  });
};

/* ----- User Reviews (Dashboard) ----- */
export const useUserEventReviews = (filters?: fetchUserReviewsParams) => {
  const token = getToken();

  return useQuery<UserEventReview[]>({
    queryKey: ratingKeys.userEventReviews(token!, filters),
    queryFn: () => ratingsApi.fetchUserEventReviews(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserVenueReviews = (filters?: fetchUserReviewsParams) => {
  const token = getToken();

  return useQuery<UserVenueReview[]>({
    queryKey: ratingKeys.userVenueReviews(token!, filters),
    queryFn: () => ratingsApi.fetchUserVenueReviews(filters),
    staleTime: 1000 * 60 * 5,
  });
};

/* ----- Average Rating ----- */
export const useAverageRating = (
  targetType: RatingTargetType,
  targetId: string | null
) => {
  const token = getToken();

  return useQuery<AverageRatingResponse>({
    queryKey: ratingKeys.average(targetType, targetId ?? "", token!),
    queryFn: () => ratingsApi.fetchAverageRating(targetId!, targetType),
    enabled: !!targetId,
    staleTime: 1000 * 60 * 5,
  });
};

/* =======================
   Mutations
======================= */

/* ----- Create Review ----- */
export const useCreateReview = (
  targetType: RatingTargetType,
  targetId: string
) => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => {
      return targetType === "event"
        ? ratingsApi.createEventReview(targetId, payload)
        : ratingsApi.createVenueReview(targetId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          targetType === "event"
            ? ratingKeys.eventReviews(targetId, token!)
            : ratingKeys.venueReviews(targetId, token!),
      });

      queryClient.invalidateQueries({
        queryKey: ratingKeys.average(targetType, targetId, token!),
      });

      queryClient.invalidateQueries({
        queryKey:
          targetType === "event"
            ? ratingKeys.userEventReviews(token!)
            : ratingKeys.userVenueReviews(token!),
      });
    },
  });
};

/* ----- Update Review ----- */
export const useUpdateReview = (
  targetType: RatingTargetType,
  targetId: string,
  reviewId: string
) => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => {
      return targetType === "event"
        ? ratingsApi.updateEventReview(targetId, reviewId, payload)
        : ratingsApi.updateVenueReview(targetId, reviewId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          targetType === "event"
            ? ratingKeys.eventReviews(targetId, token!)
            : ratingKeys.venueReviews(targetId, token!),
      });

      queryClient.invalidateQueries({
        queryKey: ratingKeys.average(targetType, targetId, token!),
      });

      queryClient.invalidateQueries({
        queryKey:
          targetType === "event"
            ? ratingKeys.userEventReviews(token!)
            : ratingKeys.userVenueReviews(token!),
      });
    },
  });
};

/* ----- Delete Review ----- */
export const useDeleteReview = (
  targetType: RatingTargetType,
  targetId: string,
  reviewId: string
) => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: () => {
      return targetType === "event"
        ? ratingsApi.deleteEventReview(targetId, reviewId)
        : ratingsApi.deleteVenueReview(targetId, reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          targetType === "event"
            ? ratingKeys.eventReviews(targetId, token!)
            : ratingKeys.venueReviews(targetId, token!),
      });

      queryClient.invalidateQueries({
        queryKey: ratingKeys.average(targetType, targetId, token!),
      });

      queryClient.invalidateQueries({
        queryKey:
          targetType === "event"
            ? ratingKeys.userEventReviews(token!)
            : ratingKeys.userVenueReviews(token!),
      });
    },
  });
};
