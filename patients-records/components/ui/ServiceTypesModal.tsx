/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { createServiceType, getServiceTypesList } from '../../http/ServiceTypesApi';
import { CreateServiceTypeRequest } from '../../models/customers/service-types/CreateServiceTypeRequest';
import { CreateServiceTypeResponse } from '../../models/customers/service-types/CreateServiceTypeResponse';
import {
  GetServiceTypeResponse,
  GetServiceTypesResponse
} from '../../models/customers/service-types/GetServiceTypesResponse';
import { AuthContext } from '../../store/auth-context';
import { ErrorType } from '../welcome-screen/patients-crud/ServicesList';
import Button, { ButtonTypes } from './Button';
import IconButton from './IconButton';
import Input from './custom-form/Input';
import StackSheetCustom from './custom-form/StackSheetCustom';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Switch, Chip, Searchbar, Button as ButtonPaper } from 'react-native-paper';

type ErrorTypeNewService = {
  serviceTypeDescription: null | string;
  serviceTypeTemplate: null | string;
};

type Props = {
  errors: ErrorType;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedServiceTypes: GetServiceTypeResponse[];
  setSelectedServiceTypes: React.Dispatch<React.SetStateAction<GetServiceTypeResponse[]>>;
  mode: 'filter' | 'crud';
  onChangeHandler?: (field: string, value: GetServiceTypeResponse[]) => void;
  onBlurHandler?: (field: string) => void;
};

const ServiceTypesModal: React.FC<Props> = ({
  errors,
  visible,
  setVisible,
  selectedServiceTypes,
  setSelectedServiceTypes,
  mode,
  onChangeHandler,
  onBlurHandler
}: Props) => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTypesList, setServicesTypeList] = useState<GetServiceTypeResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  const [newServiceTypeModalVisible, setNewServiceTypeModalVisible] = useState<boolean>(false);
  const [inputs, setInputs] = useState({
    serviceTypeDescription: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState({
    serviceTypeDescription: false,
    serviceTypeTemplate: false
  });

  const [errorsNewService, setErrors] = useState<ErrorTypeNewService>({
    serviceTypeDescription: null,
    serviceTypeTemplate: null
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
          newInputs.serviceTypeDescription.value &&
          newInputs.serviceTypeDescription.value !== ''
        ) {
          newInputs.serviceTypeDescription.isValid = true;
          curErrors.serviceTypeDescription = null;
        } else {
          newInputs.serviceTypeDescription.isValid = false;
          curErrors.serviceTypeDescription = 'O nome do tipo de atendimento deve ser preenchido';
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

  const getServiceTypesAsync = useCallback(async () => {
    if (authCtx.token?.access_token) {
      try {
        setIsLoading(true);
        const response = await getServiceTypesList(authCtx.token?.access_token!);
        if (response.ok) {
          const apiResponseBody = response.body as GetServiceTypesResponse;
          setServicesTypeList(apiResponseBody.serviceTypes!);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [authCtx.token?.access_token]);

  useEffect(() => {
    if (authCtx.token?.access_token) {
      getServiceTypesAsync();
    }
  }, [authCtx.token?.access_token, getServiceTypesAsync, visible]);

  const renderItem = ({ item }) => {
    const serviceType = item as GetServiceTypeResponse;
    return (
      <View key={serviceType.serviceTypeId} style={styles.listItemContent}>
        <Switch
          value={!!selectedServiceTypes.find((s) => s.serviceTypeId === serviceType.serviceTypeId)}
          onValueChange={() => {
            const existingItem = selectedServiceTypes.filter(
              (s) => s.serviceTypeId === serviceType.serviceTypeId
            );
            if (existingItem && existingItem.length === 1) {
              const newSelectedServiceTypes = selectedServiceTypes.filter(
                (s) => s.serviceTypeId !== serviceType.serviceTypeId
              );
              setSelectedServiceTypes(newSelectedServiceTypes);
              onChangeHandler?.('selectedServiceTypes', newSelectedServiceTypes);
            } else {
              if (selectedServiceTypes && selectedServiceTypes.length > 0) {
                const newSelectedServiceTypes = [...selectedServiceTypes, serviceType];
                setSelectedServiceTypes(newSelectedServiceTypes);
                onChangeHandler?.('selectedServiceTypes', newSelectedServiceTypes);
              } else {
                setSelectedServiceTypes([serviceType]);
                onChangeHandler?.('selectedServiceTypes', [serviceType]);
              }
            }
          }}
        />
        <Text>{serviceType.serviceTypeDescription}</Text>
      </View>
    );
  };

  const removeItemFromSelected = (serviceTypeId: string) => {
    setSelectedServiceTypes((prevState) => {
      const newSelectedServiceTypes = prevState.filter((s) => s.serviceTypeId !== serviceTypeId);
      onChangeHandler?.('selectedServiceTypes', newSelectedServiceTypes);
      return newSelectedServiceTypes;
    });
  };

  const sortItemsList = (list: GetServiceTypeResponse[]): GetServiceTypeResponse[] => {
    const newList = [...list];
    newList.sort((a, b) => {
      if (a.isDefault && !b.isDefault) {
        return 1;
      } else if (!a.isDefault && b.isDefault) {
        return -1;
      }
      return a.serviceTypeDescription.localeCompare(b.serviceTypeDescription);
    });
    return newList;
  };

  const createNewServiceType = async () => {
    if (!inputs.serviceTypeDescription.isValid) {
      return;
    }

    setIsLoading(true);

    const createServiceTypeRequest = new CreateServiceTypeRequest(
      inputs.serviceTypeDescription.value!
    );

    const apiResponse = await createServiceType(
      authCtx.token?.access_token!,
      createServiceTypeRequest
    );

    if (apiResponse.ok) {
      const createServiceTypeResponse = apiResponse.body as CreateServiceTypeResponse;
      const newItemList = [...serviceTypesList!];
      const createdServiceType = {
        serviceTypeId: createServiceTypeResponse.serviceTypeId,
        serviceTypeDescription: createServiceTypeResponse.serviceTypeDescription,
        notes: '',
        isDefault: false
      };
      newItemList.push(createdServiceType);

      setServicesTypeList(sortItemsList(newItemList));
      setSelectedServiceTypes((curSelected) => {
        if (curSelected && curSelected.length > 0) {
          const newSelectedServiceTypes = [...curSelected, createdServiceType];
          onChangeHandler?.('selectedServiceTypes', newSelectedServiceTypes);
          return newSelectedServiceTypes;
        } else {
          onChangeHandler?.('selectedServiceTypes', [createdServiceType]);
          return [createdServiceType];
        }
      });
      setNewServiceTypeModalVisible(false);
      setInputs({
        serviceTypeDescription: {
          value: '',
          isValid: true
        }
      });
    } else {
      console.log(apiResponse.error);
    }

    setIsLoading(false);
  };

  return (
    <>
      <StackSheetCustom visible={visible} setVisible={setVisible}>
        <View style={styles.topBarActions}>
          <View style={styles.topBarActionsLeftContent}>
            <Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          </View>
          <View style={styles.topBarActionsRightContent}>
            <IconButton
              icon={'add'}
              color={Colors.primary500}
              size={48}
              onPress={() => setNewServiceTypeModalVisible(true)}
            />
          </View>
        </View>
        <View style={styles.seletedChipsList}>
          {selectedServiceTypes.map((selected) => {
            return (
              <Chip
                key={selected.serviceTypeId}
                icon="close"
                onPress={removeItemFromSelected.bind(null, selected.serviceTypeId)}
              >
                {selected.serviceTypeDescription}
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
            data={serviceTypesList}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                Nenhum tipo de serviço encontrado
              </Text>
            }
            contentContainerStyle={styles.listContent}
            onEndReachedThreshold={0.2}
            keyExtractor={(item) => item.serviceTypeId}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StackSheetCustom>

      <StackSheetCustom
        visible={newServiceTypeModalVisible}
        setVisible={setNewServiceTypeModalVisible}
      >
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1, marginHorizontal: 8, marginVertical: 8 }}
            >
              <Input
                field="serviceTypeDescription"
                label="Nome"
                values={inputs}
                touched={touched}
                errors={errorsNewService}
                onChangeHandler={handleChange}
                onBlurHandler={handleBlur}
              />
              <View style={styles.createUpdateServiceTypeActions}>
                <Button
                  onPress={() => setNewServiceTypeModalVisible(false)}
                  type={ButtonTypes.Cancel}
                >
                  Cancelar
                </Button>
                <Button onPress={createNewServiceType} type={ButtonTypes.Primary}>
                  Salvar
                </Button>
              </View>
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
          <Text style={styles.label}>Tipo de atendimento</Text>
          <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <ButtonPaper
              onPress={() => {
                setVisible(true);
                onBlurHandler?.('selectedServiceTypes');
              }}
              uppercase={false}
              mode="outlined"
            >
              Selecione o(s) tipo(s) de atendimento
            </ButtonPaper>
            {selectedServiceTypes && selectedServiceTypes.length > 0 && (
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
                {selectedServiceTypes.map((selected) => {
                  return (
                    <Chip
                      key={selected.serviceTypeId}
                      icon="close"
                      onPress={removeItemFromSelected.bind(null, selected.serviceTypeId)}
                    >
                      {selected.serviceTypeDescription}
                    </Chip>
                  );
                })}
              </View>
            )}
            {errors['selectedServiceTypes'] ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors['selectedServiceTypes']}</Text>
              </View>
            ) : null}
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  topBarActions: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topBarActionsLeftContent: {
    flex: 5
  },
  topBarActionsRightContent: {
    flex: 1
  },
  displayTextView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    width: '100%',
    flex: 1
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  newServiceTypeContainer: {},
  createUpdateServiceTypeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'stretch',
    gap: 15
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
  }
});

export default ServiceTypesModal;
