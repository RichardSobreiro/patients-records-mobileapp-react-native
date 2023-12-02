import PaymentInstalmentsStatus from '../constants/enums/PaymentInstalmentsStatus';
import { Token, TokenPasswordGranType, UserInfo, validadeToken } from '../util/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState } from 'react';

type AuthState = {
  token: Token | TokenPasswordGranType | undefined;
  userInfo: UserInfo | undefined;
  isAuthenticated: boolean;
  authenticate: (token: Token | TokenPasswordGranType, userInfo: UserInfo) => void;
  logout: () => void;
  initializeState: () => void;
  setUserCreationCompleted: (value: boolean) => void;
  setPaymentStatus: (paymentStatus: PaymentInstalmentsStatus) => void;
};

const initialState: AuthState = {
  token: undefined,
  userInfo: undefined,
  isAuthenticated: false,
  authenticate: (token: Token | TokenPasswordGranType, userInfo: UserInfo) => {},
  logout: () => {},
  initializeState: () => {},
  setUserCreationCompleted: (value: boolean) => {},
  setPaymentStatus: (paymentStatus: PaymentInstalmentsStatus) => {}
};

export const AuthContext = createContext(initialState);

const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState<Token | TokenPasswordGranType | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

  const authenticate = async (
    token: Token | TokenPasswordGranType,
    userInfo: UserInfo
  ): Promise<void> => {
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

  const setUserCreationCompleted = async (value: boolean) => {
    const asyncStorageUserInfo = { ...userInfo };
    asyncStorageUserInfo.userCreationCompleted = value;
    await AsyncStorage.setItem('USER_INFO', JSON.stringify(asyncStorageUserInfo));
    setUserInfo((currentUserInfo) => {
      if (currentUserInfo) {
        const newUserInfo = { ...currentUserInfo };
        newUserInfo.userCreationCompleted = value;
        return newUserInfo;
      } else {
        return currentUserInfo;
      }
    });
  };

  const setPaymentStatus = async (paymentStatus: PaymentInstalmentsStatus) => {
    const asyncStorageUserInfo = { ...userInfo };
    asyncStorageUserInfo.paymentStatus = paymentStatus as unknown as string;
    await AsyncStorage.setItem('USER_INFO', JSON.stringify(asyncStorageUserInfo));
    setUserInfo((currentUserInfo) => {
      if (currentUserInfo) {
        const newUserInfo = { ...currentUserInfo };
        newUserInfo.paymentStatus = paymentStatus as unknown as string;
        return newUserInfo;
      } else {
        return currentUserInfo;
      }
    });
  };

  const value = {
    token: authToken,
    userInfo,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
    initializeState,
    setUserCreationCompleted,
    setPaymentStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
