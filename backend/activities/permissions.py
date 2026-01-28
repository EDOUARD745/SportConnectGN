from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsActivityCreatorOrReadOnly(BasePermission):
    """
    - Lecture: autorisée à tous
    - Création: nécessite authentification (gérée aussi par IsAuthenticatedOrReadOnly)
    - Modification/Suppression: uniquement le créateur (ou staff)
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False
        if getattr(user, "is_staff", False):
            return True
        return getattr(obj, "created_by_id", None) == getattr(user, "id", None)

