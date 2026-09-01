def apply_event_context_filters(events, context=None):
    if not context:
        return events

    if context.get("date_from"):
        events = events.filter(date__gte=context["date_from"])

    if context.get("date_to"):
        events = events.filter(date__lte=context["date_to"])

    if context.get("venue_id"):
        events = events.filter(venue_id=context["venue_id"])

    return events