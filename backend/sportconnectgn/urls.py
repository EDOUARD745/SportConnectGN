from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import RegisterView, UserViewSet
from activities.views import ActivityViewSet, ParticipationViewSet, SportViewSet


router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"sports", SportViewSet, basename="sport")
router.register(r"activities", ActivityViewSet, basename="activity")
router.register(r"participations", ParticipationViewSet, basename="participation")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/register/", RegisterView.as_view(), name="auth_register"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

