import { createContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

const UserContext = createContext();

function Provider({ children }) {
  // const [activeUser, setActiveUser] = useState(null);

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

  const getAccessToken = async (username, password) => {
    const postBody = {
      username,
      password,
    };

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/token`, postBody, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Referrer-Policy': 'origin',
        },
      });
      return response;
    } catch (err) {
      return err.response;
    }
  };

  const fetchActiveUser = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/users/me', {
      withCredentials: true,
    });
    console.log(response);
  };

  const valueToShare = { registerUser, getAccessToken, fetchActiveUser };

  return <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>;
}

export { Provider };
export default UserContext;
