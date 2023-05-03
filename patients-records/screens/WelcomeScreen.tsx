import Article from '../components/welcome-screen/Article';
import Header from '../components/welcome-screen/Header';
import SearchBar from '../components/welcome-screen/SearchBar';
import CreateEditPatient from '../components/welcome-screen/patients-crud/CreateEditPatient';
import { Colors } from '../constants/styles';
import { getPatients } from '../http/PatientsApi';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from '@react-navigation/native';
import { uniqBy } from 'lodash';
import { GetPatient } from 'models/Patient';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  BackHandler,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList
} from 'react-native';

const PRIMARY_COLOR = '#e74c3c';
const PAGE_SIZE = 20;

const WelcomeScreen: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(true);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [clicked, setClicked] = useState(false);

  const [isAddingEditingPatient, setIsAddingEditingPatient] = useState<boolean>(false);
  const [patientBeingEditedId, setPatientBeingEditedId] = useState<string | undefined>(undefined);

  const [patients, setPatients] = useState<GetPatient[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const hasMoreData = useRef(true);

  const backFromAddPatient = useCallback(() => {
    setPatientBeingEditedId(undefined);
    setIsAddingEditingPatient(false);
  }, []);

  useEffect(() => {
    const backAction = () => {
      backFromAddPatient();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [backFromAddPatient]);

  useEffect(() => {
    const fetchData = async () => {
      //if (!hasMoreData.current) return;

      const newPatients = await getPatients();

      // if (newArticles!.length < PAGE_SIZE) {
      //   hasMoreData.current = false;
      // }

      setPatients((currentPatients) => {
        if (!newPatients) {
          return currentPatients;
        } else if (currentPatients) {
          const allPatients = [...currentPatients, ...newPatients.patients!];
          return uniqBy(allPatients, 'patientId');
        } else {
          return patients;
        }
      });
      setLoading(false);
      setRefreshing(false);
    };

    fetchData();
  }, [patients, searchPhrase]);

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
      {hasMoreData.current && <ActivityIndicator color={PRIMARY_COLOR} />}
    </View>
  );
  const keyExtractor = (item) => item.patientId;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Header isWelcomeScreen={true} onCreateEditPatient={handleCreatePatient} />
        </View>
        <View style={styles.content}>
          <Text style={styles.headlines}>Seus Pacientes</Text>

          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            clicked={clicked}
            setClicked={setClicked}
          />

          {isLoading ? (
            <View style={styles.center}>
              {/* https://reactnative.dev/docs/activityindicator */}
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
          ) : (
            // Optimizing FlatList: https://reactnative.dev/docs/optimizing-flatlist-configuration
            <FlatList
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
            />
          )}
        </View>
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
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 55
  },
  content: {
    flex: 1,
    padding: 15
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
