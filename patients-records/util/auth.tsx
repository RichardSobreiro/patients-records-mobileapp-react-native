import axios from 'axios';

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

export type TokenPasswordGranType = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
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
  const url = `${process.env.AUTHNZ_URL}/token`;

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
      console.log(`util\\auth.tsx: authenticateFacebook method Error:${err}`);
      return undefined;
    });

  return accessToken;
};

export const validadeToken = async (params: Token): Promise<boolean> => {
  // const url = `${process.env.AUTHNZ_URL}/token/introspection`;

  // const options = {
  //   headers: { 'content-type': 'application/x-www-form-urlencoded' }
  // };
  // const uninterceptedAxiosInstance = axios.create();
  // const isValid: boolean = await uninterceptedAxiosInstance
  //   .post(
  //     url,
  //     {
  //       token: params.access_token,
  //       client_id: 'social_facebook',
  //       client_secret: 'social_facebook'
  //     },
  //     options
  //   )
  //   .then((response) => {
  //     return response.data.active as boolean;
  //   })
  //   .catch((err) => {
  //     console.log(`util\\auth.tsx: validadeToken method Error:${err}`);
  //     return false;
  //   });

  // return isValid;
  return true;
};

export const createUser = async (email, password, username) => {
  const url = `${process.env.AUTHNZ_URL}/users`;

  const uninterceptedAxiosInstance = axios.create();
  const options = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  };
  const response = await uninterceptedAxiosInstance
    .post(
      url,
      {
        email,
        password,
        username
      },
      options
    )
    .then((response) => {
      return response as unknown as string;
    })
    .catch((err) => {
      console.log(`createUser: ${err}`);
      return undefined;
    });

  return response;
};

export const login = async (email, password) => {
  const url = `${process.env.AUTHNZ_URL}/token`;

  const uninterceptedAxiosInstance = axios.create();
  const options = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  };
  const response = await uninterceptedAxiosInstance
    .post(
      url,
      {
        client_id: 'web_professionals',
        client_secret: 'web_professionals',
        grant_type: 'password',
        scope: 'openid',
        prompt: 'consent',
        usernameEmail: email,
        password,
        resource: 'https://api.portal-atender.com'
      },
      options
    )
    .then((response) => {
      return response.data as unknown as TokenPasswordGranType;
    })
    .catch((err) => {
      console.log(`login: ${err}`);
      return undefined;
    });

  return response;
};
