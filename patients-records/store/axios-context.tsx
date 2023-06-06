/* eslint-disable import/order */
import { AuthContext } from './auth-context';
import axios from 'axios';
import { createContext, useContext } from 'react';

export const AxiosContext = createContext(null);

const AxiosContextProvider = ({ children }) => {
  const authCtx = useContext(AuthContext);
  if (authCtx.token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + authCtx.token?.access_token;
    axios.defaults.headers['Content-Type'] = 'application/json';
  } else {
    axios.defaults.headers['Authorization'] = null;
    axios.defaults.headers['Content-Type'] = null;
  }

  return <AxiosContext.Provider value={null}>{children}</AxiosContext.Provider>;
};

export default AxiosContextProvider;
