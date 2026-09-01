from django.http import HttpResponseForbidden
from functools import wraps

def role_required(allowed_roles=None):
    """
    Decorator to restrict access to users with specific roles.
    Example usage:
        @role_required(['provider'])
        @method_decorator(role_required(['organizer']), name='dispatch')
        def my_view(request):
            ...
    """
    if allowed_roles is None:
        allowed_roles = []

    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user = request.user
            if not user.is_authenticated:
                return HttpResponseForbidden("You must be logged in.")
            
            if user.role not in allowed_roles:
                return HttpResponseForbidden("You do not have permission to access this page.")

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
