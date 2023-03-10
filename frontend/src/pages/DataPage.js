import { useContext, useState, useEffect } from 'react';
import APIContext from '../context/apis';
import DataHeader from '../components/Data/DataHeader';
import AppListPanel from '../components/Data/AppListPanel';
import AppDataPanel from '../components/Data/AppDataPanel';

function DataPage() {
  const [showAppListPanel, setShowAppListPanel] = useState(true);
  const [showAppDataPanel, setShowAppDataPanel] = useState(false);
  const [activeApp, setActiveApp] = useState(null);

  const { userApps, fetchAppReviewsData, activeAppReviewsData, deleteTrackingByApp, fetchAppsUser } = useContext(APIContext);

  useEffect(() => {
    const effectAsync = async () => {
      if (activeApp) {
        const response = await fetchAppReviewsData(activeApp.id);
        setShowAppListPanel(false);
        setShowAppDataPanel(true);
      } else {
        setShowAppListPanel(true);
        setShowAppDataPanel(false);
      }
    };
    effectAsync();
  }, [activeApp]);

  const handleAppClick = (app) => {
    setActiveApp(app);
  };

  const handleBackClick = () => {
    setActiveApp(null);
  };

  const handleRemoveApp = async (appId) => {
    setActiveApp(null);
    await deleteTrackingByApp(appId);
    fetchAppsUser();
  };

  return (
    <div>
      <DataHeader />
      {showAppListPanel && <AppListPanel apps={userApps} handleAppClick={handleAppClick} />}
      {showAppDataPanel && activeApp && (
        <AppDataPanel
          activeAppReviewsData={activeAppReviewsData}
          app={activeApp}
          handleBackClick={handleBackClick}
          handleRemoveApp={handleRemoveApp}
        />
      )}
    </div>
  );
}

export default DataPage;
