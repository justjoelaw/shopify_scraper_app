from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import re


def verify_shopify_app(app_identifier):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
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

    return output