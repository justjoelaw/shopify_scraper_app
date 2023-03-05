from shopify_scraper.models import Review, App, Job, User, Tracking
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ReviewSerializer, JobSerializer, AppSerializer, JobWithAppSerializer, UserSerializer, TrackingSerializer
from shopify_scraper.scraper.shopify_app_scraper import shopify_app_scraper
from shopify_scraper.scraper.verify_shopify_app import verify_shopify_app
from datetime import datetime
from rest_framework import generics
import pandas as pd
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib.auth import login, logout, authenticate
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.contrib.auth.decorators import user_passes_test
import functools
import boto3
import json
import os


def admin_method_decorator(class_view_method):
    '''
    Used to override methods within class-based views.
    Makes the method only available for superusers
    '''
    @functools.wraps(class_view_method)
    def wrapper(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return class_view_method(self, request, *args, **kwargs)
        else:
            return Response(status=200, data={
                'message': 'You do not have permissions on this object'
            })
    return wrapper


@user_passes_test(lambda u: u.is_superuser)
@api_view(['POST'])
def start_job(request, job_id):
    """Runs the scraper for the specified job_id.
    """
    job = Job.objects.get(pk=job_id)
    app_identifier = job.app.identifier

    now = datetime.now()

    reviews = shopify_app_scraper(app_identifier, job.last_run_timestamp)
    job.last_run_timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
    job.save()

    for review in reviews:
        review, created = Review.objects.get_or_create(
            comment=review['comment'],
            rating=review['rating'],
            review_id=review['review_id'],
            review_date=review['date'],
            review_author=review['shop_name'],
            app=job.app
        )

    return Response(status=200)


@api_view(['POST'])
def start_job_lambda(request, job_id):
    """Runs the scraper for the specified job_id.
    """
    job = Job.objects.get(pk=job_id)
    app_identifier = job.app.identifier
    app_id = job.app.id
    last_run_timestamp = job.last_run_timestamp

    now = datetime.now()

    body_dict = {
        'app_identifier': app_identifier,
        'last_run_timestamp': last_run_timestamp,
        'app_id': app_id
    }

    sqs = boto3.client('sqs', region_name='eu-west-2')
    queue_url = 'https://sqs.eu-west-2.amazonaws.com/307765359076/test_shopify_queue.fifo'
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(body_dict),
        MessageGroupId=str(job.app.id),
        MessageDeduplicationId=str(job.app.id) + str(last_run_timestamp)
    )

    return Response(
        status=200,
        data={
            'sqs_response': response
        }
    )


@api_view(['GET'])
def verify_app(request, app_identifier: str):
    """Verifies that an app exists on the Shopify app store
    Used to prevent jobs being created for invalid app_identifiers

    """

    try:
        shop_details = verify_shopify_app(app_identifier)
    except AttributeError:
        return Response(status=200, data={
            'verified': False,
            'message': 'App not found',
            'data': {}
        })

    return Response(status=200, data={
        'verified': True,
        'message': 'App verified',
        'data': shop_details
    })


class JobList(generics.ListCreateAPIView):
    """Retrieves lists of jobs and creates new jobs
    Default list method is modified to:
    - Return count of data under key 'count'
    - Return the 'app' associated with each 'job'
    """
    permission_classes = (permissions.IsAdminUser,)

    queryset = Job.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return JobWithAppSerializer
        return JobSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            'count': queryset.count(),
            'jobs': serializer.data,
        }
        return Response(data)


class JobRUD(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, destroy jobs"""
    permission_classes = (permissions.IsAdminUser,)

    queryset = Job.objects.all()
    serializer_class = JobSerializer


class AppList(generics.ListCreateAPIView):
    """Retrieves lists of apps and creates new apps
    Default list method is modified to:
    - Return count of data under key 'count'
    """
    queryset = App.objects.all()
    serializer_class = AppSerializer

    def create(self, request, *args, **kwargs):
        if len(Tracking.objects.filter(user=request.user)) >= 5:
            return Response({'message': 'You can only track a maximum of 5 apps'}, status=status.HTTP_403_FORBIDDEN)

        if len(App.objects.all()) >= 20:
            return Response({'message': 'Temporary limit of 20 apps total for testing'}, status=status.HTTP_403_FORBIDDEN)

        app_identifier = request.data['identifier']
        try:
            # Check if app already exists
            app = App.objects.get(identifier=app_identifier)

            obj, tracking_created = Tracking.objects.get_or_create(
                app=app,
                user=request.user
            )

            if not tracking_created:
                return Response({'message': 'You are already tracking this app'}, status=status.HTTP_403_FORBIDDEN)

            return Response(self.get_serializer(app).data)

        except App.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            app = serializer.instance
            Tracking.objects.create(
                app=app,
                user=request.user
            )

            # Create job as part of view - create via API is limited to superuser
            job = Job.objects.create(
                app=app
            )

            return Response(data={
                'app': serializer.data,
                'job_id': job.id
            }, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "count": queryset.count(),
            "apps": serializer.data,
        }
        return Response(data)


class AppListUser(AppList):
    def get(self, request):
        self.user = request.user
        self.queryset = App.objects.filter(trackings__user=self.user)
        self.serializer = self.get_serializer(self.queryset, many=True)
        return self.list(request)


class AppRUD(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, destroy apps"""
    permission_classes = (permissions.IsAdminUser,)

    queryset = App.objects.all()
    serializer_class = AppSerializer


class TrackingRUD(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, destroy apps"""

    serializer_class = TrackingSerializer

    def get_queryset(self):
        return self.Tracking.objects.filter(user=self.request.user)


class ReviewList(generics.ListCreateAPIView):
    """Retrieves lists of reviews and creates new reviews
    Default list method is modified to:
    - Return count of data under key 'count'
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            if request.META.get('HTTP_REVIEWS_CREATE_TOKEN') != os.environ['REVIEWS_CREATE_TOKEN']:
                return Response(status=403, data={
                    'message': 'You are not authorised to create reviews. REVIEWS_CREATE_TOKEN not correct'})
        except KeyError:
            return Response(status=403, data={
                'message': 'You are not authorised to create reviews. REVIEWS_CREATE_TOKEN not provided'})

        data = request.data
        app = App.objects.get(pk=data[0]['app'])

        created_count = 0
        for review in data:
            obj, created = Review.objects.get_or_create(
                comment=review['comment'],
                rating=review['rating'],
                review_id=review['review_id'],
                review_date=review['review_date'],
                review_author=review['review_author'],
                app=app
            )
            if created:
                created_count += 1
        return Response(status=200, data={
            'reviews_created': created_count})

    def list(self, request):
        print(request)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "count": queryset.count(),
            "reviews": serializer.data,
        }
        return Response(data)


class ReviewListUser(ReviewList):
    def get(self, request):
        self.user = request.user
        apps = App.objects.filter(trackings__user=self.user)
        self.queryset = Review.objects.filter(app__in=apps)
        self.serializer = self.get_serializer(self.queryset, many=True)
        return self.list(request)


class AppReviewList(generics.ListAPIView):
    """Retrieves lists of reviews for a given app_id
    Default list method is modified to:
    - Return count of data under key 'count'
    - Return the average rating of the app reviews under key 'reviews_average_rating'
    """

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        app_id = self.kwargs.get('app_id')
        return self.queryset.filter(app__id=app_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "count": queryset.count(),
            'reviews_average_rating': round(sum([review.rating for review in queryset.all()])/len(queryset), 2),
            "reviews": serializer.data
        }
        return Response(data)


class GetAppReviewDataView(APIView):
    """Returns app review data, aggregated for building frontend charts
    """

    def get_app_reviews(self, app_id):
        app = App.objects.get(pk=app_id)
        return app.reviews.all().order_by('review_date')

    def get(self, request, app_id):
        reviews = self.get_app_reviews(app_id)
        if len(reviews) == 0:
            return Response(status=200, data={
                'rating_count': len(reviews),
                'reviews_average_rating': 0,
                'day_aggregated': {},
                'week_aggregated': {},
                'month_aggregated': {},
                'quarter_aggregated': {}
            })

        df = pd.DataFrame(list(reviews.values('rating', 'review_date')))

        df['quarter_start'] = df['review_date'].dt.to_period("Q").dt.start_time
        quarter_aggregated = df.groupby('quarter_start')[
            'rating'].agg(['count', 'mean'])
        quarter_aggregated.index = quarter_aggregated.index.strftime(
            '%Y-%m-%d')

        df['month_start'] = df['review_date'].dt.to_period("M").dt.start_time
        month_aggregated = df.groupby('month_start')[
            'rating'].agg(['count', 'mean'])
        month_aggregated.index = month_aggregated.index.strftime('%Y-%m-%d')

        df['week_start'] = df['review_date'].dt.to_period("W").dt.start_time
        week_aggregated = df.groupby('week_start')[
            'rating'].agg(['count', 'mean'])
        week_aggregated.index = week_aggregated.index.strftime('%Y-%m-%d')

        day_aggregated = df.groupby('review_date')[
            'rating'].agg(['count', 'mean'])
        day_aggregated.index = day_aggregated.index.strftime('%Y-%m-%d')

        return Response(status=200, data={
            'rating_count': len(reviews),
            'reviews_average_rating': round(sum([review.rating for review in reviews.all()])/len(reviews), 2),
            'day_aggregated': day_aggregated.to_dict(),
            'week_aggregated': week_aggregated.to_dict(),
            'month_aggregated': month_aggregated.to_dict(),
            'quarter_aggregated': quarter_aggregated.to_dict()
        })


class UserList(generics.ListCreateAPIView):
    """Retrieves lists of users and creates new users
    """
    permission_classes = (permissions.AllowAny,)

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        self.permission_classes = (permissions.AllowAny,)
        return self.create(request, *args, **kwargs)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        print(request)
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        logout(request)
        response = Response(None, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie('sessionid')
        return response


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        print(request.user)
        response = super(ProfileView, self).get(request, *args, **kwargs)
        response['Access-Control-Allow-Credentials'] = 'true'
        return response

    def get_object(self):
        print(self.request.user)
        return self.request.user


@ api_view(['DELETE'])
def delete_tracking_by_app(request, app_id):
    app = App.objects.get(pk=app_id)
    tracking = Tracking.objects.filter(app=app, user=request.user)

    tracking.delete()

    return Response(status=200, data={
        'message': 'Tracking deleted'
    })
