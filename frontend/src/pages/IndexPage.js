import IndexHeader from '../components/Index/IndexHeader';
import IndexButtonPanel from '../components/Index/IndexButtonPanel';
import StatusPanel from '../components/Index/StatusPanel';
import APIContext from '../context/apis';
import UserContext from '../context/user';
import { useEffect, useContext } from 'react';

function IndexPage() {
  const { fetchReviewsUser, fetchAppsUser } = useContext(APIContext);
  const { activeUser, setActiveUser, fetchActiveUser } = useContext(UserContext);

  useEffect(() => {
    async function setup() {
      const response = await fetchActiveUser();
      setActiveUser(response.data);
    }
    setup();
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetchAppsUser();
      fetchReviewsUser();
    }
  }, [activeUser]);

  return (
    <div>
      <IndexHeader />
      {activeUser && <IndexButtonPanel />}
      {activeUser && <StatusPanel />}
    </div>
  );
}

export default IndexPage;
