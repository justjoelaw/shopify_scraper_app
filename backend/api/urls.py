from . import views
from django.urls import path

urlpatterns = [
    path('jobs/<int:pk>/start', views.start_job, name='start_job'),
    path('jobs/', views.JobList.as_view(), name='job_list'),
    path('jobs/<int:pk>/', views.JobDetail.as_view(), name='job_detail'),
    path('reviews/', views.ReviewList.as_view(), name='review_list'),
    path('apps/<int:app_id>/reviews/', views.AppReviewList.as_view(), name='app_review_list'),
    path('apps/<int:app_id>/reviews/data/', views.get_app_review_data, name='get_app_review_data'),
    path('verify_app/<str:app_identifier>', views.verify_app, name='verify_app'),
    path('apps/', views.AppList.as_view(), name='app_list'),
    path('apps/<int:pk>/', views.AppDetail().as_view(), name='app_detail'),
]