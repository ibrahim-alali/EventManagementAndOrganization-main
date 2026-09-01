def apply_event_business_rules(scored_events):
    """
    Apply business rules / boosting for events.
    """
    for item in scored_events:
        event = item['event']

        # Boost trending events (مثلاً أكثر من 20 تسجيل)
        approved_regs = event.registrations.filter(status="approved").count()
        if approved_regs > 20:
            item['score'] *= 1.2

        # Penalize canceled or low-attended events
        if event.status == 'canceled' or approved_regs < 2:
            item['score'] *= 0.7

    # Final sorting
    return sorted(scored_events, key=lambda x: x['score'], reverse=True)
