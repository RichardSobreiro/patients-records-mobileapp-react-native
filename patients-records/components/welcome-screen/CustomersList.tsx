/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { GetCustomers } from '../../http/CustomersApi';
import { GetCustomer } from '../../models/GetCustomersResponse';
import { AuthContext } from '../../store/auth-context';
import CustomerListItem from './CustomerListItem';
import Header from './Header';
import SearchBar from './SearchBar';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PAGE_SIZE = 10;

type Props = {
  navigation: any;
};

export type AdvancedFilters = {
  startDate?: Date;
  startDateIsValid: boolean;
  endDate?: Date;
  endDateIsValid: boolean;
  serviceTypeIds?: string[];
};

const CustomersList: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters | undefined>(undefined);

  const [customers, setCustomers] = useState<GetCustomer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const resetList = useRef(true);

  useEffect(() => {
    navigation?.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  const requestApi = useCallback(
    async (nextPage: number) => {
      setIsLoading(true);
      console.log('CURRENT PAGE', nextPage);

      const response = await GetCustomers(
        authCtx.token?.access_token!,
        nextPage,
        PAGE_SIZE,
        searchPhrase,
        advancedFilters
      );

      if (response) {
        console.log(`SUCCESS - PAGE: ${nextPage} -PAGE SIZE: ${response.customers?.length}`);
        if (customers?.length > 0 && nextPage > 1) {
          setCustomers((prevCustomers) => [...prevCustomers, ...response.customers!]);
        } else {
          setCustomers([...response.customers!]);
        }
      } else {
        console.log(`ERROR - PAGE: ${nextPage}`);
      }

      if (response?.next) {
        setHasMoreData(true);
      } else {
        setHasMoreData(false);
      }

      setIsLoading(false);
    },
    [advancedFilters, authCtx.token?.access_token, customers?.length, searchPhrase]
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
  }, [searchPhrase, advancedFilters]);

  const navigateToEditPatient = (customerId: string) => {
    navigation?.navigate('EditPatient', { customerId });
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
    <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
      <View style={styles.header}>
        <Header
          isWelcomeScreen={true}
          onNavigateToCreateCustomer={navigateToCreateCustomer}
          title="Seus Clientes"
        />
      </View>
      {
        <View style={{ flex: 1 }}>
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setAdvancedFilters={setAdvancedFilters}
            setMustResetList={resetList}
          />
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
      }
    </KeyboardAwareScrollView>
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
    borderBottomColor: '#ed7669'
  }
});
