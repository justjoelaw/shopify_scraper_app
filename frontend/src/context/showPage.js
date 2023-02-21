import { createContext, useState } from 'react';

const ShowPageContext = createContext();

function Provider({ children }) {
  const [showIndexPage, setShowIndexPage] = useState(true);
  const [showAddAppsPage, setShowAddAppsPage] = useState(false);
  const [showJobsPage, setShowJobsPage] = useState(false);
  const [showDataPage, setShowDataPage] = useState(false);
  const [showAppDataPage, setAppShowDataPage] = useState(false);
  const [showRegistrationPage, setShowRegistrationPage] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  const hideAllPages = () => {
    setShowIndexPage(false);
    setShowAddAppsPage(false);
    setShowJobsPage(false);
    setShowDataPage(false);
    setAppShowDataPage(false);
    setShowRegistrationPage(false);
    setShowLoginPage(false);
  };

  const valueToShare = {
    showIndexPage,
    setShowIndexPage,
    showAddAppsPage,
    setShowAddAppsPage,
    showDataPage,
    setShowDataPage,
    showAppDataPage,
    setAppShowDataPage,
    showRegistrationPage,
    setShowRegistrationPage,
    showLoginPage,
    setShowLoginPage,
    hideAllPages,
    showJobsPage,
    setShowJobsPage,
  };

  return <ShowPageContext.Provider value={valueToShare}>{children}</ShowPageContext.Provider>;
}

export { Provider };
export default ShowPageContext;
