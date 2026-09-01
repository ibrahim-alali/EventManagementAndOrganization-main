from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
import uuid
from django.db.models import Avg

from recommendation.models import UserInteraction

from .models import Vote, Review
from .serializers import VoteSerializer
from .permissions import IsVoterOrAdmin, IsClient
from accounts.models import User
from events.models import Booking, EventRegistration, Event
from venues.models import Venue
class VoteListCreateView(generics.ListCreateAPIView):
    serializer_class = VoteSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsClient()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Vote.objects.all()
        target_user = self.request.query_params.get('target_user')
        if target_user:
            try:
                tu = uuid.UUID(str(target_user))
            except Exception:
                return qs.none()
            return qs.filter(target_user=tu)
        return qs

    def create(self, request, *args, **kwargs):
        # use serializer.create to perform upsert; handle returned instance specially
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()  # obj هو الـVote الجديد
        if obj.target_user.role == 'provider':
            target_venue = Venue.objects.filter(provider=obj.target_user).first()
            if not target_venue:
                # لا يوجد venue، لذلك لا نسجّل interaction
                return Response(self.get_serializer(obj).data, status=status.HTTP_200_OK)
            target_id = target_venue.id

        else:  # organizer
            target_event = Event.objects.filter(organizer=obj.target_user).first()
            if not target_event:
                # لا يوجد event، لذلك لا نسجّل interaction
                return Response(self.get_serializer(obj).data, status=status.HTTP_200_OK)
            target_id = target_event.id

        # سجل التفاعل بعد حفظ الـVote، فقط للمستخدمين المسجلين
        if request.user.is_authenticated:
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='vote',
                target_type='venue' if obj.target_user.role == 'provider' else 'event',        
                target_id=target_id,
                vote_value=obj.value
            )

        # إعادة الـVote كـResponse
        out_serializer = self.get_serializer(obj)
        return Response(out_serializer.data, status=status.HTTP_200_OK)


class VoteDetailView(generics.RetrieveUpdateDestroyAPIView):
	queryset = Vote.objects.all()
	serializer_class = VoteSerializer
	permission_classes = [IsVoterOrAdmin]


class DashboardStatsView(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		total_bookings = Booking.objects.count()
		registrations = User.objects.count()
		venue_ratings = Review.objects.filter(target_type='venue').count()
		event_ratings = Review.objects.filter(target_type='event').count()
		event_organizers = User.objects.filter(role='organizer').count()
		venue_providers = User.objects.filter(role='provider').count()

		data = {
			"totalBookings": total_bookings,
			"registrations": registrations,
			"venueRatings": venue_ratings,
			"eventRatings": event_ratings,
			"eventOrganizers": event_organizers,
			"venueProviders": venue_providers
		}
		return Response(data)

# the recent activity view
class RecentActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        activities = []

        # Collect bookings by the current user
        bookings = Booking.objects.filter(booker=request.user).order_by('-created_at')[:10]
        for b in bookings:
            activities.append({
                'type': 'booking',
                'title': 'New Booking',
                'description': f'A new booking was created for {b.venue.name}',
                'time': b.created_at.isoformat()
            })

        # Collect registrations by the current user
        regs = EventRegistration.objects.filter(attendee=request.user).order_by('-created_at')[:10]
        for r in regs:
            activities.append({
                'type': 'registration',
                'title': 'New Registration',
                'description': f'{r.attendee.full_name} registered for {r.event.title}',
                'time': r.created_at.isoformat()
            })

        # Collect venue ratings by the current user
        venue_reviews = Review.objects.filter(reviewer=request.user, target_type='venue').order_by('-created_at')[:10]
        for rev in venue_reviews:
            try:
                venue = Venue.objects.get(id=rev.target_id)
                desc = f'Rating {rev.rating} given to {venue.name}'
            except Venue.DoesNotExist:
                desc = f'Rating {rev.rating} given to unknown venue'
            activities.append({
                'type': 'venue_rating',
                'title': 'New Rating',
                'description': desc,
                'time': rev.created_at.isoformat()
            })

        # Collect event ratings by the current user
        event_reviews = Review.objects.filter(reviewer=request.user, target_type='event').order_by('-created_at')[:10]
        for rev in event_reviews:
            try:
                event = Event.objects.get(id=rev.target_id)
                desc = f'Rating {rev.rating} given to {event.title}'
            except Event.DoesNotExist:
                desc = f'Rating {rev.rating} given to unknown event'
            activities.append({
                'type': 'event_rating',
                'title': 'New Rating',
                'description': desc,
                'time': rev.created_at.isoformat()
            })

        # Collect provider ratings by the current user
        provider_votes = Vote.objects.filter(voter=request.user, target_user__role='provider').order_by('-created_at')[:10]
        for v in provider_votes:
            activities.append({
                'type': 'provider_rating',
                'title': 'New Rating',
                'description': f'{v.voter.full_name} rated {v.target_user.full_name}',
                'time': v.created_at.isoformat()
            })

        # Collect organizer ratings by the current user
        organizer_votes = Vote.objects.filter(voter=request.user, target_user__role='organizer').order_by('-created_at')[:10]
        for v in organizer_votes:
            activities.append({
                'type': 'organizer_rating',
                'title': 'New Rating',
                'description': f'{v.voter.full_name} rated {v.target_user.full_name}',
                'time': v.created_at.isoformat()
            })

        # Sort by time descending
        activities.sort(key=lambda x: x['time'], reverse=True)

        # Limit to 10
        activities = activities[:10]

        # Assign ids
        for i, act in enumerate(activities, 1):
            act['id'] = i

        return Response(activities)
    
    

def calculate_average_rating(target_id, target_type):
    reviews = Review.objects.filter(
        target_id=target_id,
        target_type=target_type
    )

    count = reviews.count()
    if count == 0:
        return {'average_rating': 0, 'count': 0}

    avg_rating = reviews.aggregate(avg=Avg('rating'))['avg']

    # تقريب لأقرب 0.5
    avg_rating = round(avg_rating * 2) / 2 if avg_rating else 0

    return {'average_rating': avg_rating, 'count': count}
    
class AverageRatingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        target_id = request.query_params.get('id')
        target_type = request.query_params.get('type')

        if not target_id or not target_type:
            return Response({'error': 'id and type parameters are required'}, status=400)

        if target_type not in ['venue', 'event']:
            return Response({'error': 'type must be venue or event'}, status=400)

        try:
            uuid.UUID(target_id)
        except ValueError:
            return Response({'error': 'id must be a valid UUID'}, status=400)

        avg_rating = calculate_average_rating(target_id, target_type)
        return Response(avg_rating)
    

class UserEventReviewsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(reviewer=request.user, target_type='event').order_by('-created_at')
        data = []
        for rev in reviews:
            try:
                event = Event.objects.get(id=rev.target_id)
                data.append({
                    'id': str(rev.id),
                    'event_id': str(event.id),
                    'event_title': event.title,
                    'rating': rev.rating,
                    'comment': rev.comment,
                    'created_at': rev.created_at.isoformat()
                })
            except Event.DoesNotExist:
                continue
        return Response(data)


class UserVenueReviewsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reviews = Review.objects.filter(reviewer=request.user, target_type='venue').order_by('-created_at')
        data = []
        for rev in reviews:
            try:
                venue = Venue.objects.get(id=rev.target_id)
                data.append({
                    'id': str(rev.id),
                    'venue_id': str(venue.id),
                    'venue_name': venue.name,
                    'rating': rev.rating,
                    'comment': rev.comment,
                    'created_at': rev.created_at.isoformat()
                })
            except Venue.DoesNotExist:
                continue
        return Response(data)



# Dashboard stats for providers
class DashboardStatsForProviderView(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request):
		totalVenues = Venue.objects.filter(provider=request.user).count()
		totalBookings = Booking.objects.filter(venue__provider=request.user).count()
		pendingBookings = Booking.objects.filter(status='pending', venue__provider=request.user).count()
		acceptedBookings = Booking.objects.filter(status='approved', venue__provider=request.user).count()
		archivedVenues = Venue.objects.filter(status='archived', provider=request.user).count()
		data = {
			"totalVenues": totalVenues,
			"totalBookings": totalBookings,
			"pendingBookings": pendingBookings,
			"acceptedBookings": acceptedBookings,
			"archivedVenues": archivedVenues
		}
		return Response(data)

# the recent activity view for providers
class RecentProviderActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        activities = []

        # Collect bookings for venues owned by the provider
        bookings = Booking.objects.filter(venue__provider=request.user).order_by('-created_at')[:3]
        for b in bookings:
            activities.append({
                'id': b.id,
                'venueName': b.venue.name,
                'status': b.status,
                'requestedDate': b.created_at.isoformat()
            })

        # Sort by time descending
        activities.sort(key=lambda x: x['requestedDate'], reverse=True)
        # Limit to 10
        activities = activities[:3]
        return Response(activities)
    
# the recent venues view for providers
class RecentProviderVenuesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        venues = Venue.objects.filter(provider=request.user).order_by('-created_at')[:3]
        data = []
        for v in venues:
            data.append({
                'id': str(v.id),
                'name': v.name,
                'location_geo': v.location_geo,
                'price_per_hour': v.price_per_hour,
                'status': v.status,
                'bookingsCount': v.bookings.count(),
            })
        return Response(data)