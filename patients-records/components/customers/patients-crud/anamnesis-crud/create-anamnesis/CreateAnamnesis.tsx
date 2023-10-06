import DatePickerV2 from '../../../../../components/ui/custom-form/DatePickerV2';
import { Colors } from '../../../../../constants/styles';
import { createAnamnesis } from '../../../../../http/AnamnesisApi';
import {
  GetAnamnesisTypeResponse //GetAnamnesisTypesResponse
} from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import {
  CreateAnamnesisRequest,
  CreateAnamnesisTypeContentRequest
} from '../../../../../models/customers/anamnesis/CreateAnamneseRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import FileCustom from '../../../../../util/types/FileCustom';
import CustomerFiles from '../../CustomerFiles';
import AnamnesisTypesStackScreen from '../anamnesis-types/AnamnesisTypesStackScreen';
import RenderAnamnesisType from '../anamnesis-types/RenderAnamnesisType';
import { ErrorType, Inputs, Touched } from '../AnamnesisList';

import { useIsFocused } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  customerId: string;
  route: any;
  navigation: any;
};

const CreateAnamnesis: React.FC<Props> = ({ customerId, route, navigation }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isVisibleAnamnesisTypesModal, setIsVisibleAnamnesisTypesModal] = useState<boolean>(false);
  const [selectedAnamnesisTypes, setSelectedAnamnesisTypes] = useState<GetAnamnesisTypeResponse[]>(
    []
  );

  const [files, setFiles] = useState<FileCustom[] | undefined>(undefined);

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputs, setInputs] = useState<Inputs>({
    date: {
      value: new Date(),
      isValid: true
    },
    anamnesisTypeContents: {
      value: [],
      isValid: true
    }
  });
  const [touched, setTouched] = useState<Touched>({
    date: false,
    anamnesisTypeContents: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    date: null,
    anamnesisTypeContents: null
  });

  const handleChange = (field: string, enteredValue: string | Date | undefined) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const submitHandler = useCallback(async () => {
    if (!authCtx.token?.access_token) return;

    setIsLoading(true);

    const request = new CreateAnamnesisRequest(
      customerId,
      inputs.date.value,
      inputs.anamnesisTypeContents.value.map(
        (selected) =>
          new CreateAnamnesisTypeContentRequest(
            selected.anamnesisTypeId,
            selected.anamnesisTypeDescription,
            selected.isDefault,
            selected.content,
            null,
            selected.questions,
            selected.sections
          )
      )
    );
    const response = await createAnamnesis(authCtx.token?.access_token, request, files);

    if (response.ok) {
      setSelectedAnamnesisTypes([]);
      setInputs({
        date: {
          value: new Date(),
          isValid: true
        },
        anamnesisTypeContents: {
          value: [],
          isValid: true
        }
      });
      setErrors({
        date: null,
        anamnesisTypeContents: null
      });
      setTouched({
        date: false,
        anamnesisTypeContents: false
      });
      setFiles([]);

      navigation.replace('EditAnamnesis', {
        customerId,
        anamnesisId: response.body.anamneseId,
        showCreatedSnackbar: true
      });
    } else {
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setIsLoading(false);
  }, [
    authCtx.token?.access_token,
    customerId,
    files,
    inputs.anamnesisTypeContents.value,
    inputs.date.value,
    navigation,
    notificationCtx
  ]);

  useEffect(() => {
    setTouched((curTouched) => {
      curTouched.anamnesisTypeContents = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      curInputs.anamnesisTypeContents = {
        value: selectedAnamnesisTypes.map(
          (selected) =>
            new CreateAnamnesisTypeContentRequest(
              selected.anamnesisTypeId,
              selected.anamnesisTypeDescription,
              selected.isDefault,
              selected.template,
              null,
              selected.questions,
              selected.sections
            )
        ),
        isValid: true
      };
      return curInputs;
    });
  }, [selectedAnamnesisTypes]);

  useLayoutEffect(() => {
    if (!navigation || !route) return;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            submitHandler();
          }}
          style={{
            borderColor: Colors.secondary500,
            borderWidth: 1,
            borderRadius: 20,
            paddingVertical: 5,
            paddingHorizontal: 10
          }}
        >
          <Text style={{ color: Colors.secondary500 }}>Salvar</Text>
        </TouchableOpacity>
      )
    });

    const patientsBottomTabNavigator = navigation.getParent('PatientsBottomTab');
    if (patientsBottomTabNavigator) {
      if (route.name === 'CreateAnamnesis') {
        patientsBottomTabNavigator.setOptions({
          tabBarStyle: { display: 'none' }
        });
      }
    }

    const tabNavigator = navigation.getParent('PatientsHomeScreenStack');
    if (tabNavigator) {
      if (route.name === 'CreateAnamnesis') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      tabNavigator.setOptions({
        headerShown: true
      });
      patientsBottomTabNavigator.setOptions({
        tabBarStyle: { display: 'absolute' }
      });
    };
  }, [navigation, route, submitHandler]);

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
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={styles.container}
        overScrollMode="never"
        extraScrollHeight={20}
        extraHeight={20}
      >
        <DatePickerV2
          field="date"
          label="Data da Anamnese:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />

        <AnamnesisTypesStackScreen
          visible={isVisibleAnamnesisTypesModal}
          setVisible={setIsVisibleAnamnesisTypesModal}
          selectedAnamnesisTypes={selectedAnamnesisTypes}
          setSelectedAnamnesisTypes={setSelectedAnamnesisTypes}
          mode={'crud'}
          isFocused={isFocused}
        />

        {selectedAnamnesisTypes?.length > 0 &&
          selectedAnamnesisTypes.map((anamnesisType, index) => {
            return (
              <RenderAnamnesisType
                key={`${index}-${anamnesisType.anamnesisTypeId}`}
                selectedAnamnesis={anamnesisType}
                inputsSelectedAnamnesis={inputs}
                setInputsSelectedAnamnesis={setInputs}
              />
            );
          })}

        {selectedAnamnesisTypes.findIndex((s) => s.anamnesisTypeDescription === 'Arquivo') >= 0 && (
          <CustomerFiles
            files={files}
            setFiles={setFiles}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </KeyboardAwareScrollView>
    </>
  );
};

export default CreateAnamnesis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 20
  },
  containerButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 30,
    width: '100%'
  }
});
