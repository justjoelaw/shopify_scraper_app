import { useContext } from 'react';
import IndexPage from './pages/IndexPage';
import AddAppsPage from './pages/AddAppsPage';
import DataPage from './pages/DataPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ShowPageContext from './context/showPage';
import UserContext from './context/user';
import NavBar from './components/NavBar';
import JobsPage from './pages/JobsPage';

function App() {
  const { showIndexPage, showAddAppsPage, showDataPage, showRegistrationPage, showLoginPage, showJobsPage } = useContext(ShowPageContext);
  const { activeUser } = useContext(UserContext);

  return (
    <div className='columns-1 m-20'>
      <NavBar user={activeUser} />
      {showIndexPage && <IndexPage />}
      {showAddAppsPage && <AddAppsPage />}
      {showJobsPage && <JobsPage />}
      {showDataPage && <DataPage />}
      {showRegistrationPage && <RegistrationPage />}
      {showLoginPage && <LoginPage />}
    </div>
  );
}

export default App;
