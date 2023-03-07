from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
import urllib.request
from django.core.files.base import ContentFile
from django.contrib.auth.models import AbstractUser
from django.template.defaultfilters import slugify


class User(AbstractUser):
    email = models.EmailField(unique=True)


class App(models.Model):
    name = models.CharField(max_length=200, unique=True)
    identifier = models.CharField(max_length=200, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    image_url = models.URLField(blank=True, null=True)
    image_file = models.ImageField(
        upload_to='images/app_icons/', blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """
        Custom save method which fetches the image_file from the image_url, if image_file does not exist
        """
        if self.image_url and not self.image_file:
            image = urllib.request.urlopen(self.image_url).read()
            self.image_file.save(slugify(self.name) + '.jpg',
                                 ContentFile(image), save=False)
        super().save(*args, **kwargs)


class Job(models.Model):

    app = models.OneToOneField(App, on_delete=models.CASCADE,
                               related_name='jobs')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    last_run_timestamp = models.DateTimeField(blank=True, null=True)


class Tracking(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='trackings')
    app = models.ForeignKey(
        App, on_delete=models.CASCADE, related_name='trackings')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'app',)


class Review(models.Model):
    comment = models.TextField()
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_id = models.IntegerField(unique=True)
    review_date = models.DateTimeField()
    review_author = models.CharField(max_length=200)
    app = models.ForeignKey(
        App, on_delete=models.CASCADE, related_name='reviews')
