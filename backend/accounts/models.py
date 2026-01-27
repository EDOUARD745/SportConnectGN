from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class NiveauSportif(models.TextChoices):
        DEBUTANT = "debutant", "Débutant"
        INTERMEDIAIRE = "intermediaire", "Intermédiaire"
        AVANCE = "avance", "Avancé"
        PRO = "pro", "Pro"

    ville = models.CharField(max_length=120, blank=True)
    quartier = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    photo_profil = models.ImageField(upload_to="profiles/", blank=True, null=True)
    niveau_sportif = models.CharField(
        max_length=20, choices=NiveauSportif.choices, default=NiveauSportif.DEBUTANT
    )

    def __str__(self) -> str:
        return self.username

