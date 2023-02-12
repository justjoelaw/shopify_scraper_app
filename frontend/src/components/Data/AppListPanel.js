import Panel from '../Panel';
import AppCard from './AppCard';

function AppListPanel({ apps, handleAppClick }) {
  const renderedAppCards = apps.map((app) => {
    return <AppCard key={app.id} app={app} handleAppClick={handleAppClick} />;
  });

  return <Panel className='flex flex-row justify-evenly flex-wrap'>{renderedAppCards}</Panel>;
}

export default AppListPanel;
