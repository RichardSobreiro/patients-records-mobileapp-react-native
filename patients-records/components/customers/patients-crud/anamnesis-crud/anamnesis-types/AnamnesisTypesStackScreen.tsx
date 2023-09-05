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
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false);
  const [anamnesisTypesList, setAnamnesisTypeList] = useState<GetAnamnesisTypeResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(undefined);

  const [newAnamnesisTypeModalVisible, setNewAnamnesisTypeModalVisible] = useState<boolean>(false);
  const [editingAnamnesisTypeId, setEditingAnamnesisTypeId] = useState<string | undefined>(
    undefined
  );
  const [inputs, setInputs] = useState({
    anamnesisTypeDescription: {
      value: '',
      isValid: true
    },
    anamnesisTypeTemplate: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState({
    anamnesisTypeDescription: false,
    anamnesisTypeTemplate: false
  });

  const [errorsNewService, setErrors] = useState<{
    anamnesisTypeDescription: null | string;
    anamnesisTypeTemplate: null | string;
  }>({
    anamnesisTypeDescription: null,
    anamnesisTypeTemplate: null
  });

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      setErrors((curErrors) => {
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
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const createNewAnamnesisTypes = async () => {
    setIsLoading(true);

    const response = await createAnamnesisType(
      authCtx.token?.access_token!,
      new CreateAnamnesisTypeRequest(
        inputs.anamnesisTypeDescription.value,
        inputs.anamnesisTypeTemplate.value
      )
    );
    if (response.ok) {
      selectedAnamnesisTypes.push(response.body as GetAnamnesisTypeResponse);
      getAnamnesisTypesAsync();
      setInputs({
        anamnesisTypeDescription: {
          value: '',
          isValid: true
        },
        anamnesisTypeTemplate: {
          value: '',
          isValid: true
        }
      });
      setTouched({
        anamnesisTypeDescription: false,
        anamnesisTypeTemplate: false
      });
      setErrors({
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
        inputs.anamnesisTypeDescription.value,
        inputs.anamnesisTypeTemplate.value
      )
    );
    if (response.ok) {
      getAnamnesisTypesAsync();
      setInputs({
        anamnesisTypeDescription: {
          value: '',
          isValid: true
        },
        anamnesisTypeTemplate: {
          value: '',
          isValid: true
        }
      });
      setTouched({
        anamnesisTypeDescription: false,
        anamnesisTypeTemplate: false
      });
      setErrors({
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
              setEditingAnamnesisTypeId(anamnesisType.anamnesisTypeId);
              setInputs({
                anamnesisTypeDescription: {
                  value: anamnesisType.anamnesisTypeDescription,
                  isValid: true
                },
                anamnesisTypeTemplate: {
                  value: anamnesisType.template!,
                  isValid: true
                }
              });
              setTouched({
                anamnesisTypeDescription: false,
                anamnesisTypeTemplate: false
              });
              setErrors({
                anamnesisTypeDescription: null,
                anamnesisTypeTemplate: null
              });
              setNewAnamnesisTypeModalVisible(true);
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

      <StackSheetCustom
        visible={newAnamnesisTypeModalVisible}
        setVisible={setNewAnamnesisTypeModalVisible}
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
          setInputs({
            anamnesisTypeDescription: {
              value: '',
              isValid: true
            },
            anamnesisTypeTemplate: {
              value: '',
              isValid: true
            }
          });
          setTouched({
            anamnesisTypeDescription: false,
            anamnesisTypeTemplate: false
          });
          setErrors({
            anamnesisTypeDescription: null,
            anamnesisTypeTemplate: null
          });
        }}
      >
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1, marginHorizontal: 20, marginVertical: 8 }}
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
                    values={inputs}
                    touched={touched}
                    errors={errorsNewService}
                    onChangeHandler={handleChange}
                    onBlurHandler={handleBlur}
                  />
                  <RichTextInput
                    field="anamnesisTypeTemplate"
                    label="Ficha da Anamnese"
                    values={inputs}
                    touched={touched}
                    errors={errors}
                    onChangeHandler={handleChange}
                    onBlurHandler={handleBlur}
                  />
                </>
              )}
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>
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
                //setNewAnamnesisTypeModalVisible(true);
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
          if (anamnesisType.anamnesisTypeDescription !== 'Arquivo') {
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
