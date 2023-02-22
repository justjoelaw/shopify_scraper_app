from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
from bs4 import BeautifulSoup
import re
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from django.utils import timezone
import pytz
from selenium.webdriver.chrome.options import Options
import json

def shopify_app_scraper(app_identifier: str, last_run_timestamp: str):
    """
    Scrapes reviews for the specified Shopify app.

    Parameters:
        app_identifier (str): The identifier of the Shopify app to scrape. Can be found in the Shopify App Store URL: https://apps.shopify.com/{app_identifier}/reviews
        last_run_timestamp (str): The timestamp of the last run of this scraper, in the format (YYYY-MM-DD HH:mm:ss).

    Returns:
        output_list (list):  A list of app reviews
    """

    # Set the scrolling behavior to down
    DesiredCapabilities.CHROME["elementScrollBehavior"] = 1

    # This line uses the ChromeDriverManager from webdriver_manager to install the ChromeDriver executable,
    # and creates a service instance using that driver. The service instance is then passed as a parameter to the
    # webdriver.Chrome constructor, which creates an instance of the Chrome webdriver.
    chromeOptions = Options()
    chromeOptions.headless = True
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chromeOptions)
    # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    output_list = []  # list to contain the extracted data
    rating_dict = {
        '1 out of 5 stars': 1,
        '2 out of 5 stars': 2,
        '3 out of 5 stars': 3,
        '4 out of 5 stars': 4,
        '5 out of 5 stars': 5
    }

    # Scrape all reviews if last_run_timestamp is None
    if not last_run_timestamp:
        last_run_timestamp = datetime(1970, 1, 1, 0, 0, 0, 0, pytz.UTC)
    # Initialize last_review_timestamp as the time now. This will be overwritten each loop
    last_review_timestamp = datetime.now(timezone.utc)
    page_num = 1

    while last_review_timestamp >= last_run_timestamp:
        print(page_num)

        driver.get(
            f'https://apps.shopify.com/{app_identifier}/reviews?page={page_num}')
        time.sleep(1)

        # Extract the html from the page
        html = driver.page_source
        soup = BeautifulSoup(html, features='html.parser')

        review_listings = soup.find_all('div', attrs={
            'data-merchant-review': True,
            'data-review-content-id': True
        })

        for review_listing in review_listings:
            data_dict = {}

            data_dict['review_id'] = review_listing['data-review-content-id']

            comment_content = review_listing.find('p', class_='tw-break-words')
            data_dict['comment'] = comment_content.text

            rating_pattern = re.compile(r'\d out of 5 stars')
            rating_verbose = review_listing.find(
                attrs={'aria-label': rating_pattern})['aria-label']
            data_dict['rating'] = rating_dict[rating_verbose]

            date_verbose = review_listing.find(
                'div', class_=['tw-text-body-xs', 'tw-text-fg-tertiary']).text.strip()
            date_verbose = date_verbose.replace('Edited ', '')
            formatted_date = datetime.strptime(
                date_verbose, '%B %d, %Y').strftime('%Y-%m-%d')
            data_dict['date'] = formatted_date

            shop_name = review_listing.findAll(
                'div', class_=['tw-text-body-xs', 'tw-text-fg-tertiary'])[1].text.strip()
            data_dict['shop_name'] = shop_name

            output_list.append(data_dict)

        # If page has < 10 reviews, it is the final page
        if len(review_listings) < 10:
            break

        last_review_timestamp = pytz.utc.localize(
            datetime.strptime(output_list[-1]['date'], '%Y-%m-%d'))
        page_num += 1

    return output_list

def lambda_handler(event, context):

    output_list = shopify_app_scraper(event['app_identifier'], event['last_run_timestamp'])
    
    return {
        'statusCode': 200,
        'body': json.dumps(output_list)
    }

