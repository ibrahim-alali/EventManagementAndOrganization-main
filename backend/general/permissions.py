from rest_framework import permissions


class IsReviewerOrAdmin(permissions.BasePermission):
    """Allow safe methods to anyone, but only reviewer or staff can change/delete."""

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS are allowed
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow if user is the reviewer or a staff/superuser
        user = request.user
        return user and user.is_authenticated and (user == obj.reviewer or user.is_staff or user.is_superuser)


class IsVoterOrAdmin(permissions.BasePermission):
    """Allow safe methods to anyone, but only voter or staff can change/delete."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return user and user.is_authenticated and (user == obj.voter or user.is_staff or user.is_superuser)


class IsClient(permissions.BasePermission):
    """Allow only authenticated users with role 'client' to perform actions."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not getattr(user, 'is_authenticated', False):
            return False
        return getattr(user, 'role', None) == 'client'
