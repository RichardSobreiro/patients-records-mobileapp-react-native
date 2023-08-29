import DatePickerV2 from '../../../../../components/ui/custom-form/DatePickerV2';
import StackSheetCustom from '../../../../../components/ui/custom-form/StackSheetCustom';
import { Colors } from '../../../../../constants/styles';
import { createAnamnesis } from '../../../../../http/AnamnesisApi';
import {
  CreateAnamnesisRequest,
  CreateAnamnesisTypeContentRequest
} from '../../../../../models/customers/anamnesis/CreateAnamneseRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import FileCustom from '../../../../../util/types/FileCustom';
import CustomerFiles from '../../CustomerFiles';
import { ErrorType, Inputs, Touched } from '../AnamnesisList';
import AnamnesisTypesStackScreen from '../anamnesis-types/AnamnesisTypesStackScreen';
import { GetAnamnesisTypeResponse } from '/models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  customerId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatedAnamnesisId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setShowCreatedAnamnesisSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateAnamnesis: React.FC<Props> = ({
  customerId,
  visible,
  setVisible,
  setCreatedAnamnesisId,
  setShowCreatedAnamnesisSnackbar
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

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

  const [isVisibleAnamnesisTypesModal, setIsVisibleAnamnesisTypesModal] = useState<boolean>(false);
  const [selectedAnamnesisTypes, setSelectedAnamnesisTypes] = useState<GetAnamnesisTypeResponse[]>(
    []
  );

  const [files, setFiles] = useState<FileCustom[] | undefined>(undefined);

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
              selected.template
            )
        ),
        isValid: true
      };
      return curInputs;
    });
  }, [selectedAnamnesisTypes]);

  const submitHandler = async () => {
    if (!authCtx.token?.access_token) return;

    setIsLoading(true);

    const dateObject = new Date(inputs.date.value);

    const request = new CreateAnamnesisRequest(
      customerId,
      new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate()),
      selectedAnamnesisTypes.map(
        (selected) =>
          new CreateAnamnesisTypeContentRequest(
            selected.anamnesisTypeId,
            selected.anamnesisTypeDescription,
            selected.isDefault,
            selected.template
          )
      )
    );

    console.log(`${JSON.stringify(request)}`);

    const response = await createAnamnesis(authCtx.token?.access_token, request, files);

    if (response.ok) {
      setShowCreatedAnamnesisSnackbar(() => {
        setCreatedAnamnesisId(response.body.anamneseId);
        return true;
      });
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
      setVisibleSnackbar(true);
      setTimeout(() => {
        setVisibleSnackbar(false);
      }, 5000);
    } else {
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setVisible(false);
    setIsLoading(false);
  };

  return (
    <>
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => {}}
        wrapperStyle={{ position: 'absolute', top: 0, zIndex: 2000 }}
        style={{
          backgroundColor: Colors.secondary500
        }}
      >
        Atendimento criado com sucesso!
      </Snackbar>
      <StackSheetCustom visible={visible} setVisible={setVisible} saveModalCallback={submitHandler}>
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
          extraScrollHeight={400}
          extraHeight={400}
        >
          <View
            style={{
              minHeight: 90,
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
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
          </View>
          <AnamnesisTypesStackScreen
            visible={isVisibleAnamnesisTypesModal}
            setVisible={setIsVisibleAnamnesisTypesModal}
            selectedAnamnesisTypes={selectedAnamnesisTypes}
            setSelectedAnamnesisTypes={setSelectedAnamnesisTypes}
            mode={'crud'}
          />
          {selectedAnamnesisTypes.findIndex((s) => s.anamnesisTypeDescription === 'Arquivo') >=
            0 && (
            <CustomerFiles
              files={files}
              setFiles={setFiles}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </KeyboardAwareScrollView>
      </StackSheetCustom>
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
