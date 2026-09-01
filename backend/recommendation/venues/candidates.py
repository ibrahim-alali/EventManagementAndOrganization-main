from venues.models import Venue

def get_venue_candidates():
    """
    Base pool of venues that are eligible for recommendation
    """
    return Venue.objects.filter(status="active")
