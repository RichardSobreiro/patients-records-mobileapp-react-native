/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { getProceedings } from '../../../http/ProceedingsApi';
import { GetPatient } from '../../../models/GetPatientsResponse';
import {
  GetProceedingResponse,
  GetProceedingsResponse
} from '../../../models/proceedings/GetProceedingResponse';
import ProceedingsListItem from './ProceedingListItem';
import ProceedingsListSearchBar from './ProceedingsListSearchBar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { EditPatientStackParamList } from 'App';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';

const PAGE_SIZE = 10;

type Props = {
  patient: GetPatient;
};

const ProceedingsList: React.FC<Props> = ({ patient }) => {
  const [currentPatient] = useState<GetPatient>(patient);
  const [proceedings, setProceedings] = useState<GetProceedingsResponse | undefined | null>(
    undefined
  );
  const hasMoreData = useRef(true);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigationEditPatient = useNavigation<BottomTabNavigationProp<EditPatientStackParamList>>();

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const getProceedingsPage = async (pageNumber: number, limit: number, forceListing?: boolean) => {
    if (!hasMoreData.current && !forceListing) return;

    const response = await getProceedings(currentPatient.patientId, pageNumber, limit);
    if (response) {
      setProceedings((prevState) => {
        const newState = {
          ...response,
          proceedings:
            prevState?.proceedings && !refreshing
              ? prevState?.proceedings?.concat(response.proceedings!)
              : response.proceedings
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

  useEffect(() => {
    const pageNumber: number = proceedings ? proceedings.next?.pageNumber! : 0;
    getProceedingsPage(pageNumber, PAGE_SIZE);
  }, [page, currentPatient]);

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
    <ProceedingsListItem
      proceeding={item}
      navigateToUpdateProceeding={navigateToCreateEditingProceeding}
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
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.error500} />
          </View>
        ) : (
          <View style={styles.content}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <View>
                <ProceedingsListSearchBar
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
                    Nenhum procedimento encontrado!
                  </Text>
                );
              }}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default ProceedingsList;

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
