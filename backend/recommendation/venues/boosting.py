def apply_venue_business_rules(scored_venues):
    """
    Apply business rules / boosting for venues.
    """
    for item in scored_venues:
        venue = item['venue']

        # Boost featured venues
        if hasattr(venue, 'is_featured') and venue.is_featured:
            item['score'] *= 1.2

        # Penalize venues with many negative reviews
        if hasattr(venue, 'reviews'):
            negative_reviews = venue.reviews.filter(rating__lte=2).count()
            if negative_reviews > 5:
                item['score'] *= 0.8

    # Final sorting
    return sorted(scored_venues, key=lambda x: x['score'], reverse=True)
