from shopify_scraper.models import Review, App, Job
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ReviewSerializer, JobSerializer, AppSerializer, JobWithAppSerializer
from shopify_scraper.scraper.shopify_app_scraper import shopify_app_scraper
from shopify_scraper.scraper.verify_shopify_app import verify_shopify_app
from datetime import datetime
from rest_framework import generics
import pandas as pd


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


@api_view(['GET'])
def verify_app(request, app_identifier: str):
    """Verifies that an app exists on the Shopify app store
    Used to prevent jobs being created for invalid app_identifiers

    """
    shop_details = verify_shopify_app(app_identifier)

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
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class AppList(generics.ListCreateAPIView):
    """Retrieves lists of apps and creates new apps
    Default list method is modified to:
    - Return count of data under key 'count'
    """
    queryset = App.objects.all()
    serializer_class = AppSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "count": queryset.count(),
            "apps": serializer.data,
        }
        return Response(data)


class AppRUD(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, destroy apps"""
    queryset = App.objects.all()
    serializer_class = AppSerializer


class ReviewList(generics.ListCreateAPIView):
    """Retrieves lists of reviews and creates new reviews
    Default list method is modified to:
    - Return count of data under key 'count'
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "count": queryset.count(),
            "reviews": serializer.data,
        }
        return Response(data)


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


@api_view(['GET'])
def get_app_review_data(request, app_id):
    """Returns app review data, aggregated for building frontend charts
    """
    reviews = App.objects.get(pk=app_id).reviews.all().order_by('review_date')
    df = pd.DataFrame(list(reviews.values('rating', 'review_date')))

    df['quarter_start'] = df['review_date'].dt.to_period("Q").dt.start_time
    quarter_aggregated = df.groupby('quarter_start')[
        'rating'].agg(['count', 'mean'])
    quarter_aggregated.index = quarter_aggregated.index.strftime('%Y-%m-%d')

    df['month_start'] = df['review_date'].dt.to_period("M").dt.start_time
    month_aggregated = df.groupby('month_start')[
        'rating'].agg(['count', 'mean'])
    month_aggregated.index = month_aggregated.index.strftime('%Y-%m-%d')

    df['week_start'] = df['review_date'].dt.to_period("W").dt.start_time
    week_aggregated = df.groupby('week_start')['rating'].agg(['count', 'mean'])
    week_aggregated.index = week_aggregated.index.strftime('%Y-%m-%d')

    day_aggregated = df.groupby('review_date')['rating'].agg(['count', 'mean'])
    day_aggregated.index = day_aggregated.index.strftime('%Y-%m-%d')

    return Response(status=200, data={
        'rating_count': len(reviews),
        'reviews_average_rating': round(sum([review.rating for review in reviews.all()])/len(reviews), 2),
        'day_aggregated': day_aggregated.to_dict(),
        'week_aggregated': week_aggregated.to_dict(),
        'month_aggregated': month_aggregated.to_dict(),
        'quarter_aggregated': quarter_aggregated.to_dict()
    })
