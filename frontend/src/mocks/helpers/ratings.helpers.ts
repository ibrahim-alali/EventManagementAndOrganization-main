import type {
  Review,
  ReviewPayload,
  RatingTargetType,
  UserEventReview,
  UserVenueReview,
} from "../../api/ratings";
import { mockReviewers, mockReviews } from "../data/ratings.mock";

// ========================
// Helpers IDs / Current User
// ========================

// Generate unique ID
export const generateId = () => `r${Math.random().toString(36).substr(2, 9)}`;

// Simulate current logged-in reviewer (Bob Smith)
export const getCurrentReviewer = () => mockReviewers[1];

// ========================
// CRUD Helpers for Reviews
// ========================

// Add a new review
export const addReview = (
  targetType: RatingTargetType,
  targetId: string,
  payload: ReviewPayload
): Review => {
  const newReview: Review = {
    id: generateId(),
    reviewer: getCurrentReviewer(),
    target_type: targetType,
    target_id: targetId,
    rating: payload.rating,
    comment: payload.comment ?? "",
    is_own: true,
    created_at: new Date().toISOString(),
  };
  mockReviews.push(newReview);
  return newReview;
};

// Update a review by ID
export const updateReview = (
  reviewId: string,
  payload: ReviewPayload
): Review | undefined => {
  const review = mockReviews.find((r) => r.id === reviewId);
  if (review) {
    review.rating = payload.rating;
    review.comment = payload.comment ?? "";
    review.edited_at = new Date().toISOString();
  }
  return review;
};

// Delete a review by ID
export const deleteReview = (reviewId: string) => {
  const index = mockReviews.findIndex((r) => r.id === reviewId);
  if (index !== -1) {
    mockReviews.splice(index, 1);
    return true;
  }
  return false;
};

// Get all reviews for a specific target
export const getReviewsForTarget = (
  targetType: RatingTargetType,
  targetId: string
) =>
  mockReviews
    .filter((r) => r.target_type === targetType && r.target_id === targetId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

// Compute average rating for a list of reviews
export const computeAverage = (reviews: Review[]) => {
  const count = reviews.length;
  const average_rating = count
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;
  return { average_rating: parseFloat(average_rating.toFixed(1)), count };
};

// ========================
// Helpers for User Reviews
// ========================

// Fetch reviews created by current user
export const getUserEventReviews = (filters?: { search?: string; sort?: string }): UserEventReview[] => {
  let reviews = mockReviews
    .filter((r) => r.is_own && r.target_type === "event")
    .map((r) => ({
      id: r.id,
      event_id: r.target_id,
      event_title: `Event ${r.target_id}`,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
    }));

  if (filters?.search) {
    reviews = reviews.filter((r) =>
      r.event_title.toLowerCase().includes(filters.search!.toLowerCase())
    );
  }

  if (filters?.sort === "highest") {
    reviews = reviews.sort((a, b) => b.rating - a.rating);
  } else if (filters?.sort === "lowest") {
    reviews = reviews.sort((a, b) => a.rating - b.rating);
  } else {
    reviews = reviews.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return reviews;
};

export const getUserVenueReviews = (filters?: { search?: string; sort?: string }): UserVenueReview[] => {
  let reviews = mockReviews
    .filter((r) => r.is_own && r.target_type === "venue")
    .map((r) => ({
      id: r.id,
      venue_id: r.target_id,
      venue_name: `Venue ${r.target_id}`, // Fake name
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
    }));

  if (filters?.search) {
    reviews = reviews.filter((r) =>
      r.venue_name.toLowerCase().includes(filters.search!.toLowerCase())
    );
  }

  if (filters?.sort === "highest") {
    reviews = reviews.sort((a, b) => b.rating - a.rating);
  } else if (filters?.sort === "lowest") {
    reviews = reviews.sort((a, b) => a.rating - b.rating);
  } else {
    reviews = reviews.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return reviews;
};

// ========================
// Fetch Average Rating for Target
// ========================
export const getAverageRatingForTarget = (
  targetType: RatingTargetType,
  targetId: string
) => {
  const reviews = getReviewsForTarget(targetType, targetId);
  return computeAverage(reviews);
};
