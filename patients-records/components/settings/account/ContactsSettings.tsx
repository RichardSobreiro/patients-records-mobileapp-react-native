import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import { AuthContext } from '../../../store/auth-context';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useState } from 'react';

type Props = {
  navigation: any;
};

type Inputs = {
  email: {
    value: string;
    isValid: boolean;
  };
  phoneNumber: {
    value: string;
    isValid: boolean;
  };
};

type Touched = {
  email: boolean;
  phoneNumber: boolean;
};

type Errors = {
  email: string | undefined;
  phoneNumber: string | undefined;
};

const ContactsSettings: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [yPosition, setYPosition] = useState<number>(0);
  const [statesModalVisible, setStatesModalVisible] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [inputs, setInputs] = useState<Inputs>({
    email: {
      value: '',
      isValid: true
    },
    phoneNumber: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    email: false,
    phoneNumber: false
  });

  const [errors, setErrors] = useState<Errors>({
    email: undefined,
    phoneNumber: undefined
  });

  return <></>;
};

export default ContactsSettings;
