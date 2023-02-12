import Header from '../Header';
import Panel from '../Panel';

function IndexHeader() {
  return (
    <Panel>
      <Header size='h1'>Shopify Scraper Tool</Header>
      <div>
        This tool allows you to create and run jobs which scrape review data from the Shopify App Store
        <br />
        It is comprised of 3 main parts:
        <br />
        1. Backend: Django & Django REST Framework
        <br />
        2. Frontend: React
        <br />
        3. Webscraper: BeautifulSoup & Selenium
        <br />
        <br />
        The "Last Run Timestamp" is stored for each job. The scraper will iterate over each page of reviews until it hits this date.
        <br />
        <span className='font-bold'>Next feature:</span> Job Scheduling
      </div>
    </Panel>
  );
}

export default IndexHeader;
