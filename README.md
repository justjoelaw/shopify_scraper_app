# Shopify App Store Scraper

**Set up jobs to scrape reviews from the Shopify App Store!**
- Run and track scraping jobs from the UI
- Analyse review rating trends over time

I built this project primarily to get some hands-on practice using React, focusing on a real-world problem I had encountered.
The app employs the following technologies:
- Django - as a backend
- Django Rest Framework - REST API
- Selenium & BeautifulSoup - webscraping
- React - frontend

## Usage

The tool comprises of two main screens: Jobs and Data:
![image](https://user-images.githubusercontent.com/57088672/218487728-c4176c01-c2b8-474a-a9b0-8e40627c47ee.png)


## Installation

### Prequisites
- [Git](https://git-scm.com/downloads)
- [Python 3.x](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/download/)


### 1. Clone the repository
 ```
 git clone https://github.com/justjoelaw/shopify_scraper_app.git
```
### 2. Install requirements
It is recommended you use a virtual environment for this
```
pip install -r requirements.txt
```
### 3. Create a new database
```
sqlite3 ./backend/db.sqlite3
```
### 4. Migrate the database
```
python backend/manage.py migrate
```
### 5. Install frontend dependencies
```
cd frontend
npm install
```
### 6. Build the React package
```
npm run build
```
### 7. Run the Django server
```
python backend/manage.py runserver

The app should now be running at `http://localhost:8000/`
```

