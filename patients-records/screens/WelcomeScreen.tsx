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

  const [isLoading, setLoading] = useState(true);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<any | undefined>(undefined);

  const [patients, setPatients] = useState<GetPatient[]>([]);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasMoreData = useRef(true);

  useEffect(() => {
    navigation.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  const fetchData = useCallback(
    async (patientName?: string, advancedFilters?: any) => {
      setLoading(true);
      hasMoreData.current = true;
      console.log(`NEW PATIENTS: page=${page} - patientsCount=${patients?.length}`);
      const response = await getPatients(page, PAGE_SIZE, patientName, advancedFilters);

      setPatients((currentPatients) => {
        if (!response) {
          hasMoreData.current = false;
          return currentPatients;
        } else if (currentPatients) {
          const newUniquePatients: GetPatient[] = currentPatients ? [...currentPatients] : [];
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
          return newUniquePatients;
        } else {
          hasMoreData.current = false;
          return currentPatients;
        }
      });
      Keyboard.dismiss();
      setLoading(false);
      setRefreshing(false);
    },
    [page]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(searchPhrase, advancedFilters);
    }, 600);
    return () => {
      clearTimeout(timer);
    };
  }, [searchPhrase, advancedFilters, page, fetchData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [fetchData, navigation, refreshing]);

  const handleEditPatient = (patientId: string, patient?: GetPatient) => {
    navigation.navigate('EditPatient', { patientId, patient });
  };

  const handleCreatePatient = () => {
    navigation.navigate('CreatePatient', { patientId: undefined });
  };

  const onEndReached = () => {
    //console.log(`PAGE = ${page}`);
    setPage((previousPage) => {
      return previousPage + 1;
    });
  };

  const refreshData = () => {
    setPage(1);
    setRefreshing(true);
    setPatients([]);
    hasMoreData.current = true;
    console.log(`refreshData: page=${page} - patientsCount=${patients?.length}`);
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
        {/* <View style={styles.header}>
          <Header
            isWelcomeScreen={true}
            onCreateEditPatient={handleCreatePatient}
            title="Seus Pacientes"
          />
        </View> */}
        {
          //isLoading ? (
          // <View style={styles.center}>
          //   {/* https://reactnative.dev/docs/activityindicator */}
          //   <ActivityIndicator size="large" color={Colors.error500} />
          // </View>
          //) : (
          <View style={{ flex: 1 }}>
            {/* <SearchBar
              searchPhrase={searchPhrase}
              setSearchPhrase={setSearchPhrase}
              clicked={clicked}
              setClicked={setClicked}
              setAdvancedFilters={setAdvancedFilters}
            /> */}
            {/* Optimizing FlatList: https://reactnative.dev/docs/optimizing-flatlist-configuration */}
            <FlatList
              style={{ paddingHorizontal: 25 }}
              data={patients}
              renderItem={renderArticle}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={renderDivider}
              ListFooterComponent={renderFooter}
              //initialNumToRender={10}
              onEndReached={onEndReached}
              onEndReachedThreshold={1}
              onRefresh={refreshData}
              refreshing={refreshing}
              ListEmptyComponent={() => {
                return (
                  <Text style={{ fontSize: 18, textAlign: 'center' }}>
                    Nenhum paciente encontrado!
                  </Text>
                );
              }}
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
    alignItems: 'center'
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
