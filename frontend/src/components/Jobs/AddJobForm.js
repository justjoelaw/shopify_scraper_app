import { useState, useContext, useEffect } from 'react';
import Button from '../Button';
import APIContext from '../../context/apis';
import AppIcon from '../AppIcon';
import Header from '../Header';

const AddJobForm = ({ onSubmit }) => {
  const { addApp, addJob, verifyApp, fetchJobs } = useContext(APIContext);

  const [appIdentifier, setAppIdentifier] = useState('');
  const [jobFrequency, setJobFrequency] = useState(2);
  const [showAddJobVerify, setShowAddJobVerify] = useState(true);
  const [showAddJobSubmit, setShowAddJobSubmit] = useState(false);
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(false);
  const [app, setApp] = useState({});
  const [newAppId, setNewAppId] = useState(null);

  useEffect(() => {
    const addJobEffect = async () => {
      if (newAppId) {
        await addJob(jobFrequency, newAppId);
        fetchJobs();
        onSubmit();
      }
    };
    addJobEffect();
  }, [newAppId]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifyButtonDisabled(true);
    const response = await verifyApp(appIdentifier);
    alert(response.data.message);
    setVerifyButtonDisabled(false);

    if (response.data.verified) {
      setShowAddJobVerify(false);
      setShowAddJobSubmit(true);
      setApp({
        ...response.data.data,
        appIdentifier,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addAppResponse = await addApp(app);
    console.log(addAppResponse.data.identifier);
    if (addAppResponse.data.identifier[0] === 'app with this identifier already exists.') {
      alert('You already have a job running for this app');
    } else {
      setNewAppId(addAppResponse.data.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='appIdentifier'>App Identifier:</label>
        <input type='text' id='appIdentifier' value={appIdentifier} onChange={(e) => setAppIdentifier(e.target.value)} />
      </div>
      <div>
        <label htmlFor='jobFrequency'>Frequency:</label>
        <select id='jobFrequency' value={jobFrequency} onChange={(e) => setJobFrequency(e.target.value)}>
          <option value=''>Select frequency</option>
          <option value='1'>Hourly</option>
          <option value='2'>Daily</option>
        </select>
      </div>
      {showAddJobVerify && (
        <Button primary rounded disabled={verifyButtonDisabled} onClick={handleVerify}>
          Verify App
        </Button>
      )}
      {showAddJobSubmit && (
        <div>
          <Header size='h3'>App details:</Header>
          <div className='flex flex-row'>
            <div className='w-1/2 p-2'>
              <AppIcon small url={app.image} />
            </div>
            <div className='w-1/2 p-2'>
              <span className='font-bold'>App Name:</span> {app.title}
              <br />
              <span className='font-bold'>Rating:</span> {app.rating}
              <br />
              <span className='font-bold'>Rating Count:</span> {app.rating_count}
            </div>
          </div>
          <Button primary rounded type='submit'>
            Submit
          </Button>
        </div>
      )}
    </form>
  );
};

export default AddJobForm;
