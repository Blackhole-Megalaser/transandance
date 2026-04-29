from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(
        max_length=1 * 1024 * 1024,
        upload_to="profile_images/",
        blank=True,
        null=True,
    )  # 1MiB
