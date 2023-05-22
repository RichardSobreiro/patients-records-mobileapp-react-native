import Article from '../components/welcome-screen/Article';
import Header from '../components/welcome-screen/Header';
import SearchBar from '../components/welcome-screen/SearchBar';
import CreateEditPatient from '../components/welcome-screen/patients-crud/CreateEditPatient';
import { Colors } from '../constants/styles';
import { getPatients } from '../http/PatientsApi';
import { GetPatient } from '../models/GetPatientsResponse';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from '@react-navigation/native';
import { uniqBy } from 'lodash';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  BackHandler,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  Keyboard
} from 'react-native';

const PAGE_SIZE = 10;

const WelcomeScreen: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(true);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<any | undefined>(undefined);

  const [isAddingEditingPatient, setIsAddingEditingPatient] = useState<boolean>(false);
  const [patientBeingEditedId, setPatientBeingEditedId] = useState<string | undefined>(undefined);

  const [patients, setPatients] = useState<GetPatient[]>([]);
  const [page, setPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasMoreData = useRef(true);

  useEffect(() => {
    navigation.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  const backFromAddPatient = useCallback(() => {
    setPatientBeingEditedId(undefined);
    setIsAddingEditingPatient(false);
    fetchData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      backFromAddPatient();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [backFromAddPatient]);

  const fetchData = async (patientName?: string, advancedFilters?: any) => {
    //if (!hasMoreData.current) return;

    const newPatients = await getPatients(patientName, advancedFilters);

    // if (newArticles!.length < PAGE_SIZE) {
    //   hasMoreData.current = false;
    // }

    setPatients((currentPatients) => {
      if (!newPatients) {
        return currentPatients;
      } else if (currentPatients) {
        // const allPatients = !patientName
        //   ? newPatients.patients!
        //   : [...currentPatients, ...newPatients.patients!];
        const allPatients = newPatients.patients!;
        return uniqBy(allPatients, 'patientId');
      } else {
        return currentPatients;
      }
    });
    Keyboard.dismiss();
    setLoading(false);
    setRefreshing(false);
    hasMoreData.current = false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      //if (searchPhrase === searchPhraseRef.current?.state) {
      fetchData(searchPhrase, advancedFilters);
      //}
    }, 600);
    return () => {
      clearTimeout(timer);
    };
  }, [searchPhrase, advancedFilters]);

  useEffect(() => {
    navigation.setOptions({ title: authCtx.userInfo?.username });
  }, [navigation, authCtx.userInfo]);

  const handleEditPatient = (patientId: string) => {
    setPatientBeingEditedId(patientId);
    setIsAddingEditingPatient(true);
  };

  const handleCreatePatient = () => {
    setIsAddingEditingPatient(true);
  };

  if (isAddingEditingPatient) {
    return (
      <CreateEditPatient
        onBackFromCreateEditPatientPress={backFromAddPatient}
        patientId={patientBeingEditedId}
      />
    );
  }

  const refreshData = () => {
    setPage(1);
    setRefreshing(true);
    setPatients([]);
    hasMoreData.current = true;
  };

  const renderArticle = ({ item }) => <Article item={item} editPatient={handleEditPatient} />;
  const renderDivider = () => <View style={styles.articleSeparator}></View>;
  const renderFooter = () => (
    <View style={styles.center}>
      {hasMoreData.current && <ActivityIndicator color={Colors.error500} size={40} />}
    </View>
  );
  const keyExtractor = (item) => item.patientId;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Header isWelcomeScreen={true} onCreateEditPatient={handleCreatePatient} />
        </View>
        <View>
          <Text style={styles.headlines}>Seus Pacientes</Text>
        </View>
        {isLoading ? (
          <View style={styles.center}>
            {/* https://reactnative.dev/docs/activityindicator */}
            <ActivityIndicator size="large" color={Colors.error500} />
          </View>
        ) : (
          <View>
            <SearchBar
              searchPhrase={searchPhrase}
              setSearchPhrase={setSearchPhrase}
              clicked={clicked}
              setClicked={setClicked}
              setAdvancedFilters={setAdvancedFilters}
            />
            {/* Optimizing FlatList: https://reactnative.dev/docs/optimizing-flatlist-configuration */}
            <FlatList
              style={{ paddingHorizontal: 25 }}
              data={patients}
              renderItem={renderArticle}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={renderDivider}
              ListFooterComponent={renderFooter}
              initialNumToRender={6}
              onEndReached={() => setPage((page) => page + 1)}
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
        )}
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
