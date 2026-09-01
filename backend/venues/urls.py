from django.urls import path

from events.views import BookingAcceptView, BookingCancelByProviderView, BookingDetailView, BookingListCreateView, BookingListforOrganizerView, BookingRejectView 
from .views import ProviderVenueCreateView, VenueListView, VenueArchivedListView, VenueDetailView, VenueReviewListCreateView, VenueReviewDetailView, PublicVenueListView, PublicVenueDetailView, ProviderBookingsListView
from .views import VenueArchiveView, VenueUnarchiveView


urlpatterns = [
    path('', VenueListView.as_view(), name='venue-list'),
    path('create', ProviderVenueCreateView.as_view(), name='venue-list'),
    # archived venues for the authenticated provider
    path('archived', VenueArchivedListView.as_view(), name='venue-archived-list'),
    # public listing (non-archived) - separate endpoint
    path('public', PublicVenueListView.as_view(), name='public-venue-list'),
    path('public/<uuid:pk>', PublicVenueDetailView.as_view(), name='public-venue-detail'),
    path('<uuid:pk>', VenueDetailView.as_view(), name='venue-detail'),
    # Reviews nested under a specific venue
    path('<uuid:venue_pk>/reviews', VenueReviewListCreateView.as_view(), name='venue-reviews-list-create'),
    path('<uuid:venue_pk>/reviews/<uuid:pk>', VenueReviewDetailView.as_view(), name='venue-reviews-detail'),
    # Booking endpoints
	path('bookings', BookingListCreateView.as_view(), name='booking-list-create'),
	path('bookings/organizer', BookingListforOrganizerView.as_view(), name='booking-list-organizer'),
	path('bookings/<uuid:pk>', BookingDetailView.as_view(), name='booking-detail'),
    # provider actions for bookings (only venue provider can call)
    path('bookings/<uuid:pk>/accept', BookingAcceptView.as_view(), name='booking-accept'),
	path('bookings/<uuid:pk>/reject', BookingRejectView.as_view(), name='booking-reject'),
	path('bookings/<uuid:pk>/cancel-by-provider', BookingCancelByProviderView.as_view(), name='booking-cancel-provider'),
    # provider bookings list
    path('provider-bookings', ProviderBookingsListView.as_view(), name='provider-bookings-list'),
    path('archive/<uuid:pk>', VenueArchiveView.as_view(), name='venue-archive'),
    path('unarchive/<uuid:pk>', VenueUnarchiveView.as_view(), name='venue-unarchive'),
]
