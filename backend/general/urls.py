
from django.urls import path
from .views import VoteListCreateView, VoteDetailView, DashboardStatsView, AverageRatingsView, UserEventReviewsView, UserVenueReviewsView

urlpatterns = [
	path('votes', VoteListCreateView.as_view(), name='vote-list-create'),
	path('votes/<uuid:pk>', VoteDetailView.as_view(), name='vote-detail'),
	path('average-ratings', AverageRatingsView.as_view(), name='average-ratings'),
	path('user-event-reviews', UserEventReviewsView.as_view(), name='user-event-reviews'),
	path('user-venue-reviews', UserVenueReviewsView.as_view(), name='user-venue-reviews'),
 
 
]
