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
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_at"]


class ParticipationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Participation
        fields = ["id", "user", "activity", "joined_at"]
        read_only_fields = ["id", "user", "joined_at"]

