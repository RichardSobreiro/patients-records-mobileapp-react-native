/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { getServiceTypesList } from '../../http/ServiceTypesApi';
import {
  GetServiceTypeResponse,
  GetServiceTypesResponse
} from '../../models/customers/service-types/GetServiceTypesResponse';
import { AuthContext } from '../../store/auth-context';
import StackSheetCustom from './custom-form/StackSheetCustom';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { Switch } from 'react-native-paper';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedServiceTypes: GetServiceTypeResponse[];
  setSelectedServiceTypes: React.Dispatch<React.SetStateAction<GetServiceTypeResponse[]>>;
};

const ServiceTypesModal: React.FC<Props> = ({
  visible,
  setVisible,
  selectedServiceTypes,
  setSelectedServiceTypes
}: Props) => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTypesList, setServicesTypeList] = useState<GetServiceTypeResponse[]>([]);

  const getServiceTypesAsync = useCallback(async () => {
    if (authCtx.token?.access_token) {
      try {
        setIsLoading(true);
        const response = await getServiceTypesList(authCtx.token?.access_token!);
        if (response.ok) {
          const apiResponseBody = response.body as GetServiceTypesResponse;
          console.log(apiResponseBody);
          setServicesTypeList(apiResponseBody.serviceTypes!);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [authCtx.token?.access_token]);

  useEffect(() => {
    if (authCtx.token?.access_token) {
      getServiceTypesAsync();
    }
  }, [authCtx.token?.access_token, getServiceTypesAsync, visible]);

  const renderItem = ({ item }) => {
    const serviceType = item as GetServiceTypeResponse;
    return (
      <View key={serviceType.serviceTypeId} style={styles.listItemContent}>
        <Switch
          value={!!selectedServiceTypes.find((s) => s.serviceTypeId === serviceType.serviceTypeId)}
          onValueChange={() => {
            const existingItem = selectedServiceTypes.filter(
              (s) => s.serviceTypeId === serviceType.serviceTypeId
            );
            if (existingItem && existingItem.length === 1) {
              const newSelectedServiceTypes = selectedServiceTypes.filter(
                (s) => s.serviceTypeId !== serviceType.serviceTypeId
              );
              setSelectedServiceTypes(newSelectedServiceTypes);
            } else {
              if (selectedServiceTypes && selectedServiceTypes.length > 0) {
                const newSelectedServiceTypes = [...selectedServiceTypes, serviceType];
                setSelectedServiceTypes(newSelectedServiceTypes);
              } else {
                setSelectedServiceTypes([serviceType]);
              }
            }
          }}
        />
        <Text>{serviceType.serviceTypeDescription}</Text>
      </View>
    );
  };
  return (
    <>
      <StackSheetCustom visible={visible} setVisible={setVisible}>
        {isLoading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={Colors.error500} size={40} />
          </View>
        ) : (
          <FlatList
            data={serviceTypesList}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                Nenhum tipo de serviço encontrado
              </Text>
            }
            contentContainerStyle={styles.listContent}
            onEndReachedThreshold={0.2}
            keyExtractor={(item) => item.serviceTypeId}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StackSheetCustom>
      <View style={styles.displayTextView}>
        <Text>Tipos de atendimento...</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  displayTextView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContent: {
    justifyContent: 'flex-start',
    width: '100%',
    flex: 1
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  }
});

export default ServiceTypesModal;
