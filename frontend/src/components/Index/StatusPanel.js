import Panel from '../Panel';
import Header from '../Header';
import { useContext } from 'react';
import APIContext from '../../context/apis';

function StatusPanel() {
  const { userApps } = useContext(APIContext);
  const { reviewsCount } = useContext(APIContext);

  return (
    <Panel>
      <Header size='h2'>Status</Header>
      <div>
        <span className='font-bold'>Apps Tracked:</span> {userApps.length} / 5
        <br />
        <span className='font-bold'>Reviews Collected:</span> {reviewsCount}
      </div>
    </Panel>
  );
}

export default StatusPanel;
