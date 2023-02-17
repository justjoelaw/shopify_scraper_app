import Panel from '../Panel';
import Header from '../Header';
import NavBar from '../NavBar';
import { useContext } from 'react';
import APIContext from '../../context/apis';

function StatusPanel() {
  const { userApps } = useContext(APIContext);

  return (
    <Panel>
      <Header size='h2'>Status</Header>
      <div>
        <span className='font-bold'>Apps Tracked:</span> {userApps.length}
        <br />
        <span className='font-bold'>Reviews Collected:</span>
      </div>
    </Panel>
  );
}

export default StatusPanel;
