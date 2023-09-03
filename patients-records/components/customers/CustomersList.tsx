/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { GetCustomers } from '../../http/CustomersApi';
import { GetCustomer } from '../../models/GetCustomersResponse';
import { GetServiceTypeResponse } from '../../models/customers/service-types/GetServiceTypesResponse';
import { AuthContext } from '../../store/auth-context';
import { DateParser } from '../../util/dateParser';
import ServiceTypesModal from '../ui/ServiceTypesModal';
import DateRangePicker from '../ui/custom-form/DateRangePicker';
import CustomerListItem from './CustomerListItem';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  ScrollView
} from 'react-native';
import { FAB, Portal, Searchbar } from 'react-native-paper';

const PAGE_SIZE = 10;

type Props = {
  navigation: any;
};

const CustomersList: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [searchStartDate, setSearchStartDate] = useState<Date | undefined>(undefined);
  const [searchEndDate, setSearchEndDate] = useState<Date | undefined>(undefined);
  const [serviceTypeIds, setServiceTypeIds] = useState<string[] | undefined>(undefined);
  const [openServiceTypesModal, setOpenServiceTypesModal] = useState<boolean>(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<GetServiceTypeResponse[]>([]);
  const [openDateRangeModal, setOpenDateRangeModal] = useState<boolean>(false);

  const [customers, setCustomers] = useState<GetCustomer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenFabGroup, setIsOpenFabGroup] = useState(false);
  const [isVisibleFabGroup, setIsVisibleFabGroup] = useState(true);

  useEffect(() => {
    setServiceTypeIds(selectedServiceTypes.map((s) => s.serviceTypeId));
  }, [selectedServiceTypes]);

  useEffect(() => {
    navigation?.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  const requestApi = useCallback(
    async (nextPage: number) => {
      setIsLoading(true);

      const response = await GetCustomers(
        authCtx.token?.access_token!,
        nextPage,
        PAGE_SIZE,
        searchPhrase,
        searchStartDate,
        searchEndDate,
        serviceTypeIds
      );

      if (response) {
        if (customers?.length > 0 && nextPage > 1) {
          setCustomers((prevCustomers) => [...prevCustomers, ...response.customers!]);
        } else {
          setCustomers([...response.customers!]);
        }
      } else {
        console.log(`CUSTOMERS LIST - ERROR - PAGE: ${nextPage}`);
      }

      if (response?.next) {
        setHasMoreData(true);
      } else {
        setHasMoreData(false);
      }

      setIsLoading(false);
    },
    [
      authCtx.token?.access_token,
      customers?.length,
      searchEndDate,
      searchPhrase,
      searchStartDate,
      serviceTypeIds
    ]
  );

  useEffect(() => {
    if (!isLoading) requestApi(1);
  }, []);

  const fetchMoreData = () => {
    if (hasMoreData && !isLoading) {
      setPage((prevState) => {
        const nextPage = prevState + 1;
        requestApi(nextPage);
        return nextPage;
      });
    }
  };

  useEffect(() => {
    const refreshData = () => {
      setPage((prevState) => {
        const nextPage = 1;
        requestApi(nextPage);
        return nextPage;
      });
    };
    const unsubscribe = navigation.addListener('focus', () => {
      refreshData();
    });
    const timer = setTimeout(() => {
      refreshData();
    }, 600);
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [searchPhrase, searchStartDate, searchEndDate, serviceTypeIds, navigation]);

  useFocusEffect(() => {
    setIsVisibleFabGroup(true);
    return () => setIsVisibleFabGroup(false);
  });

  const navigateToEditPatient = (customerId: string, customerName: string) => {
    navigation?.navigate('EditPatient', { customerId, customerName });
  };

  const navigateToCreateCustomer = () => {
    navigation?.navigate('CreateCustomer');
  };

  const renderArticle = ({ item }) => (
    <CustomerListItem item={item} onNavigateToEditCustomer={navigateToEditPatient} />
  );
  const renderDivider = () => <View style={styles.articleSeparator}></View>;
  const renderFooter = () => {
    return (
      <View style={styles.center}>
        {hasMoreData && isLoading && <ActivityIndicator color={Colors.error500} size={40} />}
      </View>
    );
  };
  const keyExtractor = (item) => item.customerId;

  return (
    <>
      <Portal>
        <FAB.Group
          open={isOpenFabGroup}
          visible={isVisibleFabGroup}
          icon={isOpenFabGroup ? 'minus' : 'plus'}
          actions={[
            { icon: 'close', onPress: () => {} },
            {
              icon: 'plus',
              label: 'Incluir Paciente',
              onPress: () => navigateToCreateCustomer(),
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
          style={[styles.fabGroupStyle]}
          fabStyle={styles.fabStyle}
          color={Colors.primary100}
        />
      </Portal>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ minHeight: 100, paddingVertical: 10, paddingHorizontal: 15 }}
      >
        <Searchbar
          placeholder="Procurar"
          onChangeText={setSearchPhrase}
          value={searchPhrase}
          iconColor="#120461"
          clearButtonMode="while-editing"
          inputStyle={{ color: Colors.primary500 }}
        />
        <ScrollView horizontal={true} contentContainerStyle={{ gap: 10 }}>
          <Pressable
            onPress={() => setOpenDateRangeModal(true)}
            style={{
              height: 25,
              width: 180,
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
          <Pressable
            onPress={() => setOpenServiceTypesModal(true)}
            style={{
              height: 25,
              width: 180,
              borderWidth: 1,
              borderRadius: 15,
              padding: 2,
              marginTop: 5,
              borderColor: Colors.primary500
            }}
          >
            <ServiceTypesModal
              visible={openServiceTypesModal}
              setVisible={setOpenServiceTypesModal}
              selectedServiceTypes={selectedServiceTypes}
              setSelectedServiceTypes={setSelectedServiceTypes}
              mode="filter"
            />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ flex: 1 }}>
        {customers?.length === 0 && !hasMoreData ? (
          <Text
            style={{ fontSize: 18, textAlign: 'center', marginTop: 40, color: Colors.primary500 }}
          >
            Nenhum paciente encontrado!
          </Text>
        ) : (
          <FlatList
            data={customers}
            renderItem={renderArticle}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <Text style={{ fontSize: 18, textAlign: 'center' }}>Fim da lista de clientes</Text>
            }
            style={{ paddingHorizontal: 25 }}
            onEndReachedThreshold={0.2}
            keyExtractor={keyExtractor}
            onEndReached={fetchMoreData}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderDivider}
          />
        )}
      </View>
    </>
  );
};

export default CustomersList;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    borderBottomWidth: 1,
    backgroundColor: Colors.primary800,
    color: '#ffffff',
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 55,
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    verticalAlign: 'middle'
  },
  headlines: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 50,
    color: Colors.primary800,
    textAlign: 'center'
  },
  articleSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  fabGroupStyle: {
    bottom: 0,
    right: 0
  },
  fabStyle: {
    backgroundColor: Colors.primary800,
    color: Colors.primary100
  }
});
