from django.db import models
import uuid
from django.conf import settings
from venues.models import Venue

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='bookings')
    booker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    STATUS_CHOICES = [('pending','Pending'),('approved','Approved'),('rejected','Rejected'),('canceled','Canceled')]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='events')
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_public = models.BooleanField(default=True)
    EVENT_TYPE_CHOICES = [
        ('seminar', 'Seminar'),
        ('workshop', 'Workshop'),
        ('lecture', 'Lecture'),
        ('panel', 'Panel'),
        ('roundtable', 'Roundtable'),
        ('networking', 'Networking'),
        ('webinar', 'Webinar'),
        ('training', 'Training'),
        ('discussion', 'Discussion'),
        ('exhibition', 'Exhibition'),
        ('conference', 'Conference'),
    ]
    event_type = models.CharField(
        max_length=20,
        choices=EVENT_TYPE_CHOICES,
        default='seminar'
    )
    STATUS_CHOICES = [('scheduled','Scheduled'),('completed','Completed'),('canceled','Canceled')]
    archived = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    last_time_archived = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    


class EventRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    attendee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    form_data = models.JSONField(blank=True, null=True)
    STATUS_CHOICES = [('pending','Pending'),('approved','Approved'),('rejected','Rejected'),('canceled','Canceled')]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
class Invitation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='sent_invitations')
    receiver_phone = models.CharField(max_length=20)
    receiver_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_invitations')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='invitations')
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='invitations')
    qr_code_text = models.TextField(unique=True, editable=False)
    STATUS_CHOICES = [('created','Created'),('sent','Sent'),('delivered','Delivered'),('failed','Failed'),('used','Used'),('revoked','Revoked')]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    sent_via_whatsapp = models.BooleanField(default=False)
    qr_code_image = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    TICKET_TYPE_CHOICES = [('regular','Regular'),('vip','VIP'),('student','Student')]
    guest_name = models.CharField(max_length=100, blank=True, null=True)
    ticket_type = models.CharField(max_length=20, choices=TICKET_TYPE_CHOICES, default='regular')
    created_at = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        if not self.qr_code_text:
            self.qr_code_text = str(uuid.uuid4())
        super().save(*args, **kwargs)