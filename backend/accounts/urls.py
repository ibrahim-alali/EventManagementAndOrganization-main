from django.urls import path
from .views import ChangePasswordView, DeleteAccountView, PasswordResetView, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserDetailView
from .views import CustomTokenObtainPairView
from .views import ProviderListView, OrganizerListView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('me', UserDetailView.as_view(), name='user_detail'),
    path('change-password', ChangePasswordView.as_view(), name='change_password'),
    path('me/delete', DeleteAccountView.as_view(), name='delete_account'),
    path('password-reset', PasswordResetView.as_view(), name='password_reset'),
    path('providers', ProviderListView.as_view(), name='provider_list'),
    path('organizers', OrganizerListView.as_view(), name='organizer_list'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
