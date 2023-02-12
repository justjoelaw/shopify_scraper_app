import IndexHeader from '../components/Index/IndexHeader';
import IndexButtonPanel from '../components/Index/IndexButtonPanel';
import StatusPanel from '../components/Index/StatusPanel';
import APIContext from '../context/apis';
import { useEffect, useContext } from 'react';

function IndexPage() {
  const { fetchJobs, fetchReviews, fetchApps } = useContext(APIContext);

  useEffect(() => {
    fetchJobs();
    fetchReviews();
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='columns-1 m-20'>
      <IndexHeader />
      <IndexButtonPanel />
      <StatusPanel />
    </div>
  );
}

export default IndexPage;
