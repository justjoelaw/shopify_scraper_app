import Panel from '../Panel';
import Button from '../Button';
import { useContext } from 'react';
import ShowPageContext from '../../context/showPage';

function IndexButtonPanel() {
  const { setShowJobsPage, setShowIndexPage, setShowDataPage } = useContext(ShowPageContext);

  const handleClickJobs = () => {
    setShowIndexPage(false);
    setShowJobsPage(true);
  };

  const handleClickData = () => {
    setShowIndexPage(false);
    setShowDataPage(true);
  };

  return (
    <Panel className='flex flex-row justify-center flex-wrap'>
      <Button onClick={handleClickJobs} primary large rounded className='flex-grow mx-2'>
        Add App
      </Button>
      <Button onClick={handleClickData} primary large rounded className='flex-grow mx-2'>
        View Data
      </Button>
    </Panel>
  );
}

export default IndexButtonPanel;
