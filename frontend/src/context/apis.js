import { createContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const APIContext = createContext();

function Provider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [userApps, setUserApps] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(-1000);
  const [activeAppReviews, setActiveAppReviews] = useState([]);
  const [activeAppReviewsData, setActiveAppReviewsData] = useState([]);

  const fetchJobs = async () => {
    const response = await axios.get('/api/jobs', { withCredentials: true });
    setJobs(response.data.jobs);
  };

  const fetchApps = async () => {
    const response = await axios.get('/api/apps', { withCredentials: true });
    console.log(response.data.apps);
    setApps(response.data.apps);
  };

  const fetchAppsUser = async () => {
    const response = await axios.get('/api/users/me/apps', { withCredentials: true });
    console.log(response.data.apps);
    setUserApps(response.data.apps);
  };

  const fetchReviews = async () => {
    const response = await axios.get('/api/reviews', { withCredentials: true });
    setReviewsCount(response.data.count);
  };

  const fetchReviewsUser = async () => {
    const response = await axios.get('/api/users/me/reviews', { withCredentials: true });
    setReviewsCount(response.data.count);
  };

  const verifyApp = async (appIdentifier) => {
    const response = await axios.get(`/api/verify_app/${appIdentifier}`, { withCredentials: true });
    return response;
  };

  const addApp = async (app) => {
    const postBody = {
      name: app.title,
      identifier: app.appIdentifier,
      image_url: app.image,
    };
    try {
      const response = await axios.post(`/api/apps`, postBody, { withCredentials: true });
      return response;
    } catch (err) {
      return err.response;
    }
  };

  const addJob = async (appId) => {
    const postBody = {
      app: appId,
      last_run_timestamp: null,
    };
    const response = await axios.post(`/api/jobs`, postBody, { withCredentials: true });
    return response;
  };

  const deleteJob = async (jobId) => {
    const response = await axios.delete(`/api/jobs/${jobId}`, { withCredentials: true });
    return response;
  };

  const deleteApp = async (appId) => {
    const response = await axios.delete(`/api/apps/${appId}`, { withCredentials: true });
    return response;
  };

  // const getTracking = async (appId) => {
  //   const response = await get.delete(`/api/trackings/${trackingId}`, { withCredentials: true });
  //   return response;
  // };

  const deleteTrackingByApp = async (appId) => {
    const response = await axios.delete(`/api/app/${appId}/remove_tracking`, {
      withCredentials: true,
    });
    return response;
  };

  const editJob = async (job, newFrequency) => {
    const putBody = {
      ...job,
      app: job.app.id,
      frequency: newFrequency,
    };
    const response = await axios.put(`/api/jobs/${job.id}`, putBody, { withCredentials: true });
    return response;
  };

  const startJob = async (jobId) => {
    const response = await axios.post(`/api/jobs/${jobId}/start`, { withCredentials: true });
    return response;
  };

  const fetchAppReviewsData = async (appId) => {
    const response = await axios.get(`/api/apps/${appId}/reviews/data`, { withCredentials: true });
    console.log('Running fetchAppReviewsData');
    setActiveAppReviewsData(response);
    console.log(response);
    return response;
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
    deleteApp,
    editJob,
    startJob,
    fetchApps,
    apps,
    activeAppReviews,
    fetchAppReviewsData,
    activeAppReviewsData,
    fetchAppsUser,
    userApps,
    fetchReviewsUser,
    deleteTrackingByApp,
  };

  return <APIContext.Provider value={valueToShare}>{children}</APIContext.Provider>;
}

export { Provider };
export default APIContext;
