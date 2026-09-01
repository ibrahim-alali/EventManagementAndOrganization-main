from django.utils import timezone
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from urllib3 import request

from recommendation.models import UserInteraction
from recommendation.utils import log_visit

from .models import Event, Invitation
from django.db.models import Q
from .serializers import EventSerializer, EventSerializerForOrganizer,EventSerializerDetails, InvitationSerializer, EventRegistrationForOrganizerSerializer
from .filters import EventFilter, EventFilterForOrganizer
from general.serializers import ReviewSerializer
from general.models import Review
from general.permissions import IsReviewerOrAdmin
from rest_framework.permissions import AllowAny, IsAuthenticated

# for the organizer to manage their events
class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializerForOrganizer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EventFilterForOrganizer
    search_fields = ['title', 'description', 'venue__name', 'organizer__full_name']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # show only events organized by the logged-in user
            return Event.objects.filter(organizer=user)
        return Event.objects.none()

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

# for the organizer to manage their events
class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    # allow anonymous users to read public events, but only authenticated users can edit
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # a user may only update/delete events they organize
        return Event.objects.filter(organizer=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user.is_authenticated:  # فقط المستخدمين المسجلين
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='visit_event',
                target_type='event',
                target_id=event.id
            )
        return super().retrieve(request, *args, **kwargs)



# for the client to manage their events
class PublicEventListView(generics.ListAPIView):
    """Public listing of events excluding canceled events. Uses same filters/search as EventListCreateView."""
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EventFilter
    search_fields = ['title', 'description', 'venue__name', 'organizer__full_name']
    # pagination: default page size 10, allow client to override with ?page_size=
    class StandardResultsSetPagination(PageNumberPagination):
        page_size = 12
        page_size_query_param = 'page_size'
        max_page_size = 100

        def get_paginated_response(self, data):
            # count: number of items in this page
            page_count = len(data)
            # total: total items across all pages
            total = self.page.paginator.count if hasattr(self, 'page') and self.page is not None else 0
            # current page number
            page_number = self.page.number if hasattr(self, 'page') and self.page is not None else None
            # page size
            page_size = self.get_page_size(self.request)

            return Response({
                'total': total,
                'page': page_number,
                'page_size': page_size,
                'results': data,
            })

    pagination_class = StandardResultsSetPagination

    
    def get_queryset(self):
        queryset = Event.objects.exclude(status='canceled')
        organizer_id = self.request.query_params.get('organizer')
        if organizer_id:
            queryset = queryset.filter(organizer__id=organizer_id)
        return queryset


# for the client to manage their events
class PublicEventDetailView(generics.RetrieveAPIView):
    """Public detail view for a single event (only if not canceled)."""
    serializer_class = EventSerializerDetails
    permission_classes = [AllowAny]

    def get_queryset(self):
        # only events that are not canceled are visible via public detail
        return Event.objects.exclude(status='canceled')
    def retrieve(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user.is_authenticated:  # فقط المستخدمين المسجلين
            UserInteraction.objects.create(
                user=request.user,
                interaction_type='visit_event',
                target_type='event',
                target_id=event.id
            )
        return super().retrieve(request, *args, **kwargs)



    
    


# Booking management views
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsVenueProvider
from .serializers import EventRegistrationSerializer
from .models import EventRegistration
from .permissions import IsAttendeeOrAdmin, IsOrganizer

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only show bookings for the current user
        return Booking.objects.filter(booker=self.request.user)

    def perform_create(self, serializer):
        serializer.save(booker=self.request.user)
        booking = serializer.instance  # Get the created booking instance
        UserInteraction.objects.create(
            user=self.request.user,
            interaction_type='booking',
            target_type='venue',
            target_id=booking.venue.id
        )

class BookingListforOrganizerView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only show bookings for the current user
        return Booking.objects.filter(booker=self.request.user, status='approved')



class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow the booker to access/edit/delete their own bookings
        return Booking.objects.filter(booker=self.request.user)


class BookingAcceptView(APIView):
    permission_classes = [IsAuthenticated, IsVenueProvider]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        # permission check uses object so call explicitly
        self.check_object_permissions(request, booking)

        if booking.status == 'approved':
            return Response({'detail': 'Booking already approved'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'approved'
        booking.save()
        return Response({'detail': 'Booking approved'}, status=status.HTTP_200_OK)


class BookingRejectView(APIView):
    permission_classes = [IsAuthenticated, IsVenueProvider]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, booking)

        if booking.status == 'rejected':
            return Response({'detail': 'Booking already rejected'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'rejected'
        booking.save()
        return Response({'detail': 'Booking rejected'}, status=status.HTTP_200_OK)


class BookingCancelByProviderView(APIView):
    permission_classes = [IsAuthenticated, IsVenueProvider]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, booking)

        if booking.status == 'canceled':
            return Response({'detail': 'Booking already canceled'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'canceled'
        booking.save()
        return Response({'detail': 'Booking canceled by provider'}, status=status.HTTP_200_OK)


class EventReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        event_pk = self.kwargs.get('event_pk')
        return Review.objects.filter(target_type='event', target_id=event_pk).order_by('-created_at')

    def perform_create(self, serializer):
        event_pk = self.kwargs.get('event_pk')
        review = serializer.save(reviewer=self.request.user, target_type='event', target_id=event_pk)
        UserInteraction.objects.create(
            user=self.request.user,
            interaction_type='review',
            target_type='event' if review.target_type=='event' else 'venue',
            target_id=review.target_id,
            rating=review.rating
        )



class EventReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsReviewerOrAdmin]

    def get_queryset(self):
        event_pk = self.kwargs.get('event_pk')
        return Review.objects.filter(target_type='event', target_id=event_pk)


class EventRegistrationListCreateView(generics.ListCreateAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # list only registrations of the requesting user
        return EventRegistration.objects.filter(attendee=self.request.user)

    def perform_create(self, serializer):
        # ensure attendee is set to current user
        serializer.save(attendee=self.request.user)
        registration = serializer.instance  # Get the created registration instance
        UserInteraction.objects.create(
                user=self.request.user,
                interaction_type='registration',
                target_type='event',
                target_id=registration.event.id,
                
            )


class EventsRegistrationListForOrganizerview(generics.ListAPIView):
    serializer_class = EventRegistrationForOrganizerSerializer
    permission_classes = [IsAuthenticated, IsOrganizer]
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # show only events organized by the logged-in user
            return EventRegistration.objects.filter(event__organizer=user)

class EventRegistrationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated, IsAttendeeOrAdmin]

    def get_queryset(self):
        # only allow owner/admin to access/edit/delete
        return EventRegistration.objects.filter(attendee=self.request.user)

# for the organizer to create invitations for events
class InvitationCreateView(generics.CreateAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated,IsOrganizer]

    def perform_create(self, serializer):
        invitation = serializer.save(sender=self.request.user)
        # Check if user is organizer of the event
        if invitation.event and invitation.event.organizer != self.request.user:
            raise PermissionDenied("You are not the organizer of this event.")

# for the organizer to list their sent invitations
class InvitationListView(generics.ListAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated,IsOrganizer]

    def get_queryset(self):
        return Invitation.objects.filter(sender=self.request.user)


# for the organizer to manage their sent invitations (update/delete)
class InvitationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated, IsOrganizer]

    def get_queryset(self):
        # only allow organizer to access/edit/delete their own sent invitations
        return Invitation.objects.filter(sender=self.request.user)

class RegistrationAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            registration = EventRegistration.objects.get(pk=pk)
        except EventRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        # permission check uses object so call explicitly
        self.check_object_permissions(request, registration)

        if registration.status == 'approved':
            return Response({'detail': 'Booking already approved'}, status=status.HTTP_400_BAD_REQUEST)

        registration.status = 'approved'
        registration.save()
        return Response({'detail': 'Registration approved'}, status=status.HTTP_200_OK)

class RegistrationRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            registration = EventRegistration.objects.get(pk=pk)
        except EventRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, registration)
        if registration.status == 'rejected':
            return Response({'detail': 'Registration already rejected'}, status=status.HTTP_400_BAD_REQUEST)

        registration.status = 'rejected'
        registration.save()
        return Response({'detail': 'Registration rejected'}, status=status.HTTP_200_OK)
    
    

class RegistrationCancelByOrganizerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            registration = EventRegistration.objects.get(pk=pk)
        except EventRegistration.DoesNotExist:
            return Response({'detail': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, registration)

        if registration.status == 'canceled':
            return Response({'detail': 'Registration already canceled'}, status=status.HTTP_400_BAD_REQUEST)

        registration.status = 'canceled'
        registration.save()
        return Response({'detail': 'Registration canceled by organizer'}, status=status.HTTP_200_OK)
    
    
class ArchivedEventListView(generics.ListAPIView):
    """List archived events for the authenticated organizer."""
    serializer_class = EventSerializerForOrganizer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(organizer=user, archived=True)
    
    
class ArchiveEventView(APIView):
    """Archive an event for the authenticated organizer."""
    permission_classes = [IsAuthenticated, IsOrganizer]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk, organizer=request.user, archived=False)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found or already archived'}, status=status.HTTP_404_NOT_FOUND)

        event.archived = True
        event.last_time_archived = timezone.now()
        event.save(update_fields=['archived', 'last_time_archived'])
        return Response({'detail': 'Event archived'}, status=status.HTTP_200_OK)


class UnarchiveEventView(APIView):
    """Unarchive an event for the authenticated organizer."""
    permission_classes = [IsAuthenticated, IsOrganizer]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk, organizer=request.user, archived=True)
        except Event.DoesNotExist:
            return Response({'detail': 'Archived event not found'}, status=status.HTTP_404_NOT_FOUND)

        event.archived = False
        event.last_time_archived = timezone.now()
        event.save(update_fields=['archived', 'last_time_archived'])
        return Response({'detail': 'Event unarchived'}, status=status.HTTP_200_OK)
    


class DashboardStatsForOrganizerView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        events = Event.objects.filter(organizer=request.user.id)
        registrations = EventRegistration.objects.filter(event__organizer=request.user.id)
        invitation = Invitation.objects.filter(event__organizer=request.user.id)
        data = []
        data.append({
            "totalEvents": events.count(),
            "totalRegistrations": registrations.count(),
            "pendingRegistrations": registrations.filter(status='pending').count(),
            "totalTickets": invitation.count(),
            "archivedEvents": events.filter(archived=True).count()
        })
        return Response(data)
 
class RecentOrganizerActivityView(generics.ListAPIView):
    """List recent registrations for the authenticated organizer."""
    permission_classes = [IsAuthenticated]
    def get(self, request):
        registrations = EventRegistration.objects.filter(event__organizer=request.user.id).order_by('-created_at')
        data = []
        for reg in registrations[:3]:
            data.append({
                "id": str(reg.id),
                "clientName": reg.attendee.full_name,
                "eventTitle": reg.event.title,
                "status": reg.status,
                "createdAt": reg.created_at
            })
        return Response(data)
    
    
class RecentOrganizerEventsView(generics.ListAPIView):
    """List recent events for the authenticated organizer."""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        events = Event.objects.filter(organizer=request.user).order_by('-created_at')[:3]
        data = []
        for ev in events:
            ticketsSold = EventRegistration.objects.filter(event=ev.id).count()
            data.append({
                "id": str(ev.id),
                "title": ev.title,
                "description": ev.description,
                "type": ev.event_type,
                "date": ev.date,
                "location": ev.venue.location_geo["city"],
                "ticketsSold": ticketsSold,
            })

        return Response(data)


class TotalGuests(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer
    def get(self, request):
        total_guests = Invitation.objects.filter(sender=request.user.id).count()
        total_student = Invitation.objects.filter(ticket_type='student',sender=request.user.id).count()
        total_vip = Invitation.objects.filter(ticket_type='vip',sender=request.user.id).count()
        total_regular = Invitation.objects.filter(ticket_type='regular',sender=request.user.id).count()
        return Response({
            "totalguests": total_guests,
            "totalstudent": total_student,
            "totalvip": total_vip,
            "totalregular": total_regular,   
            })