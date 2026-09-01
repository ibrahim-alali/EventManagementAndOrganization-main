from django.urls import path
from .views import ArchivedEventListView, EventListCreateView, EventDetailView, EventReviewListCreateView, EventReviewDetailView, EventsRegistrationListForOrganizerview, PublicEventListView, PublicEventDetailView, InvitationCreateView, RegistrationAcceptView, RegistrationCancelByOrganizerView, RegistrationRejectView, UnarchiveEventView, ArchiveEventView
from .views import  InvitationListView, InvitationDetailView, TotalGuests
from .views import EventRegistrationListCreateView, EventRegistrationDetailView



urlpatterns = [
	path('', EventListCreateView.as_view(), name='event-list'),
	path('<uuid:pk>', EventDetailView.as_view(), name='event-detail'),
	# reviews nested under an event
	path('<uuid:event_pk>/reviews', EventReviewListCreateView.as_view(), name='event-reviews-list-create'),
	path('<uuid:event_pk>/reviews/<uuid:pk>', EventReviewDetailView.as_view(), name='event-reviews-detail'),
	# event registration endpoints (clients)
	path('registrations', EventRegistrationListCreateView.as_view(), name='registration-list-create'),
	path('registrations/<uuid:pk>', EventRegistrationDetailView.as_view(), name='registration-detail'),
	# public listing of events (non-canceled)
	path('public', PublicEventListView.as_view(), name='public-event-list'),
	# public event detail
	path('public/<uuid:pk>', PublicEventDetailView.as_view(), name='public-event-detail'),
	path('invitations/create', InvitationCreateView.as_view(), name='invitation-create'),
	path('invitations', InvitationListView.as_view(), name='invitation-list'),
	path('invitations/<uuid:pk>', InvitationDetailView.as_view(), name='invitation-detail'),
 	# registration management by organizer
	path('<uuid:pk>/accept', RegistrationAcceptView.as_view(), name='booking-accept'),
	path('<uuid:pk>/reject', RegistrationRejectView.as_view(), name='booking-reject'),
	path('<uuid:pk>/cancel-by-organizer', RegistrationCancelByOrganizerView.as_view(), name='booking-cancel-organizer'),	
 	# archived events	
	path('archived', ArchivedEventListView.as_view(), name='archived-events'),
	path('<uuid:pk>/archive', ArchiveEventView.as_view(), name='archive-event'),
	path('<uuid:pk>/unarchive', UnarchiveEventView.as_view(), name='unarchive-event'),
	# event registrations for organizers
	path('registrations/organizer', EventsRegistrationListForOrganizerview.as_view(), name='registration-organizer'),
	path('total-guests', TotalGuests.as_view(), name='TotalGuests'),
	
]