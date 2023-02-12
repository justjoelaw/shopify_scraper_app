from django.contrib import admin
from .models import Job, App

# Register your models here.


admin.register(Job)
admin.register(App)

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('app', 'user', 'frequency', 'created')


@admin.register(App)
class AppAdmin(admin.ModelAdmin):
    list_display = ('name', 'identifier', 'created')