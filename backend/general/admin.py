from django.contrib import admin

# Register your models here.
from .models import QRVerificationLog, Review, Notification, Vote

admin.site.register(QRVerificationLog)
admin.site.register(Review)
admin.site.register(Notification)
admin.site.register(Vote)

