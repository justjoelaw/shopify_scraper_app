from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re
import os
from selenium.webdriver import Chrome


def verify_shopify_app(app_identifier: str):
    """
    Verifies that a given app_identifier exists on the Shopify App Store

    Parameters:
        app_identifier (str): The identifier of the Shopify app to scrape. Can be found in the Shopify App Store URL: https://apps.shopify.com/{app_identifier}/reviews

    Returns:
        output (dict): A dictionary containing key info about the app
    """
    chromeOptions = Options()
    chromeOptions.headless = True
    if 'RDS_DB_NAME' in os.environ:  # If deployed...
        driver = Chrome('/usr/bin/chromedriver', options=chromeOptions)
    else:

        driver = webdriver.Chrome(service=Service(
            ChromeDriverManager().install()), options=chromeOptions)

    driver.get(f'https://apps.shopify.com/{app_identifier}/reviews')
    html = driver.page_source
    soup = BeautifulSoup(html, features='html.parser')

    script_text = soup.find("script", type="application/ld+json").text
    title = re.search('"name":"(.+?)"', script_text).group(1)
    try:
        rating = re.search('"ratingValue":"(.+?)"', script_text).group(1)
    except AttributeError:
        rating = None
    try:
        rating_count = re.search('"ratingCount":"(.+?)"', script_text).group(1)
    except AttributeError:
        rating_count = None
    image = re.search('"image":\["(.+?)"\]', script_text).group(1)

    output = {
        'title': title,
        'rating': rating,
        'rating_count': rating_count,
        'image': image
    }

    driver.quit()

    return output
