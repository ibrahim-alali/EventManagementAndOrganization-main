from django.utils import timezone

from recommendation.models import UserInteraction
from recommendation.utils import log_visit

from .models import Venue
from .filters import VenueFilter
from .serializers import VenueArchivedSerializer, VenueCreateSerializerForProvider, VenueDetailsSerializerForProvider, VenueSerializer,VenueSerializerForProvider, VenueSerializerDetails
from .serializers import BookingserializerForProvider
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from general.serializers import ReviewSerializer
from general.permissions import IsReviewerOrAdmin
from general.models import Review
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from events.models import Booking
from venues.serializers import BookingserializerForClient
from rest_framework.views import APIView
from rest_framework import status
# for the venue provider to manage their venues
class VenueListView(generics.ListAPIView):
    serializer_class = VenueSerializerForProvider
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VenueFilter
    search_fields = ['name', 'description', 'provider__full_name', 'provider__email']

    def get_queryset(self):
        return Venue.objects.filter(provider=self.request.user)
    
    
    
# for the venue provider to create a new venue
class ProviderVenueCreateView(generics.CreateAPIView):
    serializer_class = VenueCreateSerializerForProvider
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)



# for the venue provider to manage their venue
class VenueDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = VenueDetailsSerializerForProvider
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Venue.objects.filter(provider=self.request.user)
    def retrieve(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user.is_authenticated:  # فقط المستخدمين المسجلين
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='visit_venue',
                target_type='venue',
                target_id=venue.id
            )
        return super().retrieve(request, *args, **kwargs)




# for the venue provider to list their "archived" venues
class VenueArchivedListView(generics.ListAPIView):
    """List archived venues belonging to the requesting provider."""
    serializer_class = VenueArchivedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return venues that belong to the provider and are archived
        return Venue.objects.filter(provider=self.request.user, status='archived')


# for anyone to list or create reviews for a venue
class VenueReviewListCreateView(generics.ListCreateAPIView):
    """List all reviews for a venue or create a review for the venue.

    GET: anyone can list reviews. POST: authenticated users can create one review per user per venue.
    """
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        venue_pk = self.kwargs.get('venue_pk')
        return Review.objects.filter(target_type='venue', target_id=venue_pk).order_by('-created_at')

    def perform_create(self, serializer):
        # force the target on create using URL param to avoid mismatch
        venue_pk = self.kwargs.get('venue_pk')
        serializer.save(reviewer=self.request.user, target_type='venue', target_id=venue_pk)
        review = serializer.save(reviewer=self.request.user, target_type='event', target_id=venue_pk)
        UserInteraction.objects.create(
            user=self.request.user,
            interaction_type='review',
            target_type='event' if review.target_type=='event' else 'venue',
            target_id=review.target_id,
            rating=review.rating
        )
    

# for the reviewer or admin to manage a specific review of a venue
class VenueReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsReviewerOrAdmin]

    def get_queryset(self):
        venue_pk = self.kwargs.get('venue_pk')
        return Review.objects.filter(target_type='venue', target_id=venue_pk)
    
    
# for public (client or visitor)
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        page_count = len(data)
        total = self.page.paginator.count if hasattr(self, 'page') and self.page is not None else 0
        page_number = self.page.number if hasattr(self, 'page') and self.page is not None else None
        page_size = self.get_page_size(self.request)

        return Response({
            'total': total,
            'page': page_number,
            'page_size': page_size,
            'results': data,
        })
        
        
# for public (client or visitor)      
class PublicVenueListView(generics.ListAPIView):
    """Public listing of venues (excludes archived). Uses same filters and search as provider list."""
    serializer_class = VenueSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VenueFilter
    search_fields = ['name', 'description', 'provider__full_name', 'provider__email']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Venue.objects.exclude(status='archived')
        provider_id = self.request.query_params.get('provider')
        if provider_id:
            queryset = queryset.filter(provider__id=provider_id)
        return queryset


# for public  (client or visitor)
class PublicVenueDetailView(generics.RetrieveAPIView):
    """Public detail view for a single event (only if not canceled)."""
    serializer_class = VenueSerializerDetails
    permission_classes = [AllowAny]

    def get_queryset(self):
        # only events that are not canceled are visible via public detail
        return Venue.objects.exclude(status='archived')
    
    def retrieve(self, request, *args, **kwargs):
        venue = self.get_object()
        if request.user.is_authenticated: 
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='visit_venue',
                target_type='venue',
                target_id=venue.id
            )
        return super().retrieve(request, *args, **kwargs)




# for provider to list all bookings for their venues
class ProviderBookingsListView(generics.ListAPIView):
    serializer_class = BookingserializerForProvider
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['venue__name', 'booker__full_name', 'booker__email']
    filterset_fields = ['status', 'date']

    def get_queryset(self):
        return Booking.objects.filter(venue__provider=self.request.user).order_by('-created_at')

# for provider to archive a venue
class VenueArchiveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            venue = Venue.objects.get(pk=pk, provider=request.user)
        except Venue.DoesNotExist:
            return Response({'detail': 'Venue not found.'}, status=status.HTTP_404_NOT_FOUND)

        venue.status = 'archived'
        venue.last_time_archived = timezone.now()
        venue.save(update_fields=['status', 'last_time_archived'])

        return Response(
            {'detail': 'Venue archived successfully.'},
            status=status.HTTP_200_OK
        )
    
# for provider to unarchive a venue
class VenueUnarchiveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            venue = Venue.objects.get(pk=pk, provider=request.user)
        except Venue.DoesNotExist:
            return Response({'detail': 'Venue not found.'}, status=status.HTTP_404_NOT_FOUND)

        venue.status = 'active'
        venue.last_time_archived = timezone.now()
        venue.save(update_fields=['status', 'last_time_archived'])

        return Response(
            {'detail': 'Venue unarchived successfully.'},
            status=status.HTTP_200_OK
        )