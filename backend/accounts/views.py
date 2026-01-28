from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .serializers import RegisterSerializer, UserSerializer


User = get_user_model()


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Exposition minimale des utilisateurs:
    - `me/` pour le profil courant (auth requis)
    - liste/détail réservés admin (évite d'exposer les profils)
    """

    serializer_class = UserSerializer
    queryset = User.objects.all().order_by("id")

    def get_permissions(self):
        if self.action == "me":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @action(
        detail=False,
        methods=["get", "patch", "delete"],
        parser_classes=[MultiPartParser, FormParser, JSONParser],
    )
    def me(self, request):
        if request.method.upper() == "DELETE":
            # Suppression du compte (irréversible)
            request.user.delete()
            return Response(status=204)

        if request.method.upper() == "PATCH":
            serializer = self.get_serializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        output = UserSerializer(user, context={"request": request}).data
        return Response(output, status=201)

