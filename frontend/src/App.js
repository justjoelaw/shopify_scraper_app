import { useContext } from 'react';
import IndexPage from './pages/IndexPage';
import JobsPage from './pages/JobsPage';
import DataPage from './pages/DataPage';
import ShowPageContext from './context/showPage';

function App() {
    const {showIndexPage, showJobsPage, showDataPage} = useContext(ShowPageContext);

    return (
        <div>
            {showIndexPage && <IndexPage/>}
            {showJobsPage && <JobsPage/>}
            {showDataPage && <DataPage/>}
        </div>
    )
}


export default App;