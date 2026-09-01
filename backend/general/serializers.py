from rest_framework import serializers
from .models import Review, Vote
from accounts.serializers import UserSerializer
from venues.models import Venue
from events.models import Event
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import uuid


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    is_own = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'reviewer', 'target_type', 'target_id',
            'rating', 'comment', 'created_at', 'edited_at', 'is_own'
        ]
        read_only_fields = ['id', 'reviewer', 'created_at', 'edited_at', 'is_own']

    def get_is_own(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.reviewer == request.user
        return False

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError(_('rating must be between 1 and 5'))
        return value

    def validate(self, attrs):
        # Ensure target exists
        # allow missing target_type/target_id when called from nested endpoints
        ttype = attrs.get('target_type')
        tid = attrs.get('target_id')
        # try to infer from view kwargs (venues/events nested routes)
        view = self.context.get('view')
        if view is not None:
            if not ttype and 'venue_pk' in view.kwargs:
                ttype = 'venue'
            if not ttype and 'event_pk' in view.kwargs:
                ttype = 'event'
            if not tid and 'venue_pk' in view.kwargs:
                tid = view.kwargs.get('venue_pk')
            if not tid and 'event_pk' in view.kwargs:
                tid = view.kwargs.get('event_pk')

        # allow UUID input as string or UUID
        try:
            if not isinstance(tid, uuid.UUID):
                tid = uuid.UUID(str(tid))
        except Exception:
            raise serializers.ValidationError({'target_id': _('Invalid UUID for target_id')})

        if ttype == 'venue':
            if not Venue.objects.filter(id=tid).exists():
                raise serializers.ValidationError({'target_id': _('target venue not found')})
        elif ttype == 'event':
            if not Event.objects.filter(id=tid).exists():
                raise serializers.ValidationError({'target_id': _('target event not found')})
        else:
            raise serializers.ValidationError({'target_type': _('target_type must be "venue" or "event"')})

        # ensure one review per user per target when creating
        request = self.context.get('request')
        if request and request.method in ('POST',):
            user = request.user
            if Review.objects.filter(reviewer=user, target_type=ttype, target_id=tid).exists():
                raise serializers.ValidationError(_('You have already reviewed this item'))

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['reviewer'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # prevent changing the target or reviewer when editing
        validated_data.pop('target_type', None)
        validated_data.pop('target_id', None)
        validated_data.pop('reviewer', None)
        # mark edited_at timestamp - model already has edited_at field; set to now in view or signal
        from django.utils import timezone
        instance.edited_at = timezone.now()
        return super().update(instance, validated_data)


class VoteSerializer(serializers.ModelSerializer):
    voter = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Vote
        fields = ['id', 'voter', 'target_user', 'value', 'created_at', 'updated_at']
        read_only_fields = ['id', 'voter', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        voter = request.user if request and hasattr(request, 'user') else None
        target = attrs.get('target_user') or getattr(self.instance, 'target_user', None)

        if not voter or not voter.is_authenticated:
            raise serializers.ValidationError('Authentication required to vote')

        if target and voter == target:
            raise serializers.ValidationError('You cannot vote for yourself')

        if getattr(voter, 'role', None) != 'client':
            raise serializers.ValidationError('Only clients may cast votes')

        if target and getattr(target, 'role', None) not in ('provider', 'organizer'):
            raise serializers.ValidationError('target_user must be a provider or organizer')

        val = attrs.get('value')
        if val not in (1, -1):
            raise serializers.ValidationError({'value': 'Must be 1 (up) or -1 (down)'})

        return attrs

    def create(self, validated_data):
        voter = self.context['request'].user
        target = validated_data.get('target_user')
        value = validated_data.get('value')

        existing, created = Vote.objects.update_or_create(
            voter=voter,
            target_user=target,
            defaults={'value': value}
        )
        return existing

    def update(self, instance, validated_data):
        # لا نسمح بتغيير target_user
        validated_data.pop('target_user', None)
        return super().update(instance, validated_data)