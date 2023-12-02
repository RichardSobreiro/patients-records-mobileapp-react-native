import { Colors } from '../../constants/styles';
import useAsyncErrorHandler from '../../hooks/useAsyncErrorHandler';
import { getUserNotifications, updateUserNotification } from '../../http/NotificationsApi';
import GetNotificationsResponse, {
  GetNotificationResponse
} from '../../models/notifications/GetNotificationsResponse';
import UpdateNotificationRequest from '../../models/notifications/UpdateNotificationRequest';
import UpdateNotificationResponse from '../../models/notifications/UpdateNotificationResponse';
import { AuthContext } from '../../store/auth-context';
import { AccountSettingsContext } from '../../store/user-notifications-context';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type Props = {
  navigation: any;
};

const NotificationsHome: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const userNotificationCtx = useContext(AccountSettingsContext);
  const asyncErrorHandler = useAsyncErrorHandler();

  const [notifications, setNotifications] = useState<GetNotificationResponse[] | undefined>(
    undefined
  );
  const [unReadNotifications, setUnReadNotifications] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const getUserNotificationsAsync = useCallback(
    async (nextPage: number) => {
      if (authCtx.token?.access_token) {
        setIsLoading(true);
        try {
          const response = await getUserNotifications(
            authCtx.token.access_token,
            nextPage as unknown as string,
            '10'
          );

          if (response.ok) {
            const body = response.body as GetNotificationsResponse;

            setUnReadNotifications(body.unReadNotificationsCount);

            if (body.previous && body.previous.pageNumber >= 0) {
              setNotifications((prevValue) => [...prevValue!, ...body.notifications!]);
            } else {
              setNotifications([...body.notifications!]);
            }
          } else {
            asyncErrorHandler(
              new Error(
                `NotificationsHome.getUserNotificationsAsync - else: ${JSON.stringify(response)}`,
                {
                  cause: response.httpStatusCode
                }
              )
            );
          }
          if (response.body.next) {
            setHasMoreData(true);
          } else {
            setHasMoreData(false);
          }
        } catch (error: any) {
          asyncErrorHandler(
            new Error(
              `NotificationsHome.getUserNotificationsAsync - catch: ${JSON.stringify(error)}`,
              {
                cause: error.message
              }
            )
          );
        }

        setIsLoading(false);
      }
    },
    [asyncErrorHandler, authCtx]
  );

  const updateNotificationAsync = async (request: UpdateNotificationRequest) => {
    try {
      const response = await updateUserNotification(authCtx.token?.access_token!, request);
      if (response.ok) {
        const reponseBody = response.body as UpdateNotificationResponse;
        await userNotificationCtx.updateUserNotificationsState();
        return reponseBody;
      } else {
        asyncErrorHandler(
          new Error(
            `NotificationsHome.updateNotificationAsync - else: ${JSON.stringify(response)}`,
            {
              cause: response.httpStatusCode
            }
          )
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`NotificationsHome.updateNotificationAsync - catch: ${JSON.stringify(error)}`, {
          cause: error.message
        })
      );
    }
  };

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
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate('Settings', { screen: 'PaymentsPlanSettings' });
          await updateNotificationAsync(
            new UpdateNotificationRequest(notification.notificationId, true, new Date())
          );
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: Colors.primary500,
            borderRadius: 20,
            padding: 10
          }}
        >
          <View style={{ flex: 1 }}>
            <MaterialIcons name="payment" size={48} color={Colors.primary800} />
          </View>
          <View style={{ flex: 5 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
                {notification.title}
              </Text>
              {!notification.read && (
                <Ionicons name="ios-mail-unread" size={24} color={Colors.primary500} />
              )}
            </View>
            <Text style={{ color: Colors.primary500, fontSize: 12 }}>
              {notification.shortDescription}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
        ListHeaderComponent={
          <View>
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>
              {unReadNotifications === 0 && 'Você tem 0 notificações não lidas!'}
              {unReadNotifications === 1 && 'Você tem 1 notificação não lida!'}
              {unReadNotifications > 1 && `Você tem ${unReadNotifications} notificações não lidas!`}
            </Text>
          </View>
        }
        ListHeaderComponentStyle={{ marginVertical: 20 }}
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
    borderBottomColor: 'white',
    marginVertical: 10
  }
});

export default NotificationsHome;
