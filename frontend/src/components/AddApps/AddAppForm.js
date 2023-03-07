import { useState, useContext } from 'react';
import Button from '../Button';
import APIContext from '../../context/apis';
import AppIcon from '../AppIcon';
import Header from '../Header';

const AddAppForm = () => {
  const { addApp, verifyApp, startJobLambda } = useContext(APIContext);

  const [appIdentifier, setAppIdentifier] = useState('');
  const [showAddAppVerify, setShowAddAppVerify] = useState(true);
  const [showAddAppSubmit, setShowAddAppSubmit] = useState(false);
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(false);
  const [app, setApp] = useState({});
  const [newAppId, setNewAppId] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifyButtonDisabled(true);
    const response = await verifyApp(appIdentifier);
    alert(response.data.message);
    setVerifyButtonDisabled(false);

    if (response.data.verified) {
      setShowAddAppVerify(false);
      setShowAddAppSubmit(true);
      setApp({
        ...response.data.data,
        appIdentifier,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addAppResponse = await addApp(app);
    console.log(addAppResponse);
    const jobId = addAppResponse.data.job_id;
    if ([200, 201].includes(addAppResponse.status)) {
      setNewAppId(addAppResponse.data.app.id);
      startJobLambda(jobId);
      alert("App added. Scraping data may take a few minutes. Check the 'View Data' page for progress");
    } else {
      alert(addAppResponse.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='appIdentifier'>App Identifier:</label>
        <input type='text' id='appIdentifier' value={appIdentifier} onChange={(e) => setAppIdentifier(e.target.value)} />
      </div>
      {showAddAppVerify && (
        <Button primary rounded disabled={verifyButtonDisabled} onClick={handleVerify}>
          Verify App
        </Button>
      )}
      {showAddAppSubmit && (
        <div>
          <Header size='h3'>App details:</Header>
          <div className='flex flex-row'>
            <div className='w-1/2 p-2'>
              <AppIcon small url={app.image} />
            </div>
            <div className='w-1/2 p-2'>
              <span className='font-bold'>App Name:</span> {app.title.replace(/\\u(\d+)/g, (_, code) => String.fromCharCode(parseInt(code, 16)))}
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

export default AddAppForm;
