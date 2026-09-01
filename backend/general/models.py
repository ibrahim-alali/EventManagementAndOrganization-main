from django.db import models
import uuid
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from events.models import Invitation    



class QRVerificationLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invitation = models.ForeignKey(Invitation, on_delete=models.CASCADE, related_name='verification_logs')
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    verified_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=True)
    note = models.TextField(blank=True, null=True)
    
    
class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.TextField()
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    TARGET_CHOICES = [('venue','Venue'),('event','Event')]
    target_type = models.CharField(max_length=10, choices=TARGET_CHOICES)
    target_id = models.UUIDField()  # FK-like behavior enforced in app
    rating = models.DecimalField(
    max_digits=2,  # إجمالي الأرقام (مثل 5.5 يحتاج 3: 5 و . و 5)
    decimal_places=1,  # عدد الأرقام بعد الفاصلة (مثل 0.5 أو 4.5)
    validators=[
        MinValueValidator(0),
        MaxValueValidator(5)
    ])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(blank=True, null=True)


class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    voter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='votes_cast')
    target_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='votes_received')
    VALUE_CHOICES = ((1, 'Upvote'), (-1, 'Downvote'))
    value = models.SmallIntegerField(choices=VALUE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['voter', 'target_user'], name='unique_vote_per_pair')
        ]

    def __str__(self):
        return f'Vote({self.voter} -> {self.target_user}: {self.value})'