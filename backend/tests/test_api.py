from django.test import TestCase
from shopify_scraper.models import Job, App, Review, User
from unittest.mock import patch
from rest_framework.test import APIRequestFactory
from api.views import start_job, verify_app
from datetime import datetime
from django.test import Client
import json
import pytest
from django_mock_queries.query import MockSet, MockModel
from api.views import AppReviewList
from django.urls import reverse


@pytest.mark.django_db(True)
class APITests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.factory = APIRequestFactory()
        cls.client = Client()

        cls.user = User.objects.create_user(
            username='testuser', password='12345')

        cls.app = App.objects.create(
            name='Shopify Collabs',
            identifier='collabs',
            image_url='https://cdn.shopify.com/app-store/listing_images/a48f805d99a4948755fcfd3bd15d1aec/icon/CO7CxvKy2fsCEAE=.png'
        )

    def test_start_job(self):
        # Given
        job = Job.objects.create(
            app=self.app, last_run_timestamp='2023-01-01 00:00:00', frequency=1, user=self.user)
        request = self.factory.post('/jobs/{}/start'.format(job.id))

        with patch('api.views.shopify_app_scraper') as shopify_app_scraper_mock:
            review_data = [
                {
                    'comment': 'This app is amazing!',
                    'rating': 5,
                    'review_id': 123,
                    'date': '2022-02-01',
                    'shop_name': 'Test Shop'
                }
            ]
            shopify_app_scraper_mock.return_value = review_data

            # When
            response = start_job(request, job.id)

            # Then
            self.assertEqual(response.status_code, 200)
            job.refresh_from_db()
            self.assertTrue(shopify_app_scraper_mock.called)
            self.assertEqual(job.app.identifier, self.app.identifier)
            self.assertEqual(job.last_run_timestamp.strftime(
                "%Y-%m-%d %H:%M"), datetime.now().strftime("%Y-%m-%d %H:%M"))
            self.assertEqual(Review.objects.count(), 1)
            review = Review.objects.first()
            self.assertEqual(review.comment, 'This app is amazing!')
            self.assertEqual(review.rating, 5)
            self.assertEqual(review.review_id, 123)
            self.assertEqual(review.review_date.strftime(
                "%Y-%m-%d"), '2022-02-01')
            self.assertEqual(review.review_author, 'Test Shop')
            self.assertEqual(review.app, self.app)

    def test_verify_app_success(self):
        # Given
        app_identifier = 'collab'
        request = self.factory.get(f'/api/verify_app/{app_identifier}')
        with patch('api.views.verify_shopify_app') as verify_shopify_app_mock:
            shop_details = {
                'title': 'Foo',
                'rating': '4.8',
                'rating_count': '3,666',
                'image': 'https://cdn.shopify.com/app-store/listing_images/a48f805d99a4948755fcfd3bd15d1aec/icon/CO7CxvKy2fsCEAE=.png'
            }
            verify_shopify_app_mock.return_value = shop_details

            # When
            response = verify_app(request, app_identifier)

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertTrue(verify_shopify_app_mock.called)
            self.assertEqual(response.data, {
                'verified': True,
                'message': 'App verified',
                'data': shop_details
            })

    def test_verify_app_fail(self):
        # Given
        app_identifier = 'collab'
        request = self.factory.get(f'/api/verify_app/{app_identifier}')
        with patch('api.views.verify_shopify_app') as verify_shopify_app_mock:
            verify_shopify_app_mock.side_effect = AttributeError

            # When
            response = verify_app(request, app_identifier)

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertTrue(verify_shopify_app_mock.called)
            self.assertEqual(response.data, {
                'verified': False,
                'message': 'App not found',
                'data': {}
            })

    def test_list_jobs(self):
        # Given
        with patch('api.views.JobList.get_queryset') as mock_queryset:
            mock_queryset.return_value = MockSet(
                Job(app=self.app, last_run_timestamp='2023-01-01 00:00:00',
                    frequency=1, user=self.user),
                Job(app=self.app, last_run_timestamp='2023-01-01 00:00:00',
                    frequency=2, user=self.user)
            )

            # When
            response = self.client.get('/api/jobs')

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertTrue(mock_queryset.called)
            self.assertEqual(json.loads(response.content)['count'], 2)

    def test_create_job(self):
        # Given
        post_body = {
            'app': 1,
            'last_run_timestamp': '2023-01-01 00:00:00',
            'frequency': 1,
            'user': 1
        }
        # When

        response = self.client.post('/api/jobs', post_body)

        # Then
        self.assertEqual(response.status_code, 201)

    def test_list_apps(self):
        # Given
        with patch('api.views.AppList.get_queryset') as mock_queryset:
            mock_queryset.return_value = MockSet(
                App(
                    name='Shopify Collabs',
                    identifier='collabs',
                    image_url='https://cdn.shopify.com/app-store/listing_images/a48f805d99a4948755fcfd3bd15d1aec/icon/CO7CxvKy2fsCEAE=.png'
                ),
                App(
                    name='Shopify Collabs 2',
                    identifier='collabs2',
                    image_url='https://cdn.shopify.com/app-store/listing_images/a48f805d99a4948755fcfd3bd15d1aec/icon/CO7CxvKy2fsCEAE=.png'
                )
            )

            # When
            response = self.client.get('/api/apps')

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertTrue(mock_queryset.called)
            self.assertEqual(json.loads(response.content)['count'], 2)

    def test_create_app(self):
        # Given
        post_body = {
            'name': 'Shopify Collabs 3',
            'identifier': 'collabs3',
            'image_url': 'https://cdn.shopify.com/app-store/listing_images/a48f805d99a4948755fcfd3bd15d1aec/icon/CO7CxvKy2fsCEAE=.png'
        }
        # When
        response = self.client.post('/api/apps', post_body)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(json.loads(response.content)[
            'image_file'])

    def test_list_reviews(self):
        # Given
        with patch('api.views.ReviewList.get_queryset') as mock_queryset:
            mock_queryset.return_value = MockSet(
                Review(
                    comment='Foo',
                    rating=5,
                    review_id=123,
                    review_date='2023-01-01 00:00:00',
                    review_author='bar',
                    app=self.app
                ),
                Review(
                    comment='Bar',
                    rating=5,
                    review_id=321,
                    review_date='2023-01-01 00:00:00',
                    review_author='baz',
                    app=self.app
                )
            )

            # When
            response = self.client.get('/api/reviews')

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertTrue(mock_queryset.called)
            self.assertEqual(json.loads(response.content)['count'], 2)

    def test_create_review(self):
        # Given
        post_body = {
            'comment': 'Foo',
            'rating': 5,
            'review_id': 1234,
            'review_date': '2023-01-01 00:00:00',
            'review_author': 'baz',
            'app': 1
        }
        # When
        response = self.client.post('/api/reviews', post_body)

        # Then
        self.assertEqual(response.status_code, 201)

    def test_app_review_list(self):
        # Given
        reviews = MockSet()
        reviews.add(
            Review(
                comment='Foo',
                rating=5,
                review_id=123,
                review_date='2023-01-01 00:00:00',
                review_author='bar',
                app=self.app
            ),
            Review(
                comment='Bar',
                rating=5,
                review_id=321,
                review_date='2023-01-01 00:00:00',
                review_author='baz',
                app=self.app
            )
        )
        with patch('api.views.AppReviewList.queryset', reviews) as mock_reviews:

            # When
            response = self.client.get(f'/api/apps/{self.app.id}/reviews')

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertEqual(json.loads(response.content)['count'], 2)

    def test_app_review_data(self):
        # Given
        reviews = MockSet()
        reviews.add(
            Review(
                comment='Foo',
                rating=5,
                review_id=123,
                review_date=datetime.strptime(
                    '2023-01-01 00:00:00', '%Y-%m-%d %H:%M:%S'),
                review_author='bar',
                app=self.app
            ),
            Review(
                comment='Bar',
                rating=2,
                review_id=321,
                review_date=datetime.strptime(
                    '2023-01-01 00:00:00', '%Y-%m-%d %H:%M:%S'),
                review_author='baz',
                app=self.app
            )
        )

        with patch('api.views.GetAppReviewDataView.get_app_reviews') as mock_queryset:
            # When
            mock_queryset.return_value = reviews
            response = self.client.get(f'/api/apps/{self.app.id}/reviews/data')

            # Then
            self.assertEqual(response.status_code, 200)
            self.assertEqual(json.loads(response.content)['rating_count'], 2)
            self.assertEqual(json.loads(response.content)[
                'reviews_average_rating'], 3.5)
