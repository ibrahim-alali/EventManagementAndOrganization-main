
# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from events.serializers import EventSerializer
from recommendation.venues.pipeline import get_recommended_venues
from venues.serializers import VenueSerializer
from .serializers import RecommendedVenueSerializer

class RecommendedVenuesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        context = {
            "min_capacity": request.query_params.get("min_capacity"),
            "max_price_per_hour": request.query_params.get("max_price_per_hour"),
        }
        venues = get_recommended_venues(user=user, context=context)
        serializer = RecommendedVenueSerializer(venues, many=True)
        return Response(serializer.data)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from recommendation.events.pipeline import get_recommended_events
from .serializers import RecommendedEventSerializer

class RecommendedEventsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        context = {}  # يمكنك إضافة فلترة إضافية إذا أحببت
        events = get_recommended_events(user=user, context=context)
        serializer = RecommendedEventSerializer(events, many=True)
        return Response(serializer.data)
    
    
    
    

from rest_framework.views import APIView
from rest_framework.response import Response
from .recommender import Recommender
from venues.models import Venue
from events.models import Event
from django.db.models import Count


# --- API توصيات القاعات ---
class VenueRecommendationAPIView(APIView):
    def get(self, request, *args, **kwargs):
        rec_engine = Recommender()
        all_ids = rec_engine.get_top_n(request.user.id, n=15)
        
        # فلترة الـ IDs الخاصة بالقاعات فقط من النتائج
        venues_qs = Venue.objects.filter(id__in=all_ids, status='active')
        
        source = 'personalized'
        if not venues_qs.exists():
            # الأكثر رواجاً إذا لم توجد توصيات
            venues_qs = Venue.objects.filter(status='active').annotate(
                c=Count('bookings')).order_by('-c')[:6]
            source = 'popularity'

        serializer = VenueSerializer(venues_qs, many=True, context={'request': request})
        return Response({
            'status': 'success',
            'source': source,
            'results': serializer.data
        })

# --- API توصيات الفعاليات ---
class EventRecommendationAPIView(APIView):
    def get(self, request, *args, **kwargs):
        rec_engine = Recommender()
        all_ids = rec_engine.get_top_n(request.user.id, n=15)
        
        # فلترة الـ IDs الخاصة بالفعاليات فقط من النتائج
        events_qs = Event.objects.filter(id__in=all_ids, status='scheduled')
        
        source = 'personalized'
        if not events_qs.exists():
            # الأكثر رواجاً إذا لم توجد توصيات
            events_qs = Event.objects.filter(status='scheduled').annotate(
                c=Count('registrations')).order_by('-c')[:6]
            source = 'popularity'

        serializer = EventSerializer(events_qs, many=True, context={'request': request})
        return Response({
            'status': 'success',
            'source': source,
            'results': serializer.data
        })