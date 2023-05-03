import axios from 'axios';

const API_KEY = 'AIzaSyDCYasArcOwcALFhIj2szug5aD2PgUQu1E';

export type Token = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type UserInfo = {
  username: string;
  email: string;
};

export type facebookCallbackParams = {
  facebook_access_token: string;
  app_id: string;
  user_id: string;
  username: string;
  email: string;
  pictureUrl: string;
};

export const authenticateFacebook = async (
  params: facebookCallbackParams
): Promise<Token | undefined> => {
  const url = `http://10.0.2.2:3000/token`;

  let accessToken: Token | undefined = undefined;

  const options = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  };
  const uninterceptedAxiosInstance = axios.create();
  accessToken = await uninterceptedAxiosInstance
    .post(
      url,
      {
        grant_type: 'facebook',
        access_token: params.facebook_access_token,
        client_id: 'social_facebook',
        client_secret: 'social_facebook',
        app_id: '592502122839259',
        user_id: params.user_id,
        username: params.username,
        email: params.email,
        pictureUrl: params.pictureUrl
        // resource: 'http://localhost:3006',
        // scope: 'openid email profile phone address offline_access'
      },
      options
    )
    .then((response) => {
      return response.data as Token;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });

  return accessToken;
};

export const validadeToken = async (params: Token): Promise<boolean> => {
  const url = `http://10.0.2.2:3000/token/introspection`;

  const options = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  };

  const isValid: boolean = await axios
    .post(
      url,
      {
        token: params.access_token,
        client_id: 'social_facebook',
        client_secret: 'social_facebook'
      },
      options
    )
    .then((response) => {
      return response.data.active as boolean;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

  return isValid;
};

const authenticate = async (mode, email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email,
    password,
    returnSecureToken: true
  });

  const token = response.data.idToken;

  return token;
};

export const createUser = (email, password) => {
  return authenticate('signUp', email, password);
};

export const login = (email, password) => {
  return authenticate('signInWithPassword', email, password);
};
