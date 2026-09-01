from rest_framework import permissions


class IsVenueProvider(permissions.BasePermission):
    """Allow action only if the requesting user is the provider of the booking's venue."""

    def has_object_permission(self, request, view, obj):
        # obj is expected to be a Booking instance
        user = request.user
        return user and user.is_authenticated and obj.venue.provider == user


class IsAttendeeOrAdmin(permissions.BasePermission):
    """Allow action only if the requesting user is the attendee (owner) of the registration or admin."""

    def has_object_permission(self, request, view, obj):
        user = request.user
        return user and user.is_authenticated and (obj.attendee == user or user.is_staff or user.is_superuser)


class IsOrganizer(permissions.BasePermission):
    """Allow action only if the requesting user is the organizer of the event."""

    def has_object_permission(self, request, view, obj):
        # obj is expected to be an Event instance
        user = request.user
        return user and user.is_authenticated and obj.organizer == user
