import { http, HttpResponse } from "msw";
import { ENV } from "../../config/env";
import type { ReviewPayload } from "../../api/ratings";
import {
  addReview,
  updateReview,
  deleteReview,
  getReviewsForTarget,
  getUserEventReviews,
  getUserVenueReviews,
  getAverageRatingForTarget,
} from "../helpers/ratings.helpers";

export const ratingsHandlers = [
  // ========================
  // Event Reviews
  // ========================

  // Fetch Event Reviews
  http.get(`${ENV.API_BASE_URL}/events/:eventId/reviews`, ({ params }) => {
    const eventId = Array.isArray(params.eventId)
      ? params.eventId[0]
      : params.eventId;
    if (!eventId)
      return HttpResponse.json(
        { message: "Missing eventId " },
        { status: 400 }
      );
    const reviews = getReviewsForTarget("event", eventId);
    return HttpResponse.json(reviews);
  }),

  // Create Event Review
  http.post(
    `${ENV.API_BASE_URL}/events/:eventId/reviews`,
    async ({ params, request }) => {
      const body = (await request.json()) as ReviewPayload;
      const eventId = Array.isArray(params.eventId)
        ? params.eventId[0]
        : params.eventId;
      if (!eventId)
        return HttpResponse.json(
          { message: "Missing eventId " },
          { status: 400 }
        );
      const newReview = addReview("event", eventId, body);
      return HttpResponse.json(newReview);
    }
  ),

  // Update Event Review
  http.put(
    `${ENV.API_BASE_URL}/events/:eventId/reviews/:reviewId`,
    async ({ params, request }) => {
      const body = (await request.json()) as ReviewPayload;
      const reviewId = Array.isArray(params.reviewId)
        ? params.reviewId[0]
        : params.reviewId;
      if (!reviewId)
        return HttpResponse.json(
          { message: "Missing reviewId " },
          { status: 400 }
        );
      const updated = updateReview(reviewId, body);
      if (!updated)
        return HttpResponse.json(
          { message: "Review not found" },
          { status: 404 }
        );
      return HttpResponse.json(updated);
    }
  ),

  // Delete Event Review
  http.delete(
    `${ENV.API_BASE_URL}/events/:eventId/reviews/:reviewId`,
    ({ params }) => {
      const reviewId = Array.isArray(params.reviewId)
        ? params.reviewId[0]
        : params.reviewId;
      if (!reviewId)
        return HttpResponse.json(
          { message: "Missing reviewId " },
          { status: 400 }
        );
      const success = deleteReview(reviewId);
      if (!success)
        return HttpResponse.json(
          { message: "Review not found" },
          { status: 404 }
        );
      return HttpResponse.json({});
    }
  ),

  // ========================
  // Venue Reviews
  // ========================

  // Fetch Venue Reviews
  http.get(`${ENV.API_BASE_URL}/venues/:venueId/reviews`, ({ params }) => {
    const venueId = Array.isArray(params.venueId)
      ? params.venueId[0]
      : params.venueId;
    if (!venueId)
      return HttpResponse.json(
        { message: "Missing venueId " },
        { status: 400 }
      );
    const reviews = getReviewsForTarget("venue", venueId);
    return HttpResponse.json(reviews);
  }),

  // Create Venue Review
  http.post(
    `${ENV.API_BASE_URL}/venues/:venueId/reviews`,
    async ({ params, request }) => {
      const body = (await request.json()) as ReviewPayload;
      const venueId = Array.isArray(params.venueId)
        ? params.venueId[0]
        : params.venueId;
      if (!venueId)
        return HttpResponse.json(
          { message: "Missing venueId " },
          { status: 400 }
        );
      const newReview = addReview("venue", venueId, body);
      return HttpResponse.json(newReview);
    }
  ),

  // Update Venue Review
  http.put(
    `${ENV.API_BASE_URL}/venues/:venueId/reviews/:reviewId`,
    async ({ params, request }) => {
      const body = (await request.json()) as ReviewPayload;
      const reviewId = Array.isArray(params.reviewId)
        ? params.reviewId[0]
        : params.reviewId;
      if (!reviewId)
        return HttpResponse.json(
          { message: "Missing reviewId " },
          { status: 400 }
        );
      const updated = updateReview(reviewId, body);
      if (!updated)
        return HttpResponse.json(
          { message: "Review not found" },
          { status: 404 }
        );
      return HttpResponse.json(updated);
    }
  ),

  // Delete Venue Review
  http.delete(
    `${ENV.API_BASE_URL}/venues/:venueId/reviews/:reviewId`,
    ({ params }) => {
      const reviewId = Array.isArray(params.reviewId)
        ? params.reviewId[0]
        : params.reviewId;
      if (!reviewId)
        return HttpResponse.json(
          { message: "Missing reviewId " },
          { status: 400 }
        );
      const success = deleteReview(reviewId);
      if (!success)
        return HttpResponse.json(
          { message: "Review not found" },
          { status: 404 }
        );
      return HttpResponse.json({});
    }
  ),

  // ========================
  // User Reviews
  // ========================

  // Fetch current user's event reviews
  http.get(`${ENV.API_BASE_URL}/general/user-event-reviews`, ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search") ?? undefined;
    const sort = url.searchParams.get("sort") ?? undefined;

    return HttpResponse.json(getUserEventReviews({ search, sort }));
  }),

  // Fetch current user's venue reviews
  http.get(`${ENV.API_BASE_URL}/general/user-venue-reviews`, ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search") ?? undefined;
    const sort = url.searchParams.get("sort") ?? undefined;
    return HttpResponse.json(getUserVenueReviews({ search, sort }));
  }),

  // ========================
  // Average Ratings
  // ========================

  http.get(`${ENV.API_BASE_URL}/general/average-ratings`, ({ request }) => {
    const url = new URL(request.url);
    const targetId = url.searchParams.get("id")!;
    const targetType = url.searchParams.get("type") as "event" | "venue";
    const avg = getAverageRatingForTarget(targetType, targetId);
    return HttpResponse.json(avg);
  }),
];
