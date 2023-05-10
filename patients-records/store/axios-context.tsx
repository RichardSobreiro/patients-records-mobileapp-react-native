/* eslint-disable import/order */
import { AuthContext } from './auth-context';
import axios from 'axios';
import { createContext, useContext } from 'react';

export const AxiosContext = createContext(null);

const AxiosContextProvider = ({ children }) => {
  const authCtx = useContext(AuthContext);
  if (authCtx.token) {
    axios.interceptors.request.use(
      (config) => {
        config.headers['Authorization'] = 'Bearer ' + authCtx.token?.access_token;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      null,
      { synchronous: true }
    );
  }

  return <AxiosContext.Provider value={null}>{children}</AxiosContext.Provider>;
};

export default AxiosContextProvider;
