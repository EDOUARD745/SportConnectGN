from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Profil",
            {
                "fields": (
                    "ville",
                    "quartier",
                    "bio",
                    "photo_profil",
                    "niveau_sportif",
                )
            },
        ),
    )

