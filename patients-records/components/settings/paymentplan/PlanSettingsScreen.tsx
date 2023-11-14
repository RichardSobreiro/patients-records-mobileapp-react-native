import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import { AuthContext } from '../../../store/auth-context';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SegmentedButtons, Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

const PlanSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [yPosition, setYPosition] = useState<number>(0);
  const isFocused = useIsFocused();
  const [step, setStep] = useState<string>('1');

  return (
    <>
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary800}
          size={120}
          style={{
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.tertiary900Op12,
            zIndex: 2000
          }}
        />
      )}
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => {}}
        wrapperStyle={{
          zIndex: 7000,
          top: yPosition,
          alignContent: 'center',
          alignItems: 'center'
        }}
        style={{
          backgroundColor: Colors.secondary500,
          alignSelf: 'center'
        }}
      >
        Alterações salvas com sucesso!
      </Snackbar>
      <SegmentedButtons
        style={{ marginTop: 10, borderRadius: 0 }}
        theme={{ colors: { secondaryContainer: Colors.primary100 } }}
        value={step}
        onValueChange={setStep}
        buttons={[
          {
            value: '1',
            label: 'Plano',
            showSelectedCheck: true,
            style: { borderRadius: 0 }
          },
          {
            value: '2',
            label: 'Pagamento',
            showSelectedCheck: true
          },
          {
            value: '3',
            label: 'Resumo',
            showSelectedCheck: true,
            style: { borderRadius: 0 }
          }
        ]}
      />
    </>
  );
};

export default PlanSettingsScreen;
