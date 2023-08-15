/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { getProceedings } from '../../../http/ProceedingsApi';
import { GetCustomer } from '../../../models/GetCustomersResponse';
import {
  GetProceedingResponse,
  GetProceedingsResponse
} from '../../../models/proceedings/GetProceedingResponse';
import ServicesListItem from './ServicesListItem';
import ServicesListSearchBar from './ServicesListSearchBar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { EditPatientStackParamList } from 'App';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';

const PAGE_SIZE = 10;

type Props = {
  patient: GetCustomer;
  refresh?: boolean;
};

const ServicesList: React.FC<Props> = ({ patient, refresh }) => {
  const [currentPatient] = useState<GetCustomer>(patient);
  const [proceedings, setProceedings] = useState<GetProceedingsResponse | undefined | null>(
    undefined
  );
  const hasMoreData = useRef(true);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(!!refresh);
  const navigationEditPatient = useNavigation<BottomTabNavigationProp<EditPatientStackParamList>>();

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    const getProceedingsPage = async (
      pageNumber: number,
      limit: number,
      forceListing?: boolean
    ) => {
      if (!hasMoreData.current && !forceListing) return;
      setLoading(true);

      const response = await getProceedings(currentPatient.customerId, pageNumber, limit);
      if (response) {
        setProceedings((prevState) => {
          const uniqueProceedings: GetProceedingResponse[] = prevState?.proceedings
            ? [...prevState?.proceedings!]
            : [];
          response!.proceedings?.forEach((item) => {
            if (
              uniqueProceedings!.findIndex((item2) => item2.proceedingId === item.proceedingId) < 0
            ) {
              uniqueProceedings.push(item);
            }
          });
          const newState = {
            ...response,
            proceedings: uniqueProceedings
          };
          hasMoreData.current = !!(
            newState.proceedings && newState.proceedings?.length < newState.proceedingsCount
          );
          if (newState.proceedings?.length! < PAGE_SIZE) {
            hasMoreData.current = false;
          }
          return newState;
        });
      }
      setLoading(false);
      setRefreshing(false);
    };
    const pageNumber: number = proceedings ? proceedings.next?.pageNumber! : 0;
    getProceedingsPage(pageNumber, PAGE_SIZE);

    navigationEditPatient.addListener('focus', refreshData);
  }, [page, currentPatient, proceedings, refreshing, navigationEditPatient]);

  const refreshData = () => {
    setPage(1);
    setRefreshing(true);
    setProceedings(undefined);
    hasMoreData.current = true;
  };

  const navigateToCreateEditingProceeding = (proceeding: GetProceedingResponse) => {
    navigationEditPatient.navigate('EditProceeding', { patient, proceeding });
  };

  const renderArticle = ({ item }) => (
    <ServicesListItem
      proceeding={item}
      navigateToUpdateProceeding={navigateToCreateEditingProceeding.bind(null, item)}
    />
  );

  const renderDivider = () => <View style={styles.articleSeparator}></View>;

  const renderFooter = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {hasMoreData.current && <ActivityIndicator color={Colors.error500} />}
    </View>
  );

  const keyExtractor = (item: GetProceedingResponse) => item.proceedingId;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View>
              <ServicesListSearchBar
                clicked={clicked}
                setClicked={setClicked}
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
              />
            </View>
          </View>
          <FlatList
            data={proceedings?.proceedings}
            renderItem={renderArticle}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={true}
            ItemSeparatorComponent={renderDivider}
            ListFooterComponent={renderFooter}
            initialNumToRender={PAGE_SIZE}
            onEndReached={() => setPage((page) => page + 1)}
            onEndReachedThreshold={1}
            onRefresh={refreshData}
            refreshing={refreshing}
            ListEmptyComponent={() => {
              return (
                <Text style={{ fontSize: 18, textAlign: 'center' }}>
                  {isLoading ? '' : 'Nenhum procedimento encontrado!'}
                </Text>
              );
            }}
          />
        </View>
      </View>
    </>
  );
};

export default ServicesList;

const styles = StyleSheet.create({
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
  }
});
