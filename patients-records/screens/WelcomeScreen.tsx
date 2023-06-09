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
  const currentPage = useRef<number>(0);
  const [page, setPage] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasMoreData = useRef(true);
  const resetList = useRef(false);

  useEffect(() => {
    navigation.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  const refreshData = useCallback(() => {
    currentPage.current = 0;
    setRefreshing(true);
    hasMoreData.current = true;
    console.log(`refreshData: page= ${currentPage.current} - patientsCount=${patients?.length}`);
  }, [currentPage, patients?.length]);

  const fetchData = useCallback(
    async (patientName?: string, advancedFilters?: any) => {
      setLoading(true);
      hasMoreData.current = true;
      if (resetList.current) {
        refreshData();
      }

      console.log(
        `NEW PATIENTS: page = ${currentPage.current} - patientsCount=${patients?.length} - patientName = ${patientName}`
      );

      const response = await getPatients(
        currentPage.current,
        PAGE_SIZE,
        patientName,
        advancedFilters
      );

      setPatients((currentPatients) => {
        setLoading(false);
        setRefreshing(false);
        setHasFilterChanged(false);

        if (!response) {
          hasMoreData.current = false;
          return currentPatients;
        } else if (currentPatients) {
          let newUniquePatients: GetPatient[] = [];
          if (resetList.current) {
            newUniquePatients = response!.patients!;
          } else {
            newUniquePatients = currentPatients ? [...currentPatients] : [];
            response!.patients?.forEach((item) => {
              if (newUniquePatients!.findIndex((item2) => item2.patientId === item.patientId) < 0) {
                newUniquePatients.push(item);
              }
            });

            hasMoreData.current = !!(
              newUniquePatients && newUniquePatients?.length < response.patientsCount
            );
            if (newUniquePatients?.length! < PAGE_SIZE) {
              hasMoreData.current = false;
            }
          }
          resetList.current = false;
          return newUniquePatients;
        } else {
          hasMoreData.current = false;
          return currentPatients;
        }
      });
      Keyboard.dismiss();
    },
    [currentPage, patients?.length, refreshData]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    const timer = setTimeout(() => {
      console.log(`setTimeout`);
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
    fetchData,
    navigation,
    refreshing,
    refreshData,
    page,
    resetList.current
  ]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log(`focus`);
  //     fetchData();
  //   });
  //   return unsubscribe;
  // }, [fetchData, navigation, refreshing]);

  const handleEditPatient = (patientId: string, patient?: GetPatient) => {
    navigation.navigate('EditPatient', { patientId, patient });
  };

  const handleCreatePatient = () => {
    navigation.navigate('CreatePatient', { patientId: undefined });
  };

  const onEndReached = () => {
    console.log(`PREVIOUS PAGE = ${currentPage.current}`);
    if (!refreshing) {
      currentPage.current += 1;
      setPage((prevPage) => {
        return (prevPage += 1);
      });
    }
    console.log(`CURRENT PAGE = ${currentPage.current}`);
  };

  const renderArticle = ({ item }) => (
    <PatientListItem item={item} editPatient={handleEditPatient} />
  );
  const renderDivider = () => <View style={styles.articleSeparator}></View>;
  const renderFooter = () => {
    //console.log(`hasMoreData.current = ${hasMoreData.current}`);
    return (
      <View style={styles.center}>
        {hasMoreData.current && <ActivityIndicator color={Colors.error500} size={40} />}
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
              onRefresh={refreshData}
              refreshing={refreshing}
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
