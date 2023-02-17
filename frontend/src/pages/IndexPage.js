import IndexHeader from '../components/Index/IndexHeader';
import IndexButtonPanel from '../components/Index/IndexButtonPanel';
import StatusPanel from '../components/Index/StatusPanel';
import APIContext from '../context/apis';
import UserContext from '../context/user';
import { useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';

function IndexPage() {
  const { fetchJobs, fetchReviews, fetchApps, fetchAppsUser } = useContext(APIContext);
  const { fetchActiveUser } = useContext(UserContext);

  useEffect(() => {
    fetchActiveUser();
    fetchJobs();
    fetchReviews();
    fetchApps();
    fetchAppsUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='columns-1 m-20'>
      <NavBar />
      <IndexHeader />
      <IndexButtonPanel />
      <StatusPanel />
    </div>
  );
}

export default IndexPage;
