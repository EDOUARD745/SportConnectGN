from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Activity, Participation, Sport


User = get_user_model()


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]


class ActivitySerializer(serializers.ModelSerializer):
    sport = SportSerializer(read_only=True)
    sport_id = serializers.PrimaryKeyRelatedField(
        source="sport", queryset=Sport.objects.all(), write_only=True
    )
    created_by = UserSerializer(read_only=True)
    participants_count = serializers.SerializerMethodField()
    is_full = serializers.SerializerMethodField()
    has_joined = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            "id",
            "titre",
            "sport",
            "sport_id",
            "date_heure",
            "lieu",
            "nombre_places",
            "niveau_requis",
            "description",
            "created_by",
            "participants_count",
            "is_full",
            "has_joined",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]

    def _participations_list(self, obj):
        """
        Évite des requêtes inutiles si 'participations' a été prefetched.
        """
        try:
            cache = getattr(obj, "_prefetched_objects_cache", {})
            if "participations" in cache:
                return list(cache["participations"])
        except Exception:
            pass
        return list(obj.participations.all())

    def get_participants_count(self, obj):
        return len(self._participations_list(obj))

    def get_is_full(self, obj):
        places = getattr(obj, "nombre_places", None) or 0
        return self.get_participants_count(obj) >= int(places)

    def get_has_joined(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False
        return any(p.user_id == user.id for p in self._participations_list(obj))


class ParticipationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    activity_detail = ActivitySerializer(source="activity", read_only=True)

    class Meta:
        model = Participation
        fields = ["id", "user", "activity", "activity_detail", "joined_at"]
        read_only_fields = ["id", "user", "joined_at"]

