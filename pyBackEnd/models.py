from djongo import models
from django.contrib.auth.models import AbstractUser

class Client(AbstractUser):
    first_name = models.CharField(max_length=100)
    middle_names = models.ArrayField(model_container=str, blank=True, default=list)
    last_name = models.CharField(max_length=100, blank=True)
    preferred_name = models.CharField(max_length=100, default=None, blank=True)
    dob = models.DateField()
    image = models.URLField(null=True, blank=True)
    daily_check_ins = models.ArrayReferenceField(to='Daily')
    weekly_check_ins = models.ArrayReferenceField(to='Weekly')
    goals = models.EmbeddedModelField(model_container='Goals', default=dict)

    def save(self, *args, **kwargs):
        if not self.preferred_name:
            self.preferred_name = self.first_name
        super().save(*args, **kwargs)

class Daily(models.Model):
    date = models.DateField()
    weight = models.FloatField()
    calories = models.IntegerField()
    workout = models.EmbeddedModelField(model_container='Workout')
    cardio = models.EmbeddedModelField(model_container='Cardio')
    comment = models.TextField(null=True, blank=True)

class Weekly(models.Model):
    date = models.DateField()
    workouts = models.ArrayReferenceField(to='Workout')
    cheat_meals = models.IntegerField()
    cardio = models.ArrayReferenceField(to='Cardio')
    image = models.URLField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    daily_check = models.ArrayReferenceField(to='Daily')

class Goals(models.Model):
    short_term = models.TextField()
    long_term = models.TextField()

class Workout(models.Model):
    type = models.CharField(max_length=100)
    duration = models.IntegerField()

class Cardio(models.Model):
    type = models.CharField(max_length=100)
    duration = models.IntegerField()
