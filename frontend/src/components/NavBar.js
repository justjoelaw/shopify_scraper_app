import Panel from './Panel';
import Button from '../components/Button';
import { ImHome } from 'react-icons/im';
import { useContext } from 'react';
import ShowPageContext from '../context/showPage';

function NavBar() {
  const {
    setShowIndexPage,
    setShowJobsPage,
    setShowDataPage,
    setAppShowDataPage,
    showRegistrationPage,
    setShowRegistrationPage,
    showLoginPage,
    setShowLoginPage,
    hideAllPages,
  } = useContext(ShowPageContext);

  const handleHomeClick = () => {
    hideAllPages();
    setShowIndexPage(true);
  };

  const handleRegister = () => {
    hideAllPages();
    setShowRegistrationPage(true);
  };

  const handleLogin = () => {
    hideAllPages();
    setShowLoginPage(true);
  };

  return (
    <Panel className='flex flex-row'>
      <Button onClick={handleHomeClick} primary rounded>
        <ImHome />
      </Button>
      <Button onClick={handleRegister} primary rounded>
        Register
      </Button>
      <Button onClick={handleLogin} primary rounded>
        Login
      </Button>
      <Button primary rounded>
        Logout
      </Button>
    </Panel>
  );
}

export default NavBar;
