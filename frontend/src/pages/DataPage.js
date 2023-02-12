import { useContext, useState, useEffect } from 'react';
import APIContext from '../context/apis';
import NavBar from '../components/NavBar';
import DataHeader from '../components/Data/DataHeader';
import AppListPanel from '../components/Data/AppListPanel';
import AppDataPanel from '../components/Data/AppDataPanel';

function DataPage() {
  const [showAppListPanel, setShowAppListPanel] = useState(true);
  const [showAppDataPanel, setShowAppDataPanel] = useState(false);
  const [activeApp, setActiveApp] = useState(null);

  const { apps, fetchAppReviewsData, activeAppReviewsData } = useContext(APIContext);

  useEffect(() => {
    const effectAsync = async () => {
      if (activeApp) {
        await fetchAppReviewsData(activeApp.id);
        console.log('UseEffect running');
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

  return (
    <div className='columns-1 m-20'>
      <NavBar />
      <DataHeader />
      {showAppListPanel && <AppListPanel apps={apps} handleAppClick={handleAppClick} />}
      {showAppDataPanel && activeApp && (
        <AppDataPanel activeAppReviewsData={activeAppReviewsData} app={activeApp} handleBackClick={handleBackClick} />
      )}
    </div>
  );
}

export default DataPage;
