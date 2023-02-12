from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from django.utils import timezone
import pytz


def shopify_app_scraper(app_name, last_run_timestamp):
    '''
    IMPORTANT: Download the correct chromedriver from this url: https://chromedriver.chromium.org/downloads
    Add the downloaded driver to '/usr/local/bin'

    If you get the error "Message: 'chromedriver' executable may have wrong permissions." try:
        - run in terminal chmod +x chromedriver
        - re-move chromedriver to '/usr/local/bin'. Make sure this is the actual executable and not an alias
        (actual executable may be in Applications folder - if so, cmd+drag chromedriver to '/usr/local/bin')
    '''
    # Set the scrolling behavior to down
    DesiredCapabilities.CHROME["elementScrollBehavior"] = 1

    # Zoom out page (easier to see script running)
    # driver = webdriver.Chrome(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get('chrome://settings/')
    driver.execute_script('chrome.settingsPrivate.setDefaultZoom(0.5);')

    output_list = []  # list to contain our extracted data
    rating_dict = {
        '1 out of 5 stars': 1,
        '2 out of 5 stars': 2,
        '3 out of 5 stars': 3,
        '4 out of 5 stars': 4,
        '5 out of 5 stars': 5
    }
    if not last_run_timestamp:
        last_run_timestamp = datetime(1970,1,1,0,0,0,0, pytz.UTC)
    last_review_timestamp = datetime.now(timezone.utc)
    page_num = 1;


    # for i in range(num_pages):
    while last_review_timestamp >= last_run_timestamp:
        
        driver.get(f'https://apps.shopify.com/{app_name}/reviews?page={page_num}')
        time.sleep(1)

        # Extract the html from the page
        html = driver.page_source
        soup = BeautifulSoup(html, features='html.parser')

        review_listings = soup.find_all('div', attrs={
            'data-merchant-review' : True,
            'data-review-content-id': True
            })


        for review_listing in review_listings:
            data_dict = {}

            comment_content = review_listing.find('p', class_='tw-break-words')
            data_dict['comment'] = comment_content.text

            rating_pattern = re.compile(r'\d out of 5 stars')
            rating_verbose = review_listing.find(attrs={'aria-label': rating_pattern})['aria-label']
            data_dict['rating'] = rating_dict[rating_verbose]
            data_dict['review_id'] = review_listing['data-review-content-id']

            date_verbose = review_listing.find('div', class_=['tw-text-body-xs', 'tw-text-fg-tertiary']).text.strip()
            date_verbose = date_verbose.replace('Edited ', '')
            formatted_date = datetime.strptime(date_verbose, '%B %d, %Y').strftime('%Y-%m-%d')
            data_dict['date'] = formatted_date

            shop_name = review_listing.findAll('div', class_=['tw-text-body-xs', 'tw-text-fg-tertiary'])[1].text.strip()
            data_dict['shop_name'] = shop_name

            output_list.append(data_dict)

        if len(review_listings) < 10:
            break
        
        last_review_timestamp = pytz.utc.localize(datetime.strptime(output_list[-1]['date'], '%Y-%m-%d'))
        page_num += 1


    return output_list
