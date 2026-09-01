# recommendation/models.py
from django.db import models
import uuid
from django.conf import settings

class UserInteraction(models.Model):
    INTERACTION_CHOICES = [
        ('visit_event', 'Visit Event'),
        ('visit_venue', 'Visit Venue'),
        ('review', 'Review'),
        ('vote', 'Vote'),
        ('booking', 'Booking'),
        ('registration', 'Registration'),
    ]   

    TARGET_CHOICES = [
        ('event', 'Event'),
        ('venue', 'Venue'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_CHOICES)
    target_type = models.CharField(max_length=10, choices=TARGET_CHOICES)
    target_id = models.UUIDField()
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    vote_value = models.SmallIntegerField(blank=True, null=True)  # 1 or -1
    timestamp = models.DateTimeField(auto_now_add=True)


    class Meta:
        indexes = [
            models.Index(fields=['user', 'target_type', 'target_id']),
            models.Index(fields=['target_type', 'target_id']),
        ]

    def __str__(self):
        return f"{self.user} -> {self.target_type}:{self.target_id} ({self.interaction_type})"
