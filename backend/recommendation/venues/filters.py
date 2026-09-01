def apply_venue_context_filters(venues, context=None):
    if not context:
        return venues

    if context.get("min_capacity"):
        venues = venues.filter(capacity__gte=context["min_capacity"])

    if context.get("max_price_per_hour"):
        venues = venues.filter(price_per_hour__lte=context["max_price_per_hour"])

    return venues


