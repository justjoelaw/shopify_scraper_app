import Panel from '../Panel';
import Button from '../Button';
import { ImPencil, ImCross, ImCheckmark, ImPlay3 } from 'react-icons/im';
import { useContext, useState } from 'react';
import APIContext from '../../context/apis';

function JobsTable() {
  const { deleteJob, deleteApp, fetchJobs, jobs, editJob, startJob } = useContext(APIContext);
  const [showDeleteConfirmIndex, setShowDeleteConfirmIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [jobFrequency, setJobFrequency] = useState(null);

  const handleDelete = (index) => {
    setShowDeleteConfirmIndex(index);
  };

  const handleDeleteConfirm = async (jobId, appId) => {
    await deleteJob(jobId);
    await deleteApp(appId);
    setShowDeleteConfirmIndex(null);
    fetchJobs();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmIndex(null);
  };

  const handleEdit = (job, index) => {
    setEditIndex(index);
    setJobFrequency(job.frequency);
  };

  const handleEditConfirm = async (e, job, newFrequency) => {
    e.preventDefault();
    await editJob(job, newFrequency);
    setEditIndex(null);
    setJobFrequency(null);
    fetchJobs();
  };

  const handleStartJob = async (jobId) => {
    await startJob(jobId);
    fetchJobs();
  };

  const truncate = (str, n) => {
    return str.length > n ? str.slice(0, n - 1) + '...' : str;
  };

  return (
    <Panel className='flex flex-row justify-center'>
      <div className='flex flex-col overflow-x-auto rounded-lg'>
        <table className='table-auto w-full'>
          <thead className='bg-white border-b'>
            <tr>
              <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                ID
              </th>
              <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                App Name
              </th>
              <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                Created At
              </th>
              <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                Frequency
              </th>
              <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                Last Run
              </th>
              <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => {
              const showDeleteConfirm = index === showDeleteConfirmIndex;
              const showEdit = index === editIndex;

              return (
                <tr className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100' key={job.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{job.id}</td>
                  <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>{truncate(job.app.name, 20)}</td>
                  <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>{job.created.split('T')[0]}</td>
                  {showEdit ? (
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                      <form onSubmit={(e) => handleEditConfirm(e, job, jobFrequency)}>
                        <div>
                          <select id='jobFrequency' value={jobFrequency} onChange={(e) => setJobFrequency(e.target.value)}>
                            <option value=''>Select frequency</option>
                            <option value='1'>Hourly</option>
                            <option value='2'>Daily</option>
                          </select>
                        </div>
                        <Button type='submit' warning rounded>
                          <ImCheckmark />
                        </Button>
                      </form>
                    </td>
                  ) : (
                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>{job.frequency}</td>
                  )}
                  <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>{job.last_run_timestamp}</td>
                  {showDeleteConfirm ? (
                    <td className='flex flex-row'>
                      <Button onClick={handleDeleteCancel} primary rounded>
                        Cancel
                      </Button>
                      <Button onClick={() => handleDeleteConfirm(job.id, job.app.id)} danger rounded>
                        Confirm
                      </Button>
                    </td>
                  ) : (
                    <td className='flex flex-row'>
                      <Button success rounded onClick={() => handleStartJob(job.id)}>
                        <ImPlay3 />
                      </Button>
                      <Button onClick={() => handleEdit(job, index)} primary rounded>
                        <ImPencil />
                      </Button>
                      <Button onClick={() => handleDelete(index)} danger rounded>
                        <ImCross />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export default JobsTable;
