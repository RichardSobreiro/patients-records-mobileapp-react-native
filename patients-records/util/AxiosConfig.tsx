import { Token } from './auth';
import axios from 'axios';

const AxiosConfig = (token: Token) => {
  axios.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = 'Bearer ' + token.access_token;
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    null,
    { synchronous: true }
  );
};

export default AxiosConfig;
