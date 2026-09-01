
from rest_framework import serializers
from .models import User
from django.core.files.base import ContentFile
from django.contrib.auth.password_validation import validate_password
from general.models import Vote

class UserSerializer(serializers.ModelSerializer):
    # min_length=6 to enforce a minimum password length
    password = serializers.CharField(write_only=True, min_length=6)
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'role', 'password']
        # this will make sure password is write-only
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            phone=validated_data['phone'],
            full_name=validated_data['full_name'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# this serializer is for updating user details
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone', 'email', 'profile_picture','role']
        read_only_fields = ['email']  

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # نضيف الـ role داخل التوكين نفسه
        token["role"] = user.role  # هذا اسم الحقل عندك في الموديل

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # نضيف الـ role داخل الـ response للفرونت أيضاً
        data["role"] = self.user.role

        return data



# this serializer is for changing password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UserPublicSerializer(serializers.ModelSerializer):
    votes_score = serializers.IntegerField(read_only=True)
    votes_count = serializers.IntegerField(read_only=True)
    upvoted = serializers.BooleanField(read_only=True)  
    downvoted = serializers.BooleanField(read_only=True)
    vote_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'role', 'created_at', 'votes_score', 'votes_count', 'upvoted', 'downvoted', 'vote_id']
    def get_vote_id(self, obj):
        user = self.context['request'].user
        if user.is_anonymous:
            return None
        vote = Vote.objects.filter(voter=user, target_user=obj).values_list('id', flat=True).first()
        return vote
