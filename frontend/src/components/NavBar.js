import Panel from './Panel';
import Button from '../components/Button';
import { ImHome } from 'react-icons/im';
import { useContext } from 'react';
import ShowPageContext from '../context/showPage';
import UserContext from '../context/user';

function NavBar({ user }) {
  const { setShowIndexPage, setShowRegistrationPage, setShowLoginPage, hideAllPages } = useContext(ShowPageContext);

  const { logout } = useContext(UserContext);

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

  const handleLogout = () => {
    logout();
  };

  return (
    <Panel className='flex flex-row gap-x-2'>
      <Button onClick={handleHomeClick} primary rounded>
        <ImHome />
      </Button>
      {!user && (
        <Button onClick={handleRegister} primary rounded>
          Register
        </Button>
      )}
      {!user && (
        <Button onClick={handleLogin} primary rounded>
          Login
        </Button>
      )}
      {user && (
        <Button onClick={handleLogout} primary rounded>
          Logout
        </Button>
      )}
      <div className='flex flex-grow flex-row justify-end'>
        <span className='font-bold'>{user && user.username}</span>
      </div>
    </Panel>
  );
}

export default NavBar;
