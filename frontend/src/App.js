import { useContext } from 'react';
import IndexPage from './pages/IndexPage';
import JobsPage from './pages/JobsPage';
import DataPage from './pages/DataPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import ShowPageContext from './context/showPage';

function App() {
  const { showIndexPage, showJobsPage, showDataPage, showRegistrationPage, showLoginPage } = useContext(ShowPageContext);

  return (
    <div>
      {showIndexPage && <IndexPage />}
      {showJobsPage && <JobsPage />}
      {showDataPage && <DataPage />}
      {showRegistrationPage && <RegistrationPage />}
      {showLoginPage && <LoginPage />}
    </div>
  );
}

export default App;
