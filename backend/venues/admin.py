from django.contrib import admin

# Register your models here.


from .models import Venue, VenueImage, VenueSchedule


admin.site.register(Venue)
admin.site.register(VenueImage)
admin.site.register(VenueSchedule)