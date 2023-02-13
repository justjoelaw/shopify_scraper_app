from django.test import TestCase
from shopify_scraper.scraper.verify_shopify_app import verify_shopify_app
from shopify_scraper.scraper.shopify_app_scraper import shopify_app_scraper
from datetime import datetime
from django.utils import timezone


class ScraperTests(TestCase):

    def test_verify_shopify_app(self):
        # Given
        app_identifier = 'collabs'
        # When
        output = verify_shopify_app(app_identifier)

        # Then
        self.assertIsNotNone(output)
        self.assertRegexpMatches(
            output['image'], 'https\:\/\/cdn\.shopify\.com/app\-store\/listing_images\/.+?\.(jpg|png)')

    def test_shopify_app_scraper(self):
        # Given
        app_identifier = 'collabs'
        last_run_timestamp = datetime.now(timezone.utc)

        # When
        output_list = shopify_app_scraper(app_identifier, last_run_timestamp)

        # Then
        self.assertEqual(len(output_list), 10)
