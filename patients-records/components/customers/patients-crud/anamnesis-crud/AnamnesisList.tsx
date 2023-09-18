/* eslint-disable import/order */
import DateRangePicker from '../../../../components/ui/custom-form/DateRangePicker';
import { Colors } from '../../../../constants/styles';
import { getAnamnesis } from '../../../../http/AnamnesisApi';
import { CreateAnamnesisTypeContentRequest } from '../../../../models/customers/anamnesis/CreateAnamneseRequest';
import { GetAnamnesis } from '../../../../models/customers/anamnesis/GetAnamnesisResponse';
import { AuthContext } from '../../../../store/auth-context';
import { NotificationContext } from '../../../../store/notification-context';
import { DateParser } from '../../../../util/dateParser';
import AnamnesisListItem from './AnamnesisListItem';
import CreateAnamnesis from './create-anamnesis/CreateAnamnesis';
import { RootStackAnamnesisCrudParamList } from '/App';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable, Text, FlatList } from 'react-native';
import { FAB, Portal, Searchbar } from 'react-native-paper';

export type ErrorType = {
  date: null | string;
  anamnesisTypeContents: null | string;
};

export type Inputs = {
  date: {
    value: Date;
    isValid: boolean;
  };
  anamnesisTypeContents: {
    value: CreateAnamnesisTypeContentRequest[];
    isValid: boolean;
  };
};

export type Touched = {
  date: boolean;
  anamnesisTypeContents: boolean;
};

type Props = { customerId: string };

const PAGE_SIZE = 10;

const AnamnesisList: React.FC<Props> = ({ customerId }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackAnamnesisCrudParamList>>();

  const [isLoading, setIsLoading] = useState(false);

  const [anamnesisList, setAnamnesisList] = useState<GetAnamnesis[]>([]);
  const [, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [searchAnamnesisTypeDescription, setSearchAnamnesisTypeDescription] = useState<string>('');
  const [searchStartDate, setSearchStartDate] = useState<Date | undefined>(undefined);
  const [searchEndDate, setSearchEndDate] = useState<Date | undefined>(undefined);
  const [openDateRangeModal, setOpenDateRangeModal] = useState<boolean>(false);

  const [isOpenFabGroup, setIsOpenFabGroup] = useState(false);
  const [isVisibleCreateAnamnesis, setVisibleCreateAnamnesis] = useState<boolean>(false);
  const [editAnamnesisId, setEditAnamnesisId] = useState<string | undefined>(undefined);
  const [showCreatedAnamnesisSnackbar, setShowCreatedAnamnesisSnackbar] = useState<boolean>(false);

  const isFocused = useIsFocused();

  const getAnamnesisListAsync = useCallback(
    async (nextPage: number) => {
      if (authCtx.token?.access_token) {
        setIsLoading(true);

        const response = await getAnamnesis(
          authCtx.token.access_token,
          nextPage as unknown as string,
          PAGE_SIZE as unknown as string,
          customerId as string,
          searchAnamnesisTypeDescription,
          searchStartDate,
          searchEndDate
        );

        if (response.ok) {
          if (anamnesisList.length > 0 && nextPage > 1) {
            setAnamnesisList((prevValue) => [...prevValue, ...response.body.anamnesis]);
          } else {
            setAnamnesisList([...response.body.anamnesis]);
          }
        } else {
          console.log(`ANAMNESIS LIST - ERROR - PAGE: ${nextPage}`);
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
    [
      anamnesisList.length,
      authCtx.token?.access_token,
      customerId,
      notificationCtx,
      searchAnamnesisTypeDescription,
      searchEndDate,
      searchStartDate
    ]
  );

  useEffect(() => {
    if (isFocused) {
      getAnamnesisListAsync(1);
    }
  }, [getAnamnesisListAsync, isFocused]);

  useEffect(() => {
    if (editAnamnesisId && editAnamnesisId !== '') {
      getAnamnesisListAsync(1);
    }
  }, [getAnamnesisListAsync, editAnamnesisId]);

  const fetchMoreData = () => {
    if (hasMoreData && !isLoading) {
      setPage((prevState) => {
        const nextPage = prevState + 1;
        getAnamnesisListAsync(nextPage);
        return nextPage;
      });
    }
  };

  const renderItem = ({ item }) => {
    return (
      <AnamnesisListItem
        key={item.anamneseId}
        anamnesis={item}
        navigateToUpdateAnamnesis={() => {
          navigation.push('EditAnamnesis', {
            customerId,
            anamnesisId: item.anamneseId
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

  const keyExtractor = (item: GetAnamnesis) => item.anamneseId;

  useEffect(() => {
    if (showCreatedAnamnesisSnackbar) {
      setTimeout(() => {
        setShowCreatedAnamnesisSnackbar(false);
      }, 5000);
    }
  }, [showCreatedAnamnesisSnackbar]);

  return (
    <>
      <CreateAnamnesis
        customerId={customerId}
        visible={isVisibleCreateAnamnesis}
        setVisible={setVisibleCreateAnamnesis}
        setCreatedAnamnesisId={setEditAnamnesisId}
        setShowCreatedAnamnesisSnackbar={setShowCreatedAnamnesisSnackbar}
      />

      <Portal>
        <FAB.Group
          open={isOpenFabGroup}
          visible={isFocused}
          icon={isOpenFabGroup ? 'minus' : 'plus'}
          actions={[
            { icon: 'close', onPress: () => {} },
            {
              icon: 'plus',
              label: 'Incluir Anamnese',
              onPress: () => setVisibleCreateAnamnesis(true),
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
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                marginVertical: 10,
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <Searchbar
                placeholder="Procurar"
                onChangeText={setSearchAnamnesisTypeDescription}
                value={searchAnamnesisTypeDescription}
                iconColor="#120461"
                clearButtonMode="while-editing"
                inputStyle={{ color: Colors.primary500 }}
                style={{ width: '100%' }}
              />
              <Pressable
                onPress={() => setOpenDateRangeModal(true)}
                style={{
                  height: 25,
                  width: 200,
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
                      : 'Data da anamnese...'
                  }
                  open={openDateRangeModal}
                  setOpen={setOpenDateRangeModal}
                  startDate={searchStartDate}
                  setStartDate={setSearchStartDate}
                  endDate={searchEndDate}
                  setEndDate={setSearchEndDate}
                />
              </Pressable>
            </View>
          </View>
          {anamnesisList?.length === 0 && !hasMoreData ? (
            <Text
              style={{ fontSize: 18, textAlign: 'center', marginTop: 40, color: Colors.primary500 }}
            >
              Nenhum atendimento encontrado!
            </Text>
          ) : (
            <FlatList
              data={anamnesisList}
              renderItem={renderItem}
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

export default AnamnesisList;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    verticalAlign: 'middle'
  },
  articleSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 15
  },
  listHeaderStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 10
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary500,
    flex: 1
  },
  fabGroupStyle: {
    bottom: 45,
    right: 0
  },
  fabStyle: {
    backgroundColor: Colors.primary800,
    color: Colors.primary100
  }
});
