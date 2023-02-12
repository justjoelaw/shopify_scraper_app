import Button from '../Button';
import Header from '../Header';
import Panel from '../Panel';
import { useState } from 'react';
import AppReviewsPlot from './AppReviewsPlot';

function AppDataPanel({ app, handleBackClick, activeAppReviewsData }) {
  const monthMeanRating = activeAppReviewsData.data.month_aggregated.mean;
  const quarterMeanRating = activeAppReviewsData.data.quarter_aggregated.mean;

  const [dataGrouping, setDataGrouping] = useState(quarterMeanRating);

  const handleClickMonthly = () => {
    setDataGrouping(monthMeanRating);
  };

  const handleClickQuarterly = () => {
    setDataGrouping(quarterMeanRating);
  };

  return (
    <div>
      <Panel>
        <Header size='h1'>{app.name}</Header>
        <div>
          <span className='font-bold'>Reviews Collected: </span>
          {activeAppReviewsData.data.rating_count}
          <br />
          <span className='font-bold'>Rating: </span>
          {activeAppReviewsData.data.reviews_average_rating}
        </div>
        <div className='flex flex-row'>
          <AppReviewsPlot dataRating={dataGrouping} />
          <div className='flex flex-col'>
            <Button onClick={handleClickMonthly} className='my-1 focus:bg-violet-700' primary rounded>
              Monthly
            </Button>
            <Button onClick={handleClickQuarterly} className='my-1 focus:bg-violet-700' primary rounded>
              Quarterly
            </Button>
          </div>
        </div>
        <Button primary rounded onClick={handleBackClick}>
          Back
        </Button>
      </Panel>
    </div>
  );
}

export default AppDataPanel;
