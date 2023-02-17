from . import views
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('jobs/<int:job_id>/start', views.start_job, name='start_job'),
    path('jobs', views.JobList.as_view(), name='job_list'),
    path('jobs/<int:pk>', views.JobRUD.as_view(), name='job_detail'),
    path('reviews', views.ReviewList.as_view(), name='review_list'),
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
    path('login', views.LoginView.as_view(), name='login'),
    path('users/me', views.ProfileView.as_view(), name='active_user'),
    path('token',
         jwt_views.TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('token/refresh',
         jwt_views.TokenRefreshView.as_view(),
         name='token_refresh')
]
