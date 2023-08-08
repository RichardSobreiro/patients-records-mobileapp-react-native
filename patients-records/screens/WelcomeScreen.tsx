import Header from '../components/welcome-screen/Header';
import PatientListItem from '../components/welcome-screen/PatientListItem';
import SearchBar from '../components/welcome-screen/SearchBar';
import { Colors } from '../constants/styles';
import { getPatients } from '../http/PatientsApi';
import { GetPatient } from '../models/GetPatientsResponse';
import { AuthContext } from '../store/auth-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditPatientStackParamList, RootStackParamList } from 'App';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  Keyboard
} from 'react-native';

const PAGE_SIZE = 10;

type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Welcome'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const WelcomeScreen: React.FC = ({ navigation }: HomeScreenNavigationProp) => {
  const authCtx = useContext(AuthContext);

  const [isLoading, setLoading] = useState(false);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<any | undefined>(undefined);
  const [hasFilterChanged, setHasFilterChanged] = useState<boolean>(false);

  const [patients, setPatients] = useState<GetPatient[]>([]);
  const nextPage = useRef<number>(1);
  const [updateList, setUpdateList] = useState<boolean>(true);
  const hasMoreData = useRef(true);
  const resetList = useRef(false);

  useEffect(() => {
    navigation.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  const onEndReached = () => {
    if (hasMoreData.current) {
      setUpdateList(true);
    }
  };

  useEffect(() => {
    const refreshData = () => {
      nextPage.current = 1;
      setUpdateList(true);
      hasMoreData.current = true;
    };

    const fetchData = async (patientName?: string, advancedFilters?: any) => {
      setLoading(true);
      hasMoreData.current = true;
      if (resetList.current) {
        refreshData();
      }

      const response = await getPatients(nextPage.current, PAGE_SIZE, patientName, advancedFilters);

      setPatients((currentPatients) => {
        setLoading(false);
        setHasFilterChanged(false);
        setUpdateList(false);

        if (!response) {
          hasMoreData.current = false;
          return currentPatients;
        } else {
          let newUniquePatients: GetPatient[] = [];
          if (resetList.current) {
            newUniquePatients = response!.patients!;
          } else {
            newUniquePatients = [...response!.patients!];
            currentPatients?.forEach((existingPatient) => {
              if (
                newUniquePatients!.findIndex(
                  (receivedPatient) => receivedPatient.patientId === existingPatient.patientId
                ) === -1
              ) {
                newUniquePatients.push(existingPatient);
              }
            });

            hasMoreData.current = !!response.next;
            nextPage.current = response.next ? response.next?.pageNumber! + 1 : nextPage.current;
          }
          resetList.current = false;

          newUniquePatients.sort((p1, p2) => {
            if (p1.mostRecentProceedingDate && p2.mostRecentProceedingDate) {
              if (p1.mostRecentProceedingDate > p2.mostRecentProceedingDate) {
                return -1;
              } else {
                return 1;
              }
            } else if (p1.mostRecentProceedingDate && !p2.mostRecentProceedingDate) {
              return -1;
            } else if (!p1.mostRecentProceedingDate && p2.mostRecentProceedingDate) {
              return 1;
            } else {
              if (p1.creationDate > p2.creationDate) {
                return -1;
              } else {
                return 1;
              }
            }
          });
          return newUniquePatients;
        }
      });
      //Keyboard.dismiss();
    };

    const unsubscribe = navigation.addListener('focus', () => {
      refreshData();
      fetchData();
    });

    const timer = setTimeout(() => {
      fetchData(searchPhrase, advancedFilters);
    }, 600);
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [
    searchPhrase,
    advancedFilters,
    hasFilterChanged,
    updateList,
    navigation
    //fetchData,
    //refreshData
  ]);

  const handleEditPatient = (patientId: string, patient?: GetPatient) => {
    navigation.navigate('EditPatient', { patientId, patient });
  };

  const handleCreatePatient = () => {
    navigation.navigate('CreatePatient', { patientId: undefined });
  };

  const renderArticle = ({ item }) => (
    <PatientListItem item={item} editPatient={handleEditPatient} />
  );
  const renderDivider = () => <View style={styles.articleSeparator}></View>;
  const renderFooter = () => {
    return (
      <View style={styles.center}>
        {(hasMoreData.current || isLoading) && (
          <ActivityIndicator color={Colors.error500} size={40} />
        )}
      </View>
    );
  };
  const keyExtractor = (item) => item.patientId;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Header
            isWelcomeScreen={true}
            onCreateEditPatient={handleCreatePatient}
            title="Seus Pacientes"
          />
        </View>
        {
          <View style={{ flex: 1 }}>
            <SearchBar
              searchPhrase={searchPhrase}
              setSearchPhrase={setSearchPhrase}
              clicked={clicked}
              setClicked={setClicked}
              setAdvancedFilters={setAdvancedFilters}
              setMustResetList={resetList}
            />
            {patients?.length === 0 && !hasMoreData.current && (
              <Text style={{ fontSize: 18, textAlign: 'center' }}>Nenhum paciente encontrado!</Text>
            )}
            {/* Optimizing FlatList: https://reactnative.dev/docs/optimizing-flatlist-configuration */}
            <FlatList
              style={{ paddingHorizontal: 25 }}
              data={patients}
              renderItem={renderArticle}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={renderDivider}
              ListFooterComponent={renderFooter}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
              //ListHeaderComponent={}
              // onRefresh={refreshData}
              // refreshing={refreshing}
            />
          </View>
          //)
        }
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
    //paddingTop: Constants.statusBarHeight
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
    height: 55
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
