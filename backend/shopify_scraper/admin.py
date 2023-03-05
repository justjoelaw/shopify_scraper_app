from django.contrib import admin
from .models import Job, App, Tracking, User

# Register your models here.


admin.register(Job)
admin.register(App)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('app', 'created')


@admin.register(App)
class AppAdmin(admin.ModelAdmin):
    list_display = ('name', 'identifier', 'created')


@admin.register(Tracking)
class TrackingAdmin(admin.ModelAdmin):
    list_display = ('user', 'app')


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_superuser',
                    'date_joined', 'last_login')
