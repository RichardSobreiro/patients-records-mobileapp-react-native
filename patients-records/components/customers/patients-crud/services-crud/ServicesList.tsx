/* eslint-disable import/order */
import { Colors } from '../../../../constants/styles';
import { getServices } from '../../../../http/ServicesApi';
import { GetServiceTypeResponse } from '../../../../models/customers/service-types/GetServiceTypesResponse';
import { GetServiceResponse } from '../../../../models/customers/services/GetServicesResponse';
import { AuthContext } from '../../../../store/auth-context';
import { NotificationContext } from '../../../../store/notification-context';
import { DateParser } from '../../../../util/dateParser';
import FileCustom from '../../../../util/types/FileCustom';
import DateRangePicker from '../../../ui/custom-form/DateRangePicker';
import ServicesListItem from './ServicesListItem';
import CreateService from './create-services/CreateService';
import EditService from './edit-services/EditService';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { FAB, Portal, Searchbar } from 'react-native-paper';

export type ErrorType = {
  date: null | string;
  time: null | string;
  selectedServiceTypes: null | string;
  beforeComments: null | string;
  beforePhotos: null | string;
  afterComments: null | string;
  afterPhotos: null | string;
};

export type Inputs = {
  date: {
    value: Date;
    isValid: boolean;
  };
  hour: {
    value: number;
    isValid: boolean;
  };
  minutes: {
    value: number;
    isValid: boolean;
  };
  selectedServiceTypes: {
    value: GetServiceTypeResponse[];
    isValid: boolean;
  };
  beforeComments: {
    value: string | undefined;
    isValid: boolean;
  };
  beforePhotos: {
    value: FileCustom[] | undefined;
    isValid: boolean;
  };
  afterComments: {
    value: string | undefined;
    isValid: boolean;
  };
  afterPhotos: {
    value: FileCustom[] | undefined;
    isValid: boolean;
  };
};

export type Touched = {
  date: boolean;
  time: boolean;
  selectedServiceTypes: boolean;
  beforeComments: boolean;
  beforePhotos: boolean;
  afterComments: boolean;
  afterPhotos: boolean;
};

const PAGE_SIZE = 10;

type Props = {
  customerId: string;
};

const ServicesList: React.FC<Props> = ({ customerId }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState(false);

  const [servicesList, setServicesList] = useState<GetServiceResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenFabGroup, setIsOpenFabGroup] = useState(false);

  const [isVisibleCreateService, setVisibleCreateService] = useState<boolean>(false);
  const [isVisibleEditService, setVisibleEditService] = useState<boolean>(false);
  const [editServiceId, setEditServiceId] = useState<string | undefined>(undefined);
  const [showCreatedServiceSnackbar, setShowCreatedServiceSnackbar] = useState<boolean>(false);

  const [searchServiceTypeDescription, setSearchServiceTypeDescription] = useState<string>('');
  const [searchStartDate, setSearchStartDate] = useState<Date | undefined>(undefined);
  const [searchEndDate, setSearchEndDate] = useState<Date | undefined>(undefined);
  const [openDateRangeModal, setOpenDateRangeModal] = useState<boolean>(false);

  const isFocused = useIsFocused();

  const getServiceListAsync = useCallback(
    async (nextPage: number) => {
      if (authCtx.token?.access_token) {
        setIsLoading(true);

        const response = await getServices(
          authCtx.token.access_token,
          nextPage as unknown as string,
          PAGE_SIZE as unknown as string,
          customerId as string,
          searchServiceTypeDescription,
          searchStartDate,
          searchEndDate
        );

        if (response.ok) {
          if (servicesList.length > 0 && nextPage > 1) {
            setServicesList((prevValue) => [...prevValue, ...response.body.servicesList]);
          } else {
            setServicesList([...response.body.servicesList]);
          }
        } else {
          console.log(`SERVICES LIST - ERROR - PAGE: ${nextPage}`);
          const notification = {
            status: 'error',
            title: 'Opsss...',
            message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
          };
          notificationCtx.showNotification(notification);
        }

        if (response.body.next) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }

        setIsLoading(false);
      }
    },
    [
      authCtx.token?.access_token,
      customerId,
      notificationCtx,
      searchEndDate,
      searchServiceTypeDescription,
      searchStartDate,
      servicesList.length
    ]
  );

  useEffect(() => {
    if (isFocused) {
      console.log(`SERVICES LIST - USE FOCUS EFFECT - isFocused: ${isFocused}`);
      getServiceListAsync(1);
    }
  }, [getServiceListAsync, isFocused]);

  useEffect(() => {
    if (editServiceId && editServiceId !== '') {
      setVisibleEditService(true);
      getServiceListAsync(1);
    }
  }, [editServiceId]);

  useEffect(() => {
    const refreshData = () => {
      setPage((prevState) => {
        const nextPage = 1;
        getServiceListAsync(nextPage);
        return nextPage;
      });
    };
    const unsubscribe = refreshData;
    const timer = setTimeout(() => {
      refreshData();
    }, 600);
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [searchServiceTypeDescription, searchStartDate, searchEndDate]);

  const fetchMoreData = () => {
    if (hasMoreData && !isLoading) {
      setPage((prevState) => {
        const nextPage = prevState + 1;
        getServiceListAsync(nextPage);
        return nextPage;
      });
    }
  };

  const renderArticle = ({ item }) => {
    return (
      <ServicesListItem
        key={item.serviceId}
        service={item}
        navigateToUpdateProceeding={() => {
          setVisibleEditService((curState) => {
            setEditServiceId(item.serviceId);
            return true;
          });
        }}
      />
    );
  };

  const renderDivider = () => <View style={styles.articleSeparator}></View>;

  const renderFooter = () => {
    return (
      <>
        <View style={styles.center}>
          {hasMoreData && isLoading && <ActivityIndicator color={Colors.error500} size={40} />}
        </View>
      </>
    );
  };

  const keyExtractor = (item: GetServiceResponse) => item.serviceId;

  return (
    <>
      <CreateService
        customerId={customerId}
        visible={isVisibleCreateService}
        setVisible={setVisibleCreateService}
        setNewServiceId={setEditServiceId}
        setShowCreatedServiceSnackbar={setShowCreatedServiceSnackbar}
      />
      <EditService
        customerId={customerId}
        visible={isVisibleEditService}
        setVisible={setVisibleEditService}
        serviceId={editServiceId}
        setServiceId={setEditServiceId}
        showCreatedServiceSnackbar={showCreatedServiceSnackbar}
      />
      <Portal>
        <FAB.Group
          open={isOpenFabGroup}
          visible={isFocused}
          icon={isOpenFabGroup ? 'minus' : 'plus'}
          actions={[
            { icon: 'plus', onPress: () => console.log('Pressed add') },
            {
              icon: 'calendar-today',
              label: 'Atendimentos Agendados',
              onPress: () => console.log('Pressed calendar'),
              labelTextColor: 'white'
            },
            {
              icon: 'email',
              label: 'Enviar uma Mensagem',
              onPress: () => console.log('Pressed send message'),
              labelTextColor: 'white'
            },
            {
              icon: 'plus',
              label: 'Novo Atendimento',
              onPress: () => setVisibleCreateService(true),
              labelTextColor: 'white'
            }
          ]}
          onStateChange={({ open }) => setIsOpenFabGroup(open)}
          onPress={() => {
            if (isOpenFabGroup) {
              // do something if the speed dial is open
            }
          }}
          backdropColor={'rgba(25, 25, 25, 0.8)'}
          rippleColor={Colors.primary100}
          style={[
            styles.fabGroupStyle
            // {
            //   opacity: isOpenFabGroup ? 0.2 : 1,
            //   backgroundColor: isOpenFabGroup ? Colors.primary800 : 'transparent'
            // }
          ]}
          fabStyle={styles.fabStyle}
          color={Colors.primary100}
        />
      </Portal>
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                marginVertical: 10,
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <Searchbar
                placeholder="Procurar"
                onChangeText={setSearchServiceTypeDescription}
                value={searchServiceTypeDescription}
                iconColor="#120461"
                clearButtonMode="while-editing"
                inputStyle={{ color: Colors.primary500 }}
              />
              <Pressable
                onPress={() => setOpenDateRangeModal(true)}
                style={{
                  height: 25,
                  width: 200,
                  borderWidth: 1,
                  borderRadius: 15,
                  padding: 2,
                  marginTop: 5,
                  borderColor: Colors.primary500
                }}
              >
                <DateRangePicker
                  text={
                    searchStartDate && searchEndDate
                      ? `${DateParser(searchStartDate)} até ${DateParser(searchEndDate)}`
                      : 'Datas de atendimento...'
                  }
                  open={openDateRangeModal}
                  setOpen={setOpenDateRangeModal}
                  startDate={searchStartDate}
                  setStartDate={setSearchStartDate}
                  endDate={searchEndDate}
                  setEndDate={setSearchEndDate}
                />
              </Pressable>
            </View>
          </View>
          {servicesList?.length === 0 && !hasMoreData ? (
            <Text
              style={{ fontSize: 18, textAlign: 'center', marginTop: 40, color: Colors.primary500 }}
            >
              Nenhum atendimento encontrado!
            </Text>
          ) : (
            <FlatList
              data={servicesList}
              renderItem={renderArticle}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={() => {
                return (
                  <Text style={{ fontSize: 18, textAlign: 'center' }}>
                    {isLoading ? '' : 'Nenhum procedimento encontrado!'}
                  </Text>
                );
              }}
              style={{ paddingHorizontal: 25 }}
              onEndReachedThreshold={0.1}
              keyExtractor={keyExtractor}
              onEndReached={fetchMoreData}
              showsVerticalScrollIndicator={true}
              ItemSeparatorComponent={renderDivider}
              ListHeaderComponent={
                <>
                  <Text style={styles.listHeaderText}>Data e Hora</Text>
                  <Text style={styles.listHeaderText}>Tipo(s)</Text>
                </>
              }
              ListHeaderComponentStyle={styles.listHeaderStyle}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default ServicesList;

const styles = StyleSheet.create({
  fabGroupStyle: {
    bottom: 45,
    right: 0
  },
  fabStyle: {
    backgroundColor: Colors.primary800,
    color: Colors.primary100
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    verticalAlign: 'middle'
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 15
  },
  headlines: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 50,
    color: Colors.primary800
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  articleSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ed7669'
  },
  listHeaderStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ed7669',
    paddingBottom: 10
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary500,
    flex: 1
  },
  extraFiltersButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    padding: 2,
    marginTop: 5,
    borderColor: Colors.primary500
  }
});
