from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("accounts/profile/", views.profile, name="profile"),
    path("accounts/signup", views.signup, name="signup"),
    path("accounts/modify", views.account_modify, name="account_modify"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
