import Button from '../Button';
import Panel from '../Panel';
import { useState } from 'react';
import AddJobForm from './AddJobForm';
import Header from '../Header';

function AddJobPanel() {
  const [showAddJobForm, setShowAddJobForm] = useState(false);

  const handleClick = () => {
    setShowAddJobForm(!showAddJobForm);
  };

  const handleSubmit = () => {
    setShowAddJobForm(!showAddJobForm);
  };

  return (
    <Panel>
      <Button onClick={handleClick} primary rounded>
        {showAddJobForm ? 'Close' : 'Add Job'}
      </Button>
      {showAddJobForm && (
        <div>
          <br />
          <Header size={'h2'}>Add a new job:</Header>
          <div>
            The App Identifier can be found in the Shopify App Store URL: https://apps.shopify.com/
            <span className='font-bold'>app_identifier</span>/reviews{' '}
          </div>
          <br />
          <AddJobForm onSubmit={handleSubmit} />
        </div>
      )}
    </Panel>
  );
}

export default AddJobPanel;
