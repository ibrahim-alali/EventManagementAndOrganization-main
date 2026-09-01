from django.utils.timezone import now
from events.models import Event


def get_event_candidates():
    """
    Base pool of events that are eligible for recommendation
    """


    return Event.objects.filter(
        is_public=True,
        status="scheduled",
    )