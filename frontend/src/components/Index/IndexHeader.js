import Header from '../Header';
import Panel from '../Panel';

function IndexHeader() {
  return (
    <Panel>
      <Header size='h1'>Shopify Scraper Tool</Header>
      <div>
        This tool allows users to collect reviews for apps on the Shopify App Store
        <br />
        It is comprised of:
        <br />
        1. Backend: Django & Django REST Framework
        <br />
        2. Frontend: React
        <br />
        3. Webscraper: BeautifulSoup & Selenium - jobs are queued and executed by AWS (SQS and Lambda)
        <br />
        <br />
        The "Last Run Timestamp" is stored for each job. The scraper will iterate over each page of reviews until it hits this date.
        <br />
        <span className='font-bold'>Next feature:</span> Image caching
      </div>
    </Panel>
  );
}

export default IndexHeader;
