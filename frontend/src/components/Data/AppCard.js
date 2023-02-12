import Header from '../../components/Header';
import Button from '../../components/Button';

function AppCard({ app, handleAppClick }) {
  const handleClick = () => {
    handleAppClick(app);
  };

  return (
    <div className='flex flex-col max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2'>
      <img className='rounded-t-lg' src={app.image_file} alt='' />
      <div className='flex flex-grow flex-col p-5'>
        <Header size={'h2'}>{app.name}</Header>
        <div className='flex-grow'></div>
        <Button onClick={handleClick} className='align-self-end' primary rounded>
          View Data
        </Button>
      </div>
    </div>
  );
}

export default AppCard;
