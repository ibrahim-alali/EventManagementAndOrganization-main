from django.db.models import Count
from events.models import EventRegistration, Event
from general.models import QRVerificationLog, Vote
from django.db.models import Sum

def score_events(events, user=None):
    scored = []

    for event in events:
        score = 0.0

        # 1. Popularity (approved registrations)
        approved_regs = EventRegistration.objects.filter(
            event=event,
            status="approved"
        ).count()
        score += min(approved_regs, 50) * 0.4

        # 2. Attendance Quality (QR scans)
        verified_attendance = QRVerificationLog.objects.filter(
            invitation__event=event,
            success=True
        ).count()
        score += min(verified_attendance, 30) * 0.6

        # 3. User Affinity
        if user and EventRegistration.objects.filter(
            event=event,
            attendee=user,
            status__in=["approved", "pending"]
        ).exists():
            score += 5.0

        # 4. Organizer Reputation (upvotes - downvotes)
        organizer_votes = Vote.objects.filter(target_user=event.organizer).aggregate(
            net_votes=Sum('value')
        )['net_votes'] or 0
        score += organizer_votes * 0.2  # Adjust weight as needed

        scored.append({
            "event": event,
            "score": round(score, 2)
        })

    return sorted(scored, key=lambda x: x["score"], reverse=True)
