from django.contrib import admin

# Register your models here.


from .models import Booking, Event, EventRegistration, Invitation
admin.site.register(Booking)
admin.site.register(Event)  
admin.site.register(EventRegistration)
admin.site.register(Invitation)