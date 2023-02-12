import Panel from './Panel';
import Button from '../components/Button';
import { ImHome } from 'react-icons/im';
import { useContext } from 'react';
import ShowPageContext from '../context/showPage';

function NavBar() {
  const { setShowIndexPage, setShowJobsPage, setShowDataPage, setAppShowDataPage } = useContext(ShowPageContext);

  const handleHomeClick = () => {
    setShowIndexPage(true);
    setShowJobsPage(false);
    setShowDataPage(false);
    setAppShowDataPage(false);
  };

  return (
    <Panel>
      <Button onClick={handleHomeClick} primary rounded>
        <ImHome />
      </Button>
    </Panel>
  );
}

export default NavBar;
