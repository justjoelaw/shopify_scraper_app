import JobsHeader from '../components/Jobs/JobsHeader';
import JobsTable from '../components/Jobs/JobsTable';
import NavBar from '../components/NavBar';
import AddJobPanel from '../components/Jobs/AddJobPanel';

function JobsPage() {
  return (
    <div className='columns-1 m-20'>
      <NavBar />
      <JobsHeader />
      <JobsTable />
      <AddJobPanel />
    </div>
  );
}

export default JobsPage;
