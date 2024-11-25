from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied

class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_superuser:
            raise PermissionDenied(detail="You must be a superuser to access this view")
        return True
    