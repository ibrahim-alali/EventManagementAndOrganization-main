from recommendation.venues.candidates import get_venue_candidates
from recommendation.venues.filters import apply_venue_context_filters
from recommendation.venues.scoring import score_venues

from recommendation.venues.boosting import apply_venue_business_rules

def get_recommended_venues(user=None, context=None):
    venues = get_venue_candidates()
    venues = apply_venue_context_filters(venues, context)
    venues = score_venues(venues, user=user, context=context)
    venues = apply_venue_business_rules(venues)  # <-- new
    return venues
