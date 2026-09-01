from rest_framework import serializers
import uuid
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile

from general.views import calculate_average_rating
from .models import Event, Booking, EventRegistration, Invitation
from accounts.models import User
from venues.models import Venue
from venues.serializers import VenueImageSerializer

class OrganizerSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']


class VenueSimpleSerializer(serializers.ModelSerializer):
    images = VenueImageSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    class Meta:
        model = Venue
        fields = ['id', 'name', 'location_geo', 'capacity', 'images', 'average_rating']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'venue')
    
    
class VenueMoreSimpleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Venue
        fields = [ 'id', 'name', 'description', 'capacity', 'price_per_hour', 'location_geo']
        
class BookingSerializer(serializers.ModelSerializer):
    booker = serializers.HiddenField(default=serializers.CurrentUserDefault())
    venue = VenueMoreSimpleSerializer(read_only=True)
    venue_id = serializers.UUIDField(write_only=True)

    def create(self, validated_data):
        venue_id = validated_data.pop('venue_id')
        try:
            venue = Venue.objects.get(id=venue_id)
        except Venue.DoesNotExist:
            raise serializers.ValidationError({'venue_id': 'Venue not found'})
        validated_data['venue'] = venue
        return super().create(validated_data)

    class Meta:
        model = Booking
        fields = [
            'id', 'venue', 'venue_id', 'booker', 'date', 'start_time', 'end_time',
            'status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'booker', 'status', 'created_at', 'updated_at']

class EventSerializerForClient(serializers.ModelSerializer):
    type = serializers.CharField(source='event_type')
    capacity = serializers.SerializerMethodField()
    attendance_count = serializers.SerializerMethodField()
    class Meta:
        model = Event
        fields = [
            'title', 'description',
            'date', 'start_time', 'end_time','type', 'attendance_count', 'capacity'
        ]
        read_only_fields = ['organizer']
    def get_attendance_count(self,obj):
        return EventRegistration.objects.filter(event=obj).count()
    def get_capacity(self, obj):
        return obj.venue.capacity if obj.venue else None
    

 

class EventRegistrationSerializer(serializers.ModelSerializer):
    attendee = serializers.HiddenField(default=serializers.CurrentUserDefault())
    event_data = EventSerializerForClient(source='event', read_only=True)
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event','event_data', 'attendee', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'attendee', 'status', 'created_at', 'updated_at']

    def validate(self, attrs):
        # ensure user has not already registered for this event
        request = self.context.get('request')
        user = None
        if request:
            user = request.user

        event = attrs.get('event')
        # when creating, if a registration exists for this user and event raise
        if request and request.method in ('POST',):
            if EventRegistration.objects.filter(event=event, attendee=user).exists():
                raise serializers.ValidationError('You have already registered for this event')

        return attrs


class AttendeeSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']


class EventRegistrationForOrganizerSerializer(serializers.ModelSerializer):
    attendee = AttendeeSimpleSerializer(read_only=True)
    event_data = EventSerializerForClient(source='event', read_only=True)
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event','event_data', 'attendee', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'attendee', 'status', 'created_at', 'updated_at']


class VenueSimpleSerializerForOrganizer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    class Meta:
        model = Venue
        fields = ['id', 'name', 'description', 'location_geo', 'capacity', 'average_rating']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'venue')
    

class EventSerializerForOrganizer(serializers.ModelSerializer):
    type = serializers.CharField(source='event_type')
    average_rating = serializers.SerializerMethodField()
    attendance_count = serializers.SerializerMethodField()
    venue = VenueSimpleSerializerForOrganizer(read_only=True)


    status = serializers.SerializerMethodField(source='archived') 
    class Meta:
        model = Event
        fields = [
            'id', 'organizer', 'booking', 'venue', 'title', 'description',
            'date', 'start_time', 'end_time','type','status',
            'created_at', 'updated_at', 'average_rating', 'attendance_count', 'last_time_archived'
        ]
        read_only_fields = ['organizer']
    def to_internal_value(self, data):
        internal = super().to_internal_value(data)

        venue_data = data.get("venue")

        if venue_data is not None:
            # إذا كان object يحتوي على id
            if isinstance(venue_data, dict):
                venue_id = venue_data.get("id")
            else:
                # إذا كان مجرد ID
                venue_id = venue_data

            try:
                venue_obj = Venue.objects.get(id=venue_id)
            except Venue.DoesNotExist:
                raise serializers.ValidationError({"venue": "Venue not found."})

            internal["venue"] = venue_obj

        return internal
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'event')
    
    def get_attendance_count(self,obj):
        return EventRegistration.objects.filter(event=obj).count()
    
    def get_status(self, obj):
        return "archived" if obj.archived else "active"

        
class EventSerializer(serializers.ModelSerializer):
    is_registered = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    organizer = OrganizerSimpleSerializer(read_only=True)
    type = serializers.CharField(source='event_type')
    venue = VenueSimpleSerializer(read_only=True)
    attendance_count = serializers.SerializerMethodField()
    capacity = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'organizer', 'booking', 'venue', 'title', 'description',
            'date', 'start_time', 'end_time', 'is_public', 'status','type','archived',
            'created_at', 'updated_at', 'average_rating','is_registered', 'attendance_count','capacity'
        ]
        read_only_fields = ['organizer']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'event')
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            return EventRegistration.objects.filter(event=obj, attendee=user).exists()
        return False
    def get_attendance_count(self,obj):
        return EventRegistration.objects.filter(event=obj).count()
    def get_capacity(self, obj):
        return obj.venue.capacity if obj.venue else None
        
        
class EventSerializerDetails(serializers.ModelSerializer):
    organizer = OrganizerSimpleSerializer(read_only=True)
    venue = VenueSimpleSerializer(read_only=True)
    is_registered = serializers.SerializerMethodField()
    type = serializers.CharField(source='event_type')
    #average_rating = serializers.SerializerMethodField()    
    class Meta:
        model = Event
        fields = [
            'id', 'organizer', 'booking', 'venue', 'title', 'description',
            'date', 'start_time', 'end_time','type','archived',
            'created_at', 'updated_at', 'is_registered', #'average_rating'
        ]
        read_only_fields = ['organizer']
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            return EventRegistration.objects.filter(event=obj, attendee=user).exists()
        return False
    #def get_average_rating(self, obj):
        #return calculate_average_rating(obj.id, 'event')

class SimpleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title']
        # لا نحتاج write_only أو read_only هنا لأننا سنتحكم بها من المحلل الأب

class InvitationSerializer(serializers.ModelSerializer):
    sender = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    # نستخدم PrimaryKeyRelatedField للسماح بإرسال الـ ID فقط عند الـ POST
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = Invitation
        fields = [
            'id', 'sender', 'receiver_phone', 'event',
            'qr_code_text', 'qr_code_image', 'status', 'guest_name', 
            'ticket_type', 'sent_via_whatsapp', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'qr_code_image', 'status', 'created_at']

    def to_representation(self, instance):
        """
        هذه الدالة تتحكم في شكل البيانات عند العرض (GET)
        """
        representation = super().to_representation(instance)
        # نقوم باستبدال الـ ID بكائن يحتوي على الـ ID والـ Title
        representation['event'] = SimpleEventSerializer(instance.event).data
        return representation

    def create(self, validated_data):
        # الكود الخاص بك لإنشاء الـ QR Code صحيح منطقياً ولكنه يحتاج تحسين (انظر النقد بالأسفل)
        invitation = super().create(validated_data)
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(invitation.qr_code_text)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')

        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        file_name = f'qr_{invitation.qr_code_text}.png'
        invitation.qr_code_image.save(file_name, ContentFile(buffer.getvalue()), save=True)

        return invitation