import Button from '../Button';
import Panel from '../Panel';
import AddAppForm from './AddAppForm';
import Header from '../Header';

function AddAppsPanel() {
  return (
    <Panel>
      <div>
        <br />
        <Header size={'h2'}>Add a new app:</Header>
        <div>
          The App Identifier can be found in the Shopify App Store URL: https://apps.shopify.com/
          <span className='font-bold'>app_identifier</span>/reviews{' '}
        </div>
        <br />
        <AddAppForm />
      </div>
    </Panel>
  );
}

export default AddAppsPanel;
