from rest_framework import serializers 
from general.views import calculate_average_rating
from venues.models import Venue, VenueImage, VenueSchedule
from accounts.models import User

from events.models import Booking

# simple serializer for the venue provider
class ProviderSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']
# image serializer 
class VenueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueImage
        fields = ['id', 'image_url', 'alt_text', 'is_cover', 'created_at']
        
        
# schedule serializer
class VenueScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueSchedule
        fields = ['id', 'venue', 'date', 'start_time', 'end_time', 'is_blocked', 'created_at']
        
        
        
class BookingserializerForClient(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'id',   'date', 'start_time', 'end_time',
            'created_at', 'updated_at'
        ]
        
# venue serializer for the venue provider 
class VenueSerializerForProvider(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    class Meta:
        model = Venue
        fields =[
            'id', 'provider', 'name', 'description', 'location_geo',
            'capacity', 'price_per_hour', 'status', 'created_at', 'updated_at', 'average_rating'
        ]
        read_only_fields = ['provider']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'venue')
    
    
# venue serializer for the venue provider 
class VenueCreateSerializerForProvider(serializers.ModelSerializer): 
    class Meta:
        model = Venue
        fields =[
            'id', 'provider', 'name', 'description', 'location_geo',
            'capacity', 'price_per_hour', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['provider']
    

# for provider 
class VenueDetailsSerializerForProvider(serializers.ModelSerializer): 
    average_rating = serializers.SerializerMethodField()  
    images = VenueImageSerializer(many=True,read_only=True)
    booking = serializers.SerializerMethodField()
    class Meta:
        model = Venue
        fields =[
            'id', 'provider', 'name', 'description', 'location_geo',
            'capacity', 'price_per_hour', 'created_at', 'updated_at',
            'images', 'average_rating','booking'
        ]
        read_only_fields = ['provider']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'venue')
    
    def get_booking(self, obj):
        approved_bookings = obj.bookings.filter(status='approved')
        return BookingserializerForClient(
            approved_bookings,
            many=True
        ).data
        
# for public (clinet or visitor)   
class VenueSerializer(serializers.ModelSerializer): 
    average_rating = serializers.SerializerMethodField()  
    images = VenueImageSerializer(many=True,read_only=True)

    class Meta:
        model = Venue
        fields =[
            'id', 'provider', 'name', 'description', 'location_geo',
            'capacity', 'price_per_hour', 'created_at', 'updated_at',
            'images', 'average_rating'
        ]
        read_only_fields = ['provider']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'venue')

class VenueArchivedSerializer(serializers.ModelSerializer): 
    average_rating = serializers.SerializerMethodField()  
    images = VenueImageSerializer(many=True,read_only=True)

    class Meta:
        model = Venue
        fields =[
            'id', 'provider', 'name', 'description', 'location_geo',
            'capacity', 'price_per_hour', 'created_at', 'updated_at',
            'images','status', 'average_rating', 'last_time_archived'
        ]
        read_only_fields = ['provider']
    def get_average_rating(self, obj):
        return calculate_average_rating(obj.id, 'venue')


class BookingserializerForProvider(serializers.ModelSerializer):
    venue_name = serializers.SerializerMethodField()
    booker_name = serializers.SerializerMethodField()
    booker_email = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = [
            'id', 'venue_name', 'booker_name','booker_email', 'date', 'start_time', 'end_time', 'status', 'notes',
            'created_at', 'updated_at'
        ]
    
    def get_venue_name(self, obj):
        return obj.venue.name
    
    def get_booker_name(self, obj):
        return obj.booker.full_name

    def get_booker_email(self, obj):
        return obj.booker.email

class VenueSerializerDetails(serializers.ModelSerializer):   
    provider = ProviderSimpleSerializer(read_only=True) 
    images = VenueImageSerializer(many=True, read_only=True)
    bookings = serializers.SerializerMethodField()
    
    
    class Meta:
        model = Venue
        fields = [
            'id', 'provider', 'name', 'description', 'location_geo',
            'capacity', 'price_per_hour', 'created_at', 'updated_at',
            'images', 'bookings'
        ]
        read_only_fields = ['provider']

    def get_bookings(self, obj):
        approved_bookings = obj.bookings.filter(status='approved')
        return BookingserializerForClient(
            approved_bookings,
            many=True
        ).data

        
