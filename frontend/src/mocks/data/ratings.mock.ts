import type {
    Review,
    Reviewer,
    AverageRatingResponse,
} from "../../api/ratings";
import {randomDate} from "../helpers/random.helpers";

// ========================
// Fake Reviewers
// ========================
export const mockReviewers: Reviewer[] = [
    {
        id: 1,
        full_name: "Alice Johnson",
        email: "alice@example.com",
        role: "client",
    },
    {id: 2, full_name: "Bob Smith", email: "bob@example.com", role: "client"},
    {
        id: 3,
        full_name: "Charlie Lee",
        email: "charlie@example.com",
        role: "client",
    },
    {
        id: 4,
        full_name: "Diana King",
        email: "diana@example.com",
        role: "client",
    },
    {
        id: 5,
        full_name: "Ethan Wright",
        email: "ethan@example.com",
        role: "client",
    },
];

// ========================
// Fake Reviews (10 items)
// ========================
export const mockReviews: Review[] = [
    {
        id: "r1",
        reviewer: mockReviewers[0],
        target_type: "event",
        target_id: "e1",
        rating: 4.5,
        comment: "Great event, had a lot of fun!",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r2",
        reviewer: mockReviewers[1],
        target_type: "event",
        target_id: "e1",
        rating: 5,
        comment: "Amazing organization and venue!",
        is_own: true,
        created_at: randomDate(),
        edited_at: null,
    },
    {
        id: "r3",
        reviewer: mockReviewers[3],
        target_type: "event",
        target_id: "e1",
        rating: 4,
        comment: "Good performances, enjoyed it.",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r4",
        reviewer: mockReviewers[1],
        target_type: "event",
        target_id: "e2",
        rating: 3,
        comment: "It was okay, expected more.",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r5",
        reviewer: mockReviewers[2],
        target_type: "event",
        target_id: "e2",
        rating: 4,
        comment: "Fun experience, recommend to friends.",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r6",
        reviewer: mockReviewers[2],
        target_type: "venue",
        target_id: "v1",
        rating: 3.5,
        comment: "Nice, but could be cleaner.",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r7",
        reviewer: mockReviewers[4],
        target_type: "venue",
        target_id: "v1",
        rating: 2.5,
        comment: "Not very comfortable seating.",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r8",
        reviewer: mockReviewers[0],
        target_type: "venue",
        target_id: "v1",
        rating: 4.5,
        comment: "Lovely ambiance and staff.",
        is_own: true,
        created_at: randomDate(),
        edited_at: null,
    },
    {
        id: "r9",
        reviewer: mockReviewers[3],
        target_type: "venue",
        target_id: "v2",
        rating: 5,
        comment: "Excellent service and food!",
        is_own: false,
        created_at: randomDate(),
    },
    {
        id: "r10",
        reviewer: mockReviewers[4],
        target_type: "venue",
        target_id: "v2",
        rating: 4,
        comment: "Good experience overall.",
        is_own: true,
        created_at: randomDate(),
        edited_at: null,
    },
];

// ========================
// Average Rating Placeholder
// ========================
export const mockAverageRating: AverageRatingResponse = {
    average_rating: parseFloat(
        (
            mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length / 2
        ).toFixed(1)
    ),
    count: mockReviews.length,
};
