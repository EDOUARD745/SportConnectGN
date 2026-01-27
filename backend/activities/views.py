from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError

from .models import Activity, Participation, Sport
from .serializers import ActivitySerializer, ParticipationSerializer, SportSerializer


class SportViewSet(viewsets.ModelViewSet):
    queryset = Sport.objects.all().order_by("name")
    serializer_class = SportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return (
            Activity.objects.select_related("sport", "created_by")
            .prefetch_related("participations")
            .all()
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ParticipationViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Participation.objects.select_related("user", "activity").all()

    def perform_create(self, serializer):
        # Par défaut, on force l'utilisateur courant pour éviter l'usurpation.
        user = self.request.user
        activity = serializer.validated_data.get("activity")
        if activity is None:
            raise ValidationError({"activity": "Ce champ est requis."})
        serializer.save(user=user)

