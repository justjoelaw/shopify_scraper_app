import { createContext, useState } from 'react';
import axios from 'axios';

const APIContext = createContext();

function Provider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(-1000);
  const [activeAppReviews, setActiveAppReviews] = useState([]);
  const [activeAppReviewsData, setActiveAppReviewsData] = useState([]);

  const fetchJobs = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/jobs/');
    setJobs(response.data.jobs);
  };

  const fetchApps = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/apps/');
    console.log(response.data.apps);
    setApps(response.data.apps);
  };

  const fetchReviews = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/reviews/');
    setReviewsCount(response.data.count);
  };

  const verifyApp = async (appIdentifier) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/verify_app/${appIdentifier}`);
    return response;
  };

  const addApp = async (app) => {
    const postBody = {
      name: app.title,
      identifier: app.appIdentifier,
      image_url: app.image,
    };
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/apps/`, postBody);
      return response;
    } catch (err) {
      return err.response;
    }
  };

  const addJob = async (frequency, appId) => {
    const postBody = {
      app: appId,
      frequency,
      last_run_timestamp: null,
      user: 1,
    };
    const response = await axios.post(`http://127.0.0.1:8000/api/jobs/`, postBody);
    return response;
  };

  const deleteJob = async (jobId) => {
    const response = await axios.delete(`http://127.0.0.1:8000/api/jobs/${jobId}`);
    return response;
  };

  const editJob = async (job, newFrequency) => {
    const putBody = {
      ...job,
      app: job.app.id,
      frequency: newFrequency,
    };
    const response = await axios.put(`http://127.0.0.1:8000/api/jobs/${job.id}/`, putBody);
    return response;
  };

  const startJob = async (jobId) => {
    const response = await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/start`);
    return response;
  };

  const fetchAppReviewsData = async (appId) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/apps/${appId}/reviews/data/`);
    console.log('Running fetchAppReviewsData');
    setActiveAppReviewsData(response);
  };

  const valueToShare = {
    jobs,
    fetchJobs,
    reviewsCount,
    fetchReviews,
    verifyApp,
    addApp,
    addJob,
    deleteJob,
    editJob,
    startJob,
    fetchApps,
    apps,
    activeAppReviews,
    fetchAppReviewsData,
    activeAppReviewsData,
  };

  return <APIContext.Provider value={valueToShare}>{children}</APIContext.Provider>;
}

export { Provider };
export default APIContext;
