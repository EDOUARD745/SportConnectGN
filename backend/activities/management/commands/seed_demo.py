from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from activities.models import Activity, Participation, Sport


User = get_user_model()


class Command(BaseCommand):
    help = "Crée des sports/activités de démo (dev uniquement)."

    def handle(self, *args, **options):
        if not settings.DEBUG:
            self.stderr.write(
                self.style.ERROR("Commande désactivée hors DEBUG (sécurité).")
            )
            return

        demo_password = "DemoSportConnectGN!123"

        demo_user, created = User.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@sportconnectgn.local"},
        )
        if created or not demo_user.has_usable_password():
            demo_user.set_password(demo_password)
            demo_user.save(update_fields=["password"])

        # Quelques profils “réalistes”
        users = [demo_user]
        for username in ["moussa", "aissatou", "fatou", "ibrahima"]:
            u, c = User.objects.get_or_create(username=username)
            if c or not u.has_usable_password():
                u.set_password(demo_password)
                u.save(update_fields=["password"])
            users.append(u)

        football, _ = Sport.objects.get_or_create(name="Football")
        running, _ = Sport.objects.get_or_create(name="Running")
        fitness, _ = Sport.objects.get_or_create(name="Fitness")
        basket, _ = Sport.objects.get_or_create(name="Basket")

        now = timezone.now()
        demo_activities = [
            {
                "titre": "Futsal ce soir",
                "sport": football,
                "date_heure": now + timedelta(hours=6),
                "lieu": "Nongo (Conakry)",
                "nombre_places": 10,
                "niveau_requis": Activity.NiveauRequis.INTERMEDIAIRE,
                "description": "Match détente, ambiance clean. Viens avec tes crampons !",
            },
            {
                "titre": "Running Sunrise",
                "sport": running,
                "date_heure": now + timedelta(days=1, hours=7),
                "lieu": "Kipé",
                "nombre_places": 8,
                "niveau_requis": Activity.NiveauRequis.DEBUTANT,
                "description": "Course légère + étirements. Objectif: régularité.",
            },
            {
                "titre": "Séance Fitness en groupe",
                "sport": fitness,
                "date_heure": now + timedelta(days=2, hours=18),
                "lieu": "Ratoma",
                "nombre_places": 12,
                "niveau_requis": Activity.NiveauRequis.INTERMEDIAIRE,
                "description": "Circuit training (HIIT doux). On s’encourage, on progresse.",
            },
            {
                "titre": "Basket 3x3",
                "sport": basket,
                "date_heure": now + timedelta(days=3, hours=19),
                "lieu": "Dixinn",
                "nombre_places": 6,
                "niveau_requis": Activity.NiveauRequis.AVANCE,
                "description": "3x3 rapide. Niveau avancé, intensité élevée.",
            },
        ]

        created_count = 0
        for payload in demo_activities:
            obj, c = Activity.objects.get_or_create(
                titre=payload["titre"],
                sport=payload["sport"],
                date_heure=payload["date_heure"],
                lieu=payload["lieu"],
                defaults={
                    "nombre_places": payload["nombre_places"],
                    "niveau_requis": payload["niveau_requis"],
                    "description": payload["description"],
                    "created_by": demo_user,
                },
            )
            if c:
                created_count += 1

            # Ajoute quelques participations de démo
            for u in users[1:]:
                if u.username in {"moussa", "aissatou"}:
                    Participation.objects.get_or_create(user=u, activity=obj)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed OK: {created_count} activités créées/assurées. "
                f"Login démo: demo / {demo_password}"
            )
        )
