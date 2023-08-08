import { Token, validadeToken, UserInfo } from '../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState } from 'react';

type AuthState = {
  token: Token | undefined;
  userInfo: UserInfo | undefined;
  isAuthenticated: boolean;
  authenticate: (token: Token, userInfo: UserInfo) => void;
  logout: () => void;
  initializeState: () => void;
};

const initialState: AuthState = {
  token: undefined,
  userInfo: undefined,
  isAuthenticated: false,
  authenticate: (token: Token, userInfo: UserInfo) => {},
  logout: () => {},
  initializeState: () => {}
};

export const AuthContext = createContext(initialState);

const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState<Token | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const authenticate = async (token: Token, userInfo: UserInfo): Promise<void> => {
    setAuthToken(token);
    setUserInfo(userInfo);
    await AsyncStorage.setItem('ACCESS_TOKEN', JSON.stringify(token));
    await AsyncStorage.setItem('USER_INFO', JSON.stringify(userInfo));
  };

  const logout = (): void => {
    setAuthToken(undefined);
    setUserInfo(undefined);
    AsyncStorage.removeItem('ACCESS_TOKEN');
    AsyncStorage.removeItem('USER_INFO');
  };

  const initializeState = async () => {
    const accessTokenJson = await AsyncStorage.getItem('ACCESS_TOKEN');
    const userInfoJson = await AsyncStorage.getItem('USER_INFO');
    if (accessTokenJson && userInfoJson) {
      const accessTokenAsyncStorage = JSON.parse(accessTokenJson) as Token;
      const userInfoAsyncStorage = JSON.parse(userInfoJson) as UserInfo;
      const isValid = await validadeToken(accessTokenAsyncStorage);
      if (isValid) {
        setAuthToken(accessTokenAsyncStorage);
        setUserInfo(userInfoAsyncStorage);
      } else {
        logout();
      }
    }
  };

  const value = {
    token: authToken,
    userInfo,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    initializeState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
