from . import views
from django.urls import path

urlpatterns = [
    path('jobs/<int:job_id>/start', views.start_job, name='start_job'),
    path('jobs/<int:job_id>/start_lambda',
         views.start_job_lambda, name='start_job_lambda'),
    path('jobs', views.JobList.as_view(), name='job_list'),
    path('jobs/<int:pk>', views.JobRUD.as_view(), name='job_detail'),
    path('trackings/<int:pk>', views.TrackingRUD.as_view(), name='tracking_detail'),
    path('reviews', views.ReviewList.as_view(), name='review_list'),
    path('users/me/reviews', views.ReviewListUser.as_view(),
         name='review_list_user'),
    path('apps/<int:app_id>/reviews',
         views.AppReviewList.as_view(), name='app_review_list'),
    path('apps/<int:app_id>/reviews/data',
         views.GetAppReviewDataView.as_view(), name='get_app_review_data'),
    path('verify_app/<str:app_identifier>',
         views.verify_app, name='verify_app'),
    path('apps', views.AppList.as_view(), name='app_list'),
    path('users/me/apps',
         views.AppListUser.as_view(), name='app_list_user'),
    path('apps/<int:pk>', views.AppRUD.as_view(), name='app_detail'),
    path('users', views.UserList.as_view(), name='user_list'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('users/me', views.ProfileView.as_view(), name='active_user'),
    path('login', views.LoginView.as_view(), name="login"),
    path('app/<int:app_id>/remove_tracking',
         views.delete_tracking_by_app, name='delete_tracking_by_app'),
]
