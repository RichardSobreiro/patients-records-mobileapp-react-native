/* eslint-disable import/order */
import { Colors } from '../../../../../constants/styles';
import { getServiceTypesList } from '../../../../../http/ServiceTypesApi';
import {
  GetServiceTypeResponse,
  GetServiceTypesResponse
} from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import { AuthContext } from '../../../../../store/auth-context';
import IconButton from '../../../../ui/IconButton';
import StackSheetCustom from '../../../../ui/custom-form/StackSheetCustom';
import { ErrorType } from '../ServicesList';
import { RootStackServicesCrudParamList } from '/App';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Platform } from 'react-native';
import { Switch, Chip, Searchbar, Button as ButtonPaper } from 'react-native-paper';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedServiceTypes: GetServiceTypeResponse[];
  setSelectedServiceTypes: React.Dispatch<React.SetStateAction<GetServiceTypeResponse[]>>;
  mode: 'filter' | 'crud';
  errors?: ErrorType;
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackServicesCrudParamList>>();

  const onChangeSearch = (query) => setSearchQuery(query);

  useEffect(() => {
    const getServiceTypesAsync = async () => {
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
    };

    if (authCtx.token?.access_token) {
      getServiceTypesAsync();
    }
  }, [authCtx.token?.access_token, visible]);

  const renderItem = ({ item }) => {
    const serviceType = item as GetServiceTypeResponse;
    return (
      <View key={serviceType.serviceTypeId} style={styles.listItemContent}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Switch
            value={
              !!selectedServiceTypes.find((s) => s.serviceTypeId === serviceType.serviceTypeId)
            }
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
        {!serviceType.isDefault && (
          <AntDesign
            onPress={() => {
              setVisible(false);
              navigation.push('EditServiceType', {
                serviceTypeId: serviceType.serviceTypeId
              });
            }}
            name="edit"
            size={32}
            color={Colors.primary500}
          />
        )}
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

  return (
    <>
      <StackSheetCustom
        visible={visible}
        setVisible={setVisible}
        positiveActionLabel={''}
        saveModalCallback={() => setVisible(false)}
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
                setVisible((cur) => {
                  setVisible(false);
                  navigation.push('CreateServiceType');
                  return false;
                });
              }}
              label="Incluir novo tipo"
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
        <FlatList
          data={serviceTypesList}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ fontSize: 18, textAlign: 'center' }}>
              Nenhum tipo de serviço encontrado
            </Text>
          }
          contentContainerStyle={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}
          onEndReachedThreshold={0.2}
          keyExtractor={(item) => item.serviceTypeId}
          showsVerticalScrollIndicator={true}
        />
      </StackSheetCustom>

      {mode === 'filter' && (
        <View style={styles.displayTextView}>
          <Text style={{ color: Colors.primary500 }}>Tipos de atendimento...</Text>
        </View>
      )}

      {mode === 'crud' && (
        <>
          <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-start' }}>
            <Text style={styles.label}>Tipo de atendimento:</Text>
            <ButtonPaper
              onPress={() => {
                setVisible(true);
                onBlurHandler?.('selectedServiceTypes');
              }}
              uppercase={false}
              mode="outlined"
              style={{ width: '100%' }}
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
            {errors?.['selectedServiceTypes'] ? (
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
    width: '100%'
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
