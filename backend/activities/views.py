from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Activity, Participation, Sport
from .permissions import IsActivityCreatorOrReadOnly
from .serializers import ActivitySerializer, ParticipationSerializer, SportSerializer


class SportViewSet(viewsets.ModelViewSet):
    queryset = Sport.objects.all().order_by("name")
    serializer_class = SportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsActivityCreatorOrReadOnly]

    def get_queryset(self):
        return (
            Activity.objects.select_related("sport", "created_by")
            .prefetch_related("participations")
            .all()
        )

    def perform_create(self, serializer):
        activity = serializer.save(created_by=self.request.user)
        # Le créateur est invité d'office (pas besoin de réserver).
        Participation.objects.get_or_create(user=self.request.user, activity=activity)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        qs = (
            self.get_queryset()
            .filter(created_by=request.user)
            .order_by("-date_heure", "-id")
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ParticipationViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = (
            Participation.objects.select_related("user", "activity", "activity__sport")
            .prefetch_related("activity__participations")
            .all()
        )
        user = self.request.user
        if getattr(user, "is_staff", False):
            return qs
        return qs.filter(user=user)

    def perform_create(self, serializer):
        # Par défaut, on force l'utilisateur courant pour éviter l'usurpation.
        user = self.request.user
        activity = serializer.validated_data.get("activity")
        if activity is None:
            raise ValidationError({"activity": "Ce champ est requis."})
        if Participation.objects.filter(user=user, activity=activity).exists():
            raise ValidationError({"detail": "Tu as déjà réservé cette activité."})
        if Participation.objects.filter(activity=activity).count() >= activity.nombre_places:
            raise ValidationError({"detail": "Cette activité est complète."})
        serializer.save(user=user)

