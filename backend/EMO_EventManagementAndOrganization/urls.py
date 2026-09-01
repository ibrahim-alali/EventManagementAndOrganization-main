"""
URL configuration for EMO_EventManagementAndOrganization project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from events.views import DashboardStatsForOrganizerView, RecentOrganizerActivityView, RecentOrganizerEventsView

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from general.views import DashboardStatsView, RecentActivityView, DashboardStatsForProviderView, RecentProviderActivityView, RecentProviderVenuesView


urlpatterns = [
    path('admin/', admin.site.urls),
    # auth system
    path('api/auth/', include('accounts.urls')),
    
    path('api/venues/', include('venues.urls')),
    
    path('api/events/', include('events.urls')),
    
    path('api/general/', include('general.urls')),

    # dashboard stats and recent activity for clients
    path('api/client/dashboard/stats', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('api/client/dashboard/recent-activity', RecentActivityView.as_view(), name='recent-activity'),
    
    # dashboard stats and recent activity for providers
    path('api/provider/dashboard/stats', DashboardStatsForProviderView.as_view(), name='provider-dashboard-stats'),
    path('api/provider/dashboard/recent-bookings', RecentProviderActivityView.as_view(), name='provider-recent-booking'),
    path('api/provider/dashboard/venues', RecentProviderVenuesView.as_view(), name='venue-recent-activity'),
    
    # dashboard stats and recent activity for organizers
    path('api/organizer/dashboard/stats', DashboardStatsForOrganizerView.as_view(), name='organizer-dashboard-stats'),
    path('api/organizer/dashboard/recent-registrations', RecentOrganizerActivityView.as_view(), name='organizer-recent-booking'),
    path('api/organizer/dashboard/upcoming-events', RecentOrganizerEventsView.as_view(), name='venue-recent-activity'),
    
  

    
    
    
    # recommendation system
    path('api/recommendation/', include('recommendation.urls')),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
