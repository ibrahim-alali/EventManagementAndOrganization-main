from django.urls import path

from .views import EventRecommendationAPIView, RecommendedVenuesAPIView, VenueRecommendationAPIView
from recommendation.views import RecommendedEventsAPIView

urlpatterns = [
    path('venues/', RecommendedVenuesAPIView.as_view(), name='recommended-venues'),
    path('events/', RecommendedEventsAPIView.as_view(), name='recommended-events'),
    path('recommendations/venues/', VenueRecommendationAPIView.as_view(), name='recommend-venues'),
    path('recommendations/events/', EventRecommendationAPIView.as_view(), name='recommend-events'),
]
