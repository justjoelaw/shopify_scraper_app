import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const UserContext = createContext();

function Provider({ children }) {
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    axios.defaults.headers.post['X-CSRFToken'] = cookies.get('csrftoken');
    axios.defaults.headers.delete['X-CSRFToken'] = cookies.get('csrftoken');
    axios.defaults.headers.put['X-CSRFToken'] = cookies.get('csrftoken');
  }, [activeUser]);

  const registerUser = async (username, email, password) => {
    const postBody = {
      username,
      email,
      password,
    };
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/users`, postBody);
      return response;
    } catch (err) {
      return err.response;
    }
  };

  const fetchActiveUser = async () => {
    const response = await axios.get('/api/users/me', { withCredentials: true });
    return response;
  };

  const login = async (username, password) => {
    const postBody = {
      username,
      password,
    };
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/login`, postBody, { withCredentials: true });
      setActiveUser(response.data);
      return response;
    } catch (err) {
      return err.response;
    }
  };

  const logout = async () => {
    const postBody = {};
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/logout`, postBody, { withCredentials: true });
      setActiveUser(null);
      return response;
    } catch (err) {
      return err.response;
    }
  };

  const valueToShare = { registerUser, fetchActiveUser, login, logout, activeUser, setActiveUser };

  return <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>;
}

export { Provider };
export default UserContext;
