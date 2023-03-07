# Shopify App Store Scraper

http://shopify-scraper-v3-dev.eu-west-2.elasticbeanstalk.com/

**Set up jobs to scrape reviews from the Shopify App Store!**
- Run and track scraping jobs from the UI
- Analyse review rating trends over time

I built this project primarily to get some hands-on practice using React, focusing on a real-world problem I had encountered.
The app employs the following technologies:
- Django - backend
- Django Rest Framework - REST API
- Selenium & BeautifulSoup - webscraping
- AWS - jobs are placed into an SQS queue and executed using Lambda functions. The app is hosted on Elastic Beanstalk
- React - frontend

## Usage

The tool comprises of two main screens: Add App and Data:
![image](https://user-images.githubusercontent.com/57088672/223515286-507620bc-adf7-44f6-b863-7636e9bdc549.png)

- Add apps to your account and view trends in review score over time
![add_app_view_data](https://user-images.githubusercontent.com/57088672/223522354-f0e75601-1e88-4b86-8898-3279475d7fbe.gif)

- The scraper jobs execute daily using AWS SQS and Lambda
