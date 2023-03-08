import Panel from '../Panel';
import Button from '../Button';
import { useContext } from 'react';
import ShowPageContext from '../../context/showPage';
import UserContext from '../../context/user';

function IndexButtonPanel() {
  const { setShowAddAppsPage, setShowIndexPage, setShowDataPage, setShowJobsPage } = useContext(ShowPageContext);
  const { activeUser } = useContext(UserContext);

  const handleClickAddApps = () => {
    setShowIndexPage(false);
    setShowAddAppsPage(true);
  };

  const handleClickData = () => {
    setShowIndexPage(false);
    setShowDataPage(true);
  };

  const handleManageJobs = () => {
    setShowIndexPage(false);
    setShowJobsPage(true);
  };

  return (
    <Panel className='flex flex-row justify-center flex-wrap'>
      <Button onClick={handleClickAddApps} primary large rounded className='flex-grow mx-2'>
        Add App
      </Button>
      <Button onClick={handleClickData} primary large rounded className='flex-grow mx-2'>
        View Data
      </Button>
      {activeUser.is_superuser && (
        <Button onClick={handleManageJobs} primary large rounded className='flex-grow mx-2'>
          Manage Jobs
        </Button>
      )}
    </Panel>
  );
}

export default IndexButtonPanel;
