import DatePickerV2 from '../../../../../components/ui/custom-form/DatePickerV2';
import StackSheetCustom from '../../../../../components/ui/custom-form/StackSheetCustom';
import { Colors } from '../../../../../constants/styles';
import { getAnamnesisById, updateAnamnesis } from '../../../../../http/AnamnesisApi';
import { GetAnamnesisTypeResponse } from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { CreateAnamnesisTypeContentRequest } from '../../../../../models/customers/anamnesis/CreateAnamneseRequest';
import { GetAnamnesisByIdResponse } from '../../../../../models/customers/anamnesis/GetAnamnesisByIdResponse';
import {
  UpdateAnamnesisRequest,
  UpdateAnamnesisTypeContentRequest
} from '../../../../../models/customers/anamnesis/UpdateAnamnesisRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import FileCustom from '../../../../../util/types/FileCustom';
import CustomerFiles from '../../CustomerFiles';
import { ErrorType, Inputs, Touched } from '../AnamnesisList';
import AnamnesisTypesStackScreen from '../anamnesis-types/AnamnesisTypesStackScreen';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator, Snackbar } from 'react-native-paper';

type Props = {
  customerId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  anamnesisId: string | undefined;
  setAnamnesisId: React.Dispatch<React.SetStateAction<string | undefined>>;
  showCreatedAnamnesisSnackbar: boolean;
};

const EditAnamnesis: React.FC<Props> = ({
  customerId,
  visible,
  setVisible,
  anamnesisId,
  setAnamnesisId,
  showCreatedAnamnesisSnackbar
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [visibleCreatedSnackbar, setVisibleCreatedSnackbar] = useState(false);

  const [isVisibleAnamnesisTypesModal, setIsVisibleAnamnesisTypesModal] = useState<boolean>(false);
  const [selectedAnamnesisTypes, setSelectedAnamnesisTypes] = useState<GetAnamnesisTypeResponse[]>(
    []
  );
  const [files, setFiles] = useState<FileCustom[] | undefined>(undefined);

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

  const resetInputs = () => {
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
    setTouched({
      date: false,
      anamnesisTypeContents: false
    });
    setErrors({
      date: null,
      anamnesisTypeContents: null
    });
    setFiles([]);
  };

  useEffect(() => {
    if (showCreatedAnamnesisSnackbar) {
      setVisibleCreatedSnackbar(true);
      setTimeout(() => {
        setVisibleCreatedSnackbar(false);
      }, 5000);
    }
  }, [showCreatedAnamnesisSnackbar]);

  useEffect(() => {
    if (anamnesisId && authCtx.token?.access_token) {
      const getAnamneseAsync = async () => {
        setIsLoading(true);

        const response = await getAnamnesisById(
          authCtx.token?.access_token!,
          customerId,
          anamnesisId
        );

        const getAnamnesisResponse = response.body as GetAnamnesisByIdResponse;

        const dateObject = new Date((getAnamnesisResponse.date as unknown as string).slice(0, -1));
        if (response.ok) {
          setInputs({
            date: {
              value: dateObject,
              isValid: true
            },
            anamnesisTypeContents: {
              value: getAnamnesisResponse.anamnesisTypesContent,
              isValid: true
            }
          });
          setSelectedAnamnesisTypes(
            getAnamnesisResponse.anamnesisTypesContent.map((selected) => {
              return new GetAnamnesisTypeResponse(
                selected.anamnesisTypeId,
                selected.anamnesisTypeDescription,
                selected.content,
                selected.isDefault,
                selected.questions
              );
            })
          );
          const filesApi = getAnamnesisResponse.anamnesisTypesContent.filter(
            (a) => a.anamnesisTypeDescription === 'Arquivo'
          );

          if (filesApi?.length > 0) {
            const newFilesState: FileCustom[] = [];
            for (const anamneseTypeFile of filesApi) {
              if (anamneseTypeFile.files && anamneseTypeFile.files.length > 0) {
                for (const fileApi of anamneseTypeFile.files) {
                  const response = await fetch(fileApi.baseUrl);
                  const data = await response.blob();
                  const metadata = {
                    type: fileApi.mimeType
                  };
                  const documentFile = new File(
                    [data],
                    fileApi.originalName ?? fileApi.filename,
                    metadata
                  );
                  const fileCustom = {
                    id: fileApi.fileId,
                    url: fileApi.baseUrl,
                    name: fileApi.originalName ?? fileApi.filename,
                    file: documentFile
                  };
                  newFilesState.push(fileCustom);
                }
              }
            }
            setFiles(newFilesState);
          }
        }
        setIsLoading(false);
      };

      getAnamneseAsync();
    }
  }, [authCtx.token?.access_token, customerId, anamnesisId]);

  const handleChange = (
    field: string,
    enteredValue: string | Date | GetAnamnesisTypeResponse[] | FileCustom[] | undefined
  ) => {
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
    if (!authCtx.token?.access_token || !anamnesisId) return;

    setIsLoading(true);

    const request = new UpdateAnamnesisRequest(
      anamnesisId,
      customerId,
      inputs.date.value,
      selectedAnamnesisTypes.map(
        (selected) =>
          new UpdateAnamnesisTypeContentRequest(
            selected.anamnesisTypeId,
            selected.anamnesisTypeDescription,
            selected.isDefault,
            selected.template,
            undefined,
            selected.questions
          )
      )
    );

    const response = await updateAnamnesis(authCtx.token?.access_token, request, files);

    if (response.ok) {
      setAnamnesisId(response.body.anamneseId);
      setVisibleSnackbar(true);
      setTimeout(() => {
        setVisibleSnackbar(false);
      }, 5000);
    } else {
      setVisible(false);
      setAnamnesisId(undefined);
      resetInputs();
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setIsLoading(false);
  };

  return (
    <StackSheetCustom
      visible={visible}
      setVisible={setVisible}
      positiveActionLabel="Salvar"
      hideModalCallback={() => {
        setVisible(false);
        setAnamnesisId(undefined);
        resetInputs();
      }}
      saveModalCallback={submitHandler}
    >
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
        extraScrollHeight={50}
        extraHeight={50}
      >
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => {}}
          wrapperStyle={{ zIndex: 7000, top: 0 }}
          style={{
            backgroundColor: Colors.secondary500
          }}
        >
          Alterações salvas com sucesso!
        </Snackbar>
        <Snackbar
          visible={showCreatedAnamnesisSnackbar}
          onDismiss={() => {}}
          wrapperStyle={{ zIndex: 7000, top: 0 }}
          style={{
            backgroundColor: Colors.secondary500
          }}
        >
          Anamnese criada com sucesso!
        </Snackbar>
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
        />
        {selectedAnamnesisTypes.findIndex((s) => s.anamnesisTypeDescription === 'Arquivo') >= 0 && (
          <CustomerFiles
            files={files}
            setFiles={setFiles}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </KeyboardAwareScrollView>
    </StackSheetCustom>
  );
};

export default EditAnamnesis;

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
