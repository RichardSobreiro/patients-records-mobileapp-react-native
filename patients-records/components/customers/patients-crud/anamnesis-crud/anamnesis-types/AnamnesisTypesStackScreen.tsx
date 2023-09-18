/* eslint-disable import/order */
import IconButton from '../../../../../components/ui/IconButton';
import Input from '../../../../../components/ui/custom-form/Input';
import RichTextAnamnesisInput from '../../../../../components/ui/custom-form/RichTextAnamnesisInput';
import RichTextInput from '../../../../../components/ui/custom-form/RichTextInput';
import StackSheetCustom from '../../../../../components/ui/custom-form/StackSheetCustom';
import { Colors } from '../../../../../constants/styles';
import {
  createAnamnesisType,
  getAnamnesisTypesList,
  updateAnamnesisType
} from '../../../../../http/AnamnesisTypesApi';
import { CreateAnamnesisTypeRequest } from '../../../../../models/customers/anamnesis-types/CreateAnamnesisTypeRequest';
import {
  GetAnamnesisTypeResponse,
  GetAnamnesisTypesResponse
} from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { UpdateAnamnesisTypeRequest } from '../../../../../models/customers/anamnesis-types/UpdateAnamnesisTypeRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { ErrorType } from '../AnamnesisList';
import { NotificationContext } from './../../../../../store/notification-context';
import AnamnesisGeneralForm from './AnamnesisGeneralForm';
import { RootStackAnamnesisCrudParamList } from '/App';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Switch, Chip, Searchbar, Button as ButtonPaper, Snackbar } from 'react-native-paper';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAnamnesisTypes: GetAnamnesisTypeResponse[];
  setSelectedAnamnesisTypes: React.Dispatch<React.SetStateAction<GetAnamnesisTypeResponse[]>>;
  mode: 'filter' | 'crud';
  errors?: ErrorType;
  onChangeHandler?: (field: string, value: GetAnamnesisTypeResponse[]) => void;
  onBlurHandler?: (field: string) => void;
};

const AnamnesisTypesStackScreen: React.FC<Props> = ({
  visible,
  setVisible,
  selectedAnamnesisTypes,
  setSelectedAnamnesisTypes,
  mode,
  errors,
  onChangeHandler,
  onBlurHandler
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackAnamnesisCrudParamList>>();

  const [isLoading, setIsLoading] = useState(false);
  const [anamnesisTypesList, setAnamnesisTypeList] = useState<GetAnamnesisTypeResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(undefined);

  const [newAnamnesisTypeModalVisible, setNewAnamnesisTypeModalVisible] = useState<boolean>(false);
  const [editingAnamnesisTypeId, setEditingAnamnesisTypeId] = useState<string | undefined>(
    undefined
  );
  const [inputsNew, setInputsNew] = useState({
    anamnesisTypeDescription: {
      value: '',
      isValid: true
    },
    anamnesisTypeTemplate: {
      value: '',
      isValid: true
    }
  });
  const [touchedNew, setTouchedNew] = useState({
    anamnesisTypeDescription: false,
    anamnesisTypeTemplate: false
  });
  const [errorsNewService, setErrorsNew] = useState<{
    anamnesisTypeDescription: null | string;
    anamnesisTypeTemplate: null | string;
  }>({
    anamnesisTypeDescription: null,
    anamnesisTypeTemplate: null
  });

  const handleChange = (field: string, enteredValue: any) => {
    setTouchedNew((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputsNew((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      setErrorsNew((curErrors) => {
        if (
          newInputs.anamnesisTypeDescription.value &&
          newInputs.anamnesisTypeDescription.value !== ''
        ) {
          newInputs.anamnesisTypeDescription.isValid = true;
          curErrors.anamnesisTypeDescription = null;
        } else {
          newInputs.anamnesisTypeDescription.isValid = false;
          curErrors.anamnesisTypeDescription = 'O nome do tipo de atendimento deve ser preenchido';
        }

        if (newInputs.anamnesisTypeTemplate.value && newInputs.anamnesisTypeTemplate.value !== '') {
          newInputs.anamnesisTypeTemplate.isValid = true;
          curErrors.anamnesisTypeTemplate = null;
        } else {
          newInputs.anamnesisTypeTemplate.isValid = false;
          curErrors.anamnesisTypeTemplate = 'O nome do tipo de atendimento deve ser preenchido';
        }
        return curErrors;
      });
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouchedNew((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const createNewAnamnesisTypes = async () => {
    setIsLoading(true);

    const response = await createAnamnesisType(
      authCtx.token?.access_token!,
      new CreateAnamnesisTypeRequest(
        inputsNew.anamnesisTypeDescription.value,
        inputsNew.anamnesisTypeTemplate.value
      )
    );
    if (response.ok) {
      selectedAnamnesisTypes.push(response.body as GetAnamnesisTypeResponse);
      getAnamnesisTypesAsync();
      setInputsNew({
        anamnesisTypeDescription: {
          value: '',
          isValid: true
        },
        anamnesisTypeTemplate: {
          value: '',
          isValid: true
        }
      });
      setTouchedNew({
        anamnesisTypeDescription: false,
        anamnesisTypeTemplate: false
      });
      setErrorsNew({
        anamnesisTypeDescription: null,
        anamnesisTypeTemplate: null
      });
      setSnackbarMessage('Tipo de Anamnese criado com sucesso!');
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
    setNewAnamnesisTypeModalVisible(false);
    setIsLoading(false);
  };

  const updateAnamnesisTypeAsync = async () => {
    setIsLoading(true);

    const response = await updateAnamnesisType(
      authCtx.token?.access_token!,
      new UpdateAnamnesisTypeRequest(
        editingAnamnesisTypeId!,
        inputsNew.anamnesisTypeDescription.value,
        inputsNew.anamnesisTypeTemplate.value
      )
    );
    if (response.ok) {
      getAnamnesisTypesAsync();
      setInputsNew({
        anamnesisTypeDescription: {
          value: '',
          isValid: true
        },
        anamnesisTypeTemplate: {
          value: '',
          isValid: true
        }
      });
      setTouchedNew({
        anamnesisTypeDescription: false,
        anamnesisTypeTemplate: false
      });
      setErrorsNew({
        anamnesisTypeDescription: null,
        anamnesisTypeTemplate: null
      });
      setSnackbarMessage('Tipo de Anamnese atualizado com sucesso!');
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
    setNewAnamnesisTypeModalVisible(false);
    setIsLoading(false);
  };

  const getAnamnesisTypesAsync = useCallback(async () => {
    if (authCtx.token?.access_token) {
      try {
        setIsLoading(true);
        const response = await getAnamnesisTypesList(authCtx.token?.access_token!);
        if (response.ok) {
          const apiResponseBody = response.body as GetAnamnesisTypesResponse;
          setAnamnesisTypeList(apiResponseBody.anamnesisTypes!);
        }
      } catch (error: any) {
        console.log(error);
        notificationCtx.showNotification({
          title: 'Ops...',
          message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [authCtx.token?.access_token, notificationCtx]);

  const removeItemFromSelected = (anamnesisTypeId: string) => {
    setSelectedAnamnesisTypes((prevState) => {
      const newSelectedAnamnesisTypes = prevState.filter(
        (s) => s.anamnesisTypeId !== anamnesisTypeId
      );
      onChangeHandler?.('selectedAnamnesisTypes', newSelectedAnamnesisTypes);
      return newSelectedAnamnesisTypes;
    });
  };

  useEffect(() => {
    if (visible) {
      getAnamnesisTypesAsync();
    }
  }, [getAnamnesisTypesAsync, visible]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const renderItem = ({ item }) => {
    const anamnesisType = item as GetAnamnesisTypeResponse;
    return (
      <View key={anamnesisType.anamnesisTypeId} style={styles.listItemContent}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Switch
            value={
              !!selectedAnamnesisTypes.find(
                (s) => s.anamnesisTypeId === anamnesisType.anamnesisTypeId
              )
            }
            onValueChange={() => {
              const existingItem = selectedAnamnesisTypes.filter(
                (s) => s.anamnesisTypeId === anamnesisType.anamnesisTypeId
              );
              if (existingItem && existingItem.length === 1) {
                const newSelectedAnamnesisTypes = selectedAnamnesisTypes.filter(
                  (s) => s.anamnesisTypeId !== anamnesisType.anamnesisTypeId
                );
                setSelectedAnamnesisTypes(newSelectedAnamnesisTypes);
                onChangeHandler?.('selectedAnamnesisTypes', newSelectedAnamnesisTypes);
              } else {
                if (selectedAnamnesisTypes && selectedAnamnesisTypes.length > 0) {
                  const newSelectedAnamnesisTypes = [...selectedAnamnesisTypes, anamnesisType];
                  setSelectedAnamnesisTypes(newSelectedAnamnesisTypes);
                  onChangeHandler?.('selectedAnamnesisTypes', newSelectedAnamnesisTypes);
                } else {
                  setSelectedAnamnesisTypes([anamnesisType]);
                  onChangeHandler?.('selectedAnamnesisTypes', [anamnesisType]);
                }
              }
            }}
          />
          <Text>{anamnesisType.anamnesisTypeDescription}</Text>
        </View>
        {!anamnesisType.isDefault && (
          <AntDesign
            onPress={() => {
              setVisible(false);
              navigation.push('EditAnamnesisType', {
                anamnesisTypeId: anamnesisType.anamnesisTypeId
              });
              // setEditingAnamnesisTypeId(anamnesisType.anamnesisTypeId);
              // setInputsNew({
              //   anamnesisTypeDescription: {
              //     value: anamnesisType.anamnesisTypeDescription,
              //     isValid: true
              //   },
              //   anamnesisTypeTemplate: {
              //     value: anamnesisType.template!,
              //     isValid: true
              //   }
              // });
              // setTouchedNew({
              //   anamnesisTypeDescription: false,
              //   anamnesisTypeTemplate: false
              // });
              // setErrorsNew({
              //   anamnesisTypeDescription: null,
              //   anamnesisTypeTemplate: null
              // });
              // setNewAnamnesisTypeModalVisible(true);
            }}
            name="edit"
            size={32}
            color={Colors.primary500}
          />
        )}
      </View>
    );
  };

  return (
    <>
      {/* Anamnesis Types List */}
      <StackSheetCustom
        visible={visible}
        setVisible={setVisible}
        saveModalCallback={() => setVisible(false)}
        positiveActionLabel={''}
      >
        <View style={styles.topBarActions}>
          <View style={styles.topBarSearch}>
            <Searchbar placeholder="Procurar" onChangeText={onChangeSearch} value={searchQuery} />
          </View>
          <View style={styles.topBarActionsAddTypeButton}>
            <IconButton
              icon={'add'}
              color={Colors.primary500}
              size={48}
              onPress={() => {
                setVisible(false);
                setNewAnamnesisTypeModalVisible(true);
              }}
              label="Incluir nova ficha"
            />
          </View>
        </View>
        <Snackbar
          visible={visibleSnackbar}
          onDismiss={() => {}}
          wrapperStyle={{ position: 'absolute', top: 30, zIndex: 2000 }}
          style={{
            backgroundColor: Colors.secondary500
          }}
        >
          {snackbarMessage}
        </Snackbar>
        <View style={styles.seletedChipsList}>
          {selectedAnamnesisTypes.map((selected) => {
            return (
              <Chip
                key={selected.anamnesisTypeId}
                icon="close"
                onPress={removeItemFromSelected.bind(null, selected.anamnesisTypeId)}
              >
                {selected.anamnesisTypeDescription}
              </Chip>
            );
          })}
        </View>
        {isLoading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={Colors.error500} size={40} />
          </View>
        ) : (
          <FlatList
            data={anamnesisTypesList}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                Nenhum tipo de ficha encontrado
              </Text>
            }
            contentContainerStyle={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}
            onEndReachedThreshold={0.2}
            keyExtractor={(item) => item.anamnesisTypeId}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StackSheetCustom>

      {/* Create/Edit Anamnesis Type */}
      <StackSheetCustom
        visible={newAnamnesisTypeModalVisible}
        setVisible={(value) => {
          setVisible(!value);
          setNewAnamnesisTypeModalVisible(value);
        }}
        positiveActionLabel="Salvar"
        saveModalCallback={() => {
          if (editingAnamnesisTypeId) {
            updateAnamnesisTypeAsync();
          } else {
            createNewAnamnesisTypes();
          }
        }}
        hideModalCallback={() => {
          setNewAnamnesisTypeModalVisible((cur) => {
            setVisible(true);
            return false;
          });
          setEditingAnamnesisTypeId(undefined);
          setInputsNew({
            anamnesisTypeDescription: {
              value: '',
              isValid: true
            },
            anamnesisTypeTemplate: {
              value: '',
              isValid: true
            }
          });
          setTouchedNew({
            anamnesisTypeDescription: false,
            anamnesisTypeTemplate: false
          });
          setErrorsNew({
            anamnesisTypeDescription: null,
            anamnesisTypeTemplate: null
          });
        }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          style={{ flex: 1, marginHorizontal: 20, marginVertical: 8 }}
          overScrollMode="never"
          extraScrollHeight={150}
          extraHeight={150}
        >
          {isLoading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color={Colors.error500} size={40} />
            </View>
          ) : (
            <>
              <Input
                field="anamnesisTypeDescription"
                label="Nome"
                values={inputsNew}
                touched={touchedNew}
                errors={errorsNewService}
                onChangeHandler={handleChange}
                onBlurHandler={handleBlur}
              />
              <AnamnesisGeneralForm anamnesisTypeId={editingAnamnesisTypeId!} />
              {/* <RichTextInput
                    field="anamnesisTypeTemplate"
                    label="Ficha da Anamnese"
                    values={inputsNew}
                    touched={touchedNew}
                    errors={errors}
                    onChangeHandler={handleChange}
                    onBlurHandler={handleBlur}
                  /> */}
            </>
          )}
        </KeyboardAwareScrollView>
      </StackSheetCustom>

      {mode === 'filter' && (
        <View style={styles.displayTextView}>
          <Text style={{ color: Colors.primary500 }}>Tipos de atendimento...</Text>
        </View>
      )}

      {mode === 'crud' && (
        <>
          <Text style={styles.label}>Tipos de anamnese:</Text>
          <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <ButtonPaper
              onPress={() => {
                setVisible(true);
                onBlurHandler?.('selectedAnamnesisTypes');
              }}
              uppercase={false}
              mode="outlined"
              style={{ width: '100%' }}
            >
              Selecione o(s) tipo(s) de anamnese
            </ButtonPaper>
            {selectedAnamnesisTypes && selectedAnamnesisTypes.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 5,
                  marginHorizontal: 20,
                  marginVertical: 10
                }}
              >
                {selectedAnamnesisTypes.map((selected) => {
                  return (
                    <Chip
                      key={selected.anamnesisTypeId}
                      icon="close"
                      onPress={removeItemFromSelected.bind(null, selected.anamnesisTypeId)}
                    >
                      {selected.anamnesisTypeDescription}
                    </Chip>
                  );
                })}
              </View>
            )}
            {errors?.['selectedAnamnesisTypes'] ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors['selectedAnamnesisTypes']}</Text>
              </View>
            ) : null}
          </View>
        </>
      )}

      {selectedAnamnesisTypes?.length > 0 &&
        selectedAnamnesisTypes.map((anamnesisType) => {
          if (anamnesisType.anamnesisTypeDescription === 'Bioestimulador de colágeno') {
            return (
              <AnamnesisGeneralForm
                anamnesisTypeId={anamnesisType.anamnesisTypeId}
                selectedAnamnesisTypes={selectedAnamnesisTypes}
                setSelectedAnamnesisTypes={setSelectedAnamnesisTypes}
              />
            );
          } else if (anamnesisType.anamnesisTypeDescription !== 'Arquivo') {
            return (
              <RichTextAnamnesisInput
                key={anamnesisType.anamnesisTypeId}
                label={anamnesisType.anamnesisTypeDescription}
                currentHTML={anamnesisType.template}
                anamnesisType={anamnesisType}
                setSelectedAnamnesisTypes={setSelectedAnamnesisTypes}
              />
            );
          }
        })}
    </>
  );
};

export default AnamnesisTypesStackScreen;

const styles = StyleSheet.create({
  displayTextView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  },
  topBarActions: {
    width: '100%',
    height: 140,
    paddingHorizontal: 20,
    marginBottom: 5,
    alignItems: 'center'
  },
  topBarSearch: {
    flex: 1,
    width: '100%'
  },
  topBarActionsAddTypeButton: {
    flex: 1,
    width: '100%'
  },
  seletedChipsList: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 5,
    minHeight: 35
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listContent: {
    width: '100%',
    flex: 1
  },
  createUpdateAnamnesisTypeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'stretch',
    gap: 15
  }
});
