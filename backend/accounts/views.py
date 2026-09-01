
from rest_framework import generics

from general.models import Vote
from .serializers import UserSerializer
from accounts.decorators import role_required
from accounts.serializers import ChangePasswordSerializer, PasswordResetSerializer
from .models import User
from .serializers import UserUpdateSerializer
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from rest_framework.decorators import api_view  
from django.utils.decorators import method_decorator
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django_filters import rest_framework as filters
from django.db.models import Sum, Count
from .serializers import UserPublicSerializer
from django.db.models.functions import Coalesce



from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter





class RegisterView(APIView):
    """
    POST: Register a new user.
    """
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()   # important: get saved user instance
        
                # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(access),
        }, status=status.HTTP_201_CREATED)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



#@method_decorator(role_required(['organizer']), name='dispatch')
class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserUpdateSerializer
    """
    get / put / patch: this for getting and updating the user details
    """
    def get_object(self):
        return self.request.user
    
    

class ChangePasswordView(APIView):
    """
    POST: Change the authenticated user's password.
    """
    permission_classes = [permissions.IsAuthenticated]
    # we use this if there is chance to use another serializer in future
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    """
    DELETE: Delete the authenticated user's account.

    Requirements:
    - Provide a valid access token in the request header.
    - Once deleted, the account cannot be restored.

    Response Codes:
    - 204: Account deleted successfully
    - 401: Unauthorized (invalid or missing token)
    """
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"detail": "Account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)



class PasswordResetView(APIView):
    """
    POST: Initiate password reset process by sending a reset link to the user's email.
    """
    
    # we did not use it here because we will not change the serializer in future
    # serializer_class = PasswordResetSerializer
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            reset_url = f"http://localhost:8000/reset-password-confirm/{user.pk}/{token}/"
            send_mail(
                "Password Reset",
                f"Click here to reset your password: {reset_url}",
                "no-reply@example.com",
                [email],
            )
        except User.DoesNotExist:
            pass  
        return Response({"detail": "If your email exists, a password reset link has been sent."})


class UserFilter(filters.FilterSet):
    date_joined_gte = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_joined_lte = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    full_name = filters.CharFilter(lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = User
        fields = ['date_joined_gte', 'date_joined_lte', 'full_name', 'email']


from django.db.models import Sum, Case, When, Value, IntegerField, Exists, OuterRef
from venues.views import StandardResultsSetPagination
class ProviderListView(generics.ListAPIView):
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter
    ]
    filterset_class = UserFilter

    ordering_fields = ['created_at', 'votes_score', 'votes_count', 'full_name']
    ordering = ['-votes_score']
    def get_queryset(self):
        user = self.request.user

        qs = User.objects.filter(role='provider').annotate(
            votes_score=Coalesce(Sum('votes_received__value'), 0),
            votes_count=Coalesce(Sum(1), 0),
        )

        # إذا المستخدم غير مسجل دخول → رجع 0 بدون Subquery
        if user.is_anonymous:
            return qs.annotate(
                upvoted=Value(0, output_field=IntegerField()),
                downvoted=Value(0, output_field=IntegerField()),
            )

        # مستخدم مسجل دخول → فحص التصويت
        upvote_exists = Vote.objects.filter(
            target_user=OuterRef('pk'),
            voter=user,
            value=1
        )

        downvote_exists = Vote.objects.filter(
            target_user=OuterRef('pk'),
            voter=user,
            value=-1
        )

        return qs.annotate(
            upvoted=Case(
                When(Exists(upvote_exists), then=Value(1)),
                default=Value(0),
                output_field=IntegerField(),
            ),
            downvoted=Case(
                When(Exists(downvote_exists), then=Value(1)),
                default=Value(0),
                output_field=IntegerField(),
            ),
        )
        
        
class OrganizerListView(generics.ListAPIView):
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = UserFilter

    ordering_fields = ['created_at', 'votes_score', 'votes_count', 'full_name']
    ordering = ['-votes_score']  # default ordering

    def get_queryset(self):
        user = self.request.user

        # queryset الأساسي للمُنظّمين
        qs = User.objects.filter(role='organizer').annotate(
            votes_score=Coalesce(Sum('votes_received__value'), 0),
            votes_count=Count('votes_received')
        )

        # إذا المستخدم anonymous → نرجع صفر للقيمتين
        if user.is_anonymous:
            return qs.annotate(
                upvoted=Value(0, output_field=IntegerField()),
                downvoted=Value(0, output_field=IntegerField())
            )

        # subquery للتحقق من وجود upvote و downvote من المستخدم الحالي
        upvote_exists = Vote.objects.filter(
            target_user=OuterRef('pk'),
            voter=user,
            value=1
        )

        downvote_exists = Vote.objects.filter(
            target_user=OuterRef('pk'),
            voter=user,
            value=-1
        )

        return qs.annotate(
            upvoted=Case(
                When(Exists(upvote_exists), then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            ),
            downvoted=Case(
                When(Exists(downvote_exists), then=Value(1)),
                default=Value(0),
                output_field=IntegerField()
            )
        )