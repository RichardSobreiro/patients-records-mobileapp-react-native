/* eslint-disable import/order */
import IconButton from '../../../../../components/ui/IconButton';
import StackSheetCustom from '../../../../../components/ui/custom-form/StackSheetCustom';
import { Colors } from '../../../../../constants/styles';
import { getAnamnesisTypesList } from '../../../../../http/AnamnesisTypesApi';
import {
  GetAnamnesisTypeResponse,
  GetAnamnesisTypesResponse
} from '../../../../../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { AuthContext } from '../../../../../store/auth-context';
import { ErrorType } from '../AnamnesisList';
import { NotificationContext } from './../../../../../store/notification-context';
import { RootStackAnamnesisCrudParamList } from '/App';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Platform } from 'react-native';
import { Switch, Chip, Searchbar, Button as ButtonPaper } from 'react-native-paper';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAnamnesisTypes: GetAnamnesisTypeResponse[];
  setSelectedAnamnesisTypes: React.Dispatch<React.SetStateAction<GetAnamnesisTypeResponse[]>>;
  mode: 'filter' | 'crud';
  errors?: ErrorType;
  onChangeHandler?: (field: string, value: GetAnamnesisTypeResponse[]) => void;
  onBlurHandler?: (field: string) => void;
  isFocused?: boolean;
};

const AnamnesisTypesStackScreen: React.FC<Props> = ({
  visible,
  setVisible,
  selectedAnamnesisTypes,
  setSelectedAnamnesisTypes,
  mode,
  errors,
  onChangeHandler,
  onBlurHandler,
  isFocused
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackAnamnesisCrudParamList>>();

  const [isLoading, setIsLoading] = useState(false);
  const [anamnesisTypesList, setAnamnesisTypeList] = useState<GetAnamnesisTypeResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getAnamnesisTypesAsync = useCallback(async () => {
    if (authCtx.token?.access_token) {
      try {
        setIsLoading(true);
        const response = await getAnamnesisTypesList(authCtx.token?.access_token!);
        if (response.ok) {
          const apiResponseBody = response.body as GetAnamnesisTypesResponse;
          setAnamnesisTypeList(apiResponseBody.anamnesisTypes!);
        }
      } catch (error: any) {
        console.log(error);
        notificationCtx.showNotification({
          title: 'Ops...',
          message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [authCtx.token?.access_token, notificationCtx]);

  const removeItemFromSelected = (anamnesisTypeId: string) => {
    setSelectedAnamnesisTypes((prevState) => {
      const newSelectedAnamnesisTypes = prevState.filter(
        (s) => s.anamnesisTypeId !== anamnesisTypeId
      );
      onChangeHandler?.('selectedAnamnesisTypes', newSelectedAnamnesisTypes);
      return newSelectedAnamnesisTypes;
    });
  };

  useEffect(() => {
    getAnamnesisTypesAsync();
  }, [getAnamnesisTypesAsync, visible, isFocused]);

  const onChangeSearch = (query) => setSearchQuery(query);

  const renderItem = ({ item }) => {
    const anamnesisType = item as GetAnamnesisTypeResponse;
    return (
      <View key={anamnesisType.anamnesisTypeId} style={styles.listItemContent}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <Switch
            value={
              !!selectedAnamnesisTypes.find(
                (s) => s.anamnesisTypeId === anamnesisType.anamnesisTypeId
              )
            }
            onValueChange={() => {
              const existingItem = selectedAnamnesisTypes.filter(
                (s) => s.anamnesisTypeId === anamnesisType.anamnesisTypeId
              );
              if (existingItem && existingItem.length === 1) {
                const newSelectedAnamnesisTypes = selectedAnamnesisTypes.filter(
                  (s) => s.anamnesisTypeId !== anamnesisType.anamnesisTypeId
                );
                setSelectedAnamnesisTypes(newSelectedAnamnesisTypes);
                onChangeHandler?.('selectedAnamnesisTypes', newSelectedAnamnesisTypes);
              } else {
                if (selectedAnamnesisTypes && selectedAnamnesisTypes.length > 0) {
                  const newSelectedAnamnesisTypes = [...selectedAnamnesisTypes, anamnesisType];
                  setSelectedAnamnesisTypes(newSelectedAnamnesisTypes);
                  onChangeHandler?.('selectedAnamnesisTypes', newSelectedAnamnesisTypes);
                } else {
                  setSelectedAnamnesisTypes([anamnesisType]);
                  onChangeHandler?.('selectedAnamnesisTypes', [anamnesisType]);
                }
              }
            }}
          />
          <Text>{anamnesisType.anamnesisTypeDescription}</Text>
        </View>
        {anamnesisType.anamnesisTypeDescription !== 'Observações' &&
          anamnesisType.anamnesisTypeDescription !== 'Arquivo' && (
            <AntDesign
              onPress={() => {
                setVisible(false);
                navigation.push('EditAnamnesisType', {
                  anamnesisTypeId: anamnesisType.anamnesisTypeId
                });
              }}
              name="edit"
              size={32}
              color={Colors.primary500}
            />
          )}
      </View>
    );
  };

  return (
    <>
      {/* Anamnesis Types List */}
      <StackSheetCustom
        visible={visible}
        setVisible={setVisible}
        saveModalCallback={() => setVisible(false)}
        positiveActionLabel={''}
      >
        <View style={styles.topBarActions}>
          <View style={styles.topBarSearch}>
            <Searchbar placeholder="Procurar" onChangeText={onChangeSearch} value={searchQuery} />
          </View>
          <View style={styles.topBarActionsAddTypeButton}>
            <IconButton
              icon={'add'}
              color={Colors.primary500}
              size={48}
              onPress={() => {
                setVisible(false);
                navigation.push('CreateAnamnesisType');
              }}
              label="Incluir nova ficha"
            />
          </View>
        </View>
        <View style={styles.seletedChipsList}>
          {selectedAnamnesisTypes.map((selected) => {
            return (
              <Chip
                key={selected.anamnesisTypeId}
                icon="close"
                onPress={removeItemFromSelected.bind(null, selected.anamnesisTypeId)}
              >
                {selected.anamnesisTypeDescription}
              </Chip>
            );
          })}
        </View>
        {isLoading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={Colors.error500} size={40} />
          </View>
        ) : (
          <FlatList
            data={anamnesisTypesList}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                Nenhum tipo de ficha encontrado
              </Text>
            }
            contentContainerStyle={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}
            onEndReachedThreshold={0.2}
            keyExtractor={(item) => item.anamnesisTypeId}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StackSheetCustom>

      {mode === 'filter' && (
        <View style={styles.displayTextView}>
          <Text style={{ color: Colors.primary500 }}>Tipos de atendimento...</Text>
        </View>
      )}

      {mode === 'crud' && (
        <>
          <Text style={styles.label}>Tipos de anamnese:</Text>
          <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            <ButtonPaper
              onPress={() => {
                setVisible(true);
                onBlurHandler?.('selectedAnamnesisTypes');
              }}
              uppercase={false}
              mode="outlined"
              style={{ width: '100%' }}
            >
              Selecione o(s) tipo(s) de anamnese
            </ButtonPaper>
            {selectedAnamnesisTypes && selectedAnamnesisTypes.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 5,
                  marginHorizontal: 20,
                  marginVertical: 10
                }}
              >
                {selectedAnamnesisTypes.map((selected) => {
                  return (
                    <Chip
                      key={selected.anamnesisTypeId}
                      icon="close"
                      onPress={removeItemFromSelected.bind(null, selected.anamnesisTypeId)}
                    >
                      {selected.anamnesisTypeDescription}
                    </Chip>
                  );
                })}
              </View>
            )}
            {errors?.['selectedAnamnesisTypes'] ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors['selectedAnamnesisTypes']}</Text>
              </View>
            ) : null}
          </View>
        </>
      )}

      {/* {selectedAnamnesisTypes?.length > 0 &&
        selectedAnamnesisTypes.map((anamnesisType) => {
          return (
            <AnamnesisGeneralForm
              anamnesisTypeId={anamnesisType.anamnesisTypeId}
              selectedAnamnesisTypes={selectedAnamnesisTypes}
              setSelectedAnamnesisTypes={setSelectedAnamnesisTypes}
              isFocused={isFocused}
            />
          );
        })} */}
    </>
  );
};

export default AnamnesisTypesStackScreen;

const styles = StyleSheet.create({
  displayTextView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  },
  topBarActions: {
    width: '100%',
    height: 140,
    paddingHorizontal: 20,
    marginBottom: 5,
    alignItems: 'center'
  },
  topBarSearch: {
    flex: 1,
    width: '100%'
  },
  topBarActionsAddTypeButton: {
    flex: 1,
    width: '100%'
  },
  seletedChipsList: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 5,
    minHeight: 35
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listContent: {
    width: '100%',
    flex: 1
  },
  createUpdateAnamnesisTypeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    alignContent: 'stretch',
    gap: 15
  }
});
