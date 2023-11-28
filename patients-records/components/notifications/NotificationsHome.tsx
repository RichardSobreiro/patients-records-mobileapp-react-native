import { Colors } from '../../constants/styles';
import { getUserNotifications } from '../../http/NotificationsApi';
import GetNotificationsResponse, {
  GetNotificationResponse
} from '../../models/notifications/GetNotificationsResponse';
import { AuthContext } from '../../store/auth-context';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
};

const NotificationsHome: React.FC<Props> = () => {
  const authCtx = useContext(AuthContext);

  const [notifications, setNotifications] = useState<GetNotificationResponse[] | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const getUserNotificationsAsync = useCallback(
    async (nextPage: number) => {
      if (authCtx.token?.access_token) {
        setIsLoading(true);

        const response = await getUserNotifications(
          authCtx.token.access_token,
          nextPage as unknown as string,
          '10'
        );

        if (response.ok) {
          const body = response.body as GetNotificationsResponse;
          if (body.previous && body.previous.pageNumber >= 0) {
            setNotifications((prevValue) => [...prevValue!, ...body.notifications!]);
          } else {
            setNotifications([...body.notifications!]);
          }
        } else {
        }
        if (response.body.next) {
          setHasMoreData(true);
        } else {
          setHasMoreData(false);
        }

        setIsLoading(false);
      }
    },
    [authCtx]
  );

  const fetchMoreData = () => {
    if (hasMoreData && !isLoading) {
      setPage((prevState) => {
        const nextPage = prevState + 1;
        getUserNotificationsAsync(nextPage);
        return nextPage;
      });
    }
  };

  const renderArticle = ({ item }) => {
    const notification = item as GetNotificationResponse;
    return (
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <MaterialIcons name="payment" size={48} color={Colors.primary800} />
        </View>
        <View style={{ flex: 5 }}>
          <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
            {notification.title}
          </Text>
          <Text style={{ color: Colors.primary500, fontSize: 12 }}>
            {notification.shortDescription}
          </Text>
        </View>
      </View>
    );
  };

  const renderDivider = () => <View style={styles.articleSeparator}></View>;

  const renderFooter = () => {
    return (
      <>
        <View>
          {hasMoreData && isLoading && (
            <ActivityIndicator
              color={Colors.primary800}
              size={120}
              style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.tertiary900Op12,
                zIndex: 2000
              }}
            />
          )}
        </View>
      </>
    );
  };

  const keyExtractor = (item: GetNotificationResponse) => item.notificationId;

  const onRefresh = async () => {
    setRefreshing(true);

    await getUserNotificationsAsync(page);

    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      setPage(1);
      getUserNotificationsAsync(1);
    }
  }, [getUserNotificationsAsync, isFocused]);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderArticle}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                minHeight: 200,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <Ionicons name="notifications-off-sharp" size={100} color={Colors.primary800} />
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: Colors.primary500
                }}
              >
                {isLoading ? '' : 'Você não tem notificações!'}
              </Text>
            </View>
          );
        }}
        style={{ paddingHorizontal: 20 }}
        onEndReachedThreshold={0.1}
        keyExtractor={keyExtractor}
        onEndReached={fetchMoreData}
        showsVerticalScrollIndicator={true}
        ItemSeparatorComponent={renderDivider}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary100,
    flex: 1
  },
  articleSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  }
});

export default NotificationsHome;
