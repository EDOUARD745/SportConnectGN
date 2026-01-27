from django.contrib import admin

from .models import Activity, Participation, Sport


@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("titre", "sport", "date_heure", "lieu", "nombre_places", "created_by")
    list_filter = ("sport", "niveau_requis")
    search_fields = ("titre", "lieu")


@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ("user", "activity", "joined_at")
    list_filter = ("joined_at",)

