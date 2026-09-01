from events.models import Booking
from general.models import Review, Vote
from django.db.models import Avg, Sum

def score_venues(venues, user=None, context=None):
    scored = []

    for venue in venues:
        score = 0.0

        # 1. Popularity (approved bookings)
        approved_bookings = Booking.objects.filter(
            venue=venue,
            status="approved"
        ).count()
        score += min(approved_bookings, 20) * 0.5

        # 2. User Affinity
        if user and Booking.objects.filter(
            venue=venue,
            booker=user,
            status="approved"
        ).exists():
            score += 5.0

        # 3. Reviews
        reviews = Review.objects.filter(target_type="venue", target_id=venue.id)
        if reviews.exists():
            avg_rating = reviews.aggregate(avg=Avg("rating"))["avg"] or 0
            score += float(avg_rating) * 1.5
            score += min(reviews.count(), 10) * 0.3

        # 4. Provider Reputation (upvotes - downvotes)
        provider_votes = Vote.objects.filter(target_user=venue.provider).aggregate(
            net_votes=Sum('value')
        )['net_votes'] or 0
        score += provider_votes * 0.2  # Adjust weight as needed

        # 5. Price Fit
        if context and context.get("max_price_per_hour") and venue.price_per_hour:
            diff = abs(float(venue.price_per_hour) - context["max_price_per_hour"])
            score += max(0, 5 - diff / 100)

        scored.append({
            "venue": venue,
            "score": round(score, 2)
        })

    return sorted(scored, key=lambda x: x["score"], reverse=True)
