from rest_framework import serializers
from venues.models import Venue

class RecommendedVenueSerializer(serializers.Serializer):
    id = serializers.UUIDField(source='venue.id')
    name = serializers.CharField(source='venue.name')
    score = serializers.FloatField()
    
    
    
from rest_framework import serializers
from events.models import Event

class RecommendedEventSerializer(serializers.Serializer):
    id = serializers.UUIDField(source='event.id')
    title = serializers.CharField(source='event.title')
    score = serializers.FloatField()