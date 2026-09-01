from recommendation.events.candidates import get_event_candidates
from recommendation.events.filters import apply_event_context_filters
from recommendation.events.scoring import score_events


from recommendation.events.boosting import apply_event_business_rules

def get_recommended_events(user=None, context=None):
    events = get_event_candidates()
    events = apply_event_context_filters(events, context)
    events = score_events(events, user=user)
    events = apply_event_business_rules(events)  # <-- new
    return events
