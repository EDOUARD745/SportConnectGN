from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Sport(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Activity(models.Model):
    class NiveauRequis(models.TextChoices):
        DEBUTANT = "debutant", "Débutant"
        INTERMEDIAIRE = "intermediaire", "Intermédiaire"
        AVANCE = "avance", "Avancé"
        PRO = "pro", "Pro"

    titre = models.CharField(max_length=120)
    sport = models.ForeignKey(Sport, on_delete=models.PROTECT, related_name="activities")
    date_heure = models.DateTimeField()
    lieu = models.CharField(max_length=200)
    nombre_places = models.PositiveIntegerField()
    niveau_requis = models.CharField(
        max_length=20, choices=NiveauRequis.choices, default=NiveauRequis.DEBUTANT
    )
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activities"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_heure", "-id"]

    def __str__(self) -> str:
        return f"{self.titre} ({self.sport.name})"


class Participation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="participations"
    )
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="participations"
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "activity"], name="uniq_participation_user_activity"
            )
        ]

    def __str__(self) -> str:
        return f"{self.user} -> {self.activity}"

