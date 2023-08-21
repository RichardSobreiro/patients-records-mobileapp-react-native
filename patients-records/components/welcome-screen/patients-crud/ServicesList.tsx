/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { getServices } from '../../../http/ServicesApi';
import { GetServiceResponse } from '../../../models/customers/services/GetServicesResponse';
import { AuthContext } from '../../../store/auth-context';
import { NotificationContext } from '../../../store/notification-context';
import Header from '../Header';
import ServicesListItem from './ServicesListItem';
import ServicesListSearchBar from './ServicesListSearchBar';
import CreateService from './services-crud/create-services/CreateService';
import EditService from './services-crud/edit-services/EditService';
import { GetServiceTypeResponse } from 'models/customers/service-types/GetServiceTypesResponse';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import { FAB, Portal, Searchbar } from 'react-native-paper';
import FileCustom from 'util/types/FileCustom';

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

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  //console.log('CUSTOMERS LIST - Page = ', page);
  // const startDateObject = isDate(startDate)
  //   ? new Date(startDate)
  //   : undefined;
  // const endDateObject = isDate(endDate) ? new Date(endDate) : undefined;

  // const selectedTypesIds = (selectedTypes as Item[])
  //   ?.filter((type) => type.selected)
  //   ?.map((selectedType) => selectedType.id);
  const getServiceListAsync = useCallback(
    async (nextPage: number) => {
      if (authCtx.token?.access_token) {
        setIsLoading(true);

        const response = await getServices(
          authCtx.token.access_token,
          nextPage as unknown as string,
          PAGE_SIZE as unknown as string,
          customerId as string
        );

        if (response.ok) {
          console.log(
            `SERVICES LIST - PAGE: ${nextPage} - PAGE SIZE: ${response.body.servicesList?.length}`
          );
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
    [authCtx.token?.access_token, customerId, notificationCtx, servicesList.length]
  );

  useEffect(() => {
    getServiceListAsync(1);
  }, []);

  useEffect(() => {
    if (editServiceId && editServiceId !== '') {
      setVisibleEditService(true);
    }
  }, [editServiceId]);

  const fetchMoreData = () => {
    if (hasMoreData && !isLoading) {
      setPage((prevState) => {
        const nextPage = prevState + 1;
        getServiceListAsync(nextPage);
        return nextPage;
      });
    }
  };

  const onSubmitFilter = async () => {
    // if (!startDateIsValid || !endDateIsValid) {
    //   return;
    // }
    await getServiceListAsync(page);
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
          visible
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
      {/* <View style={styles.header}>
        <Header isAddingCustomerScreen={true} title="Atendimentos" />
      </View> */}
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10 }}>
              <Searchbar
                placeholder="Procurar"
                onChangeText={setSearchPhrase}
                value={searchPhrase}
                iconColor="#120461"
                clearButtonMode="while-editing"
                inputStyle={{ color: Colors.primary500 }}
              />
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
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  }
});
