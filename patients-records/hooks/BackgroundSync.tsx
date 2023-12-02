import { AccountSettingsContext } from '../store/user-notifications-context';

import React, { useContext, useEffect } from 'react';

const BackgroundSync = () => {
  const userNotificationCtx = useContext(AccountSettingsContext);

  useEffect(() => {
    const syncDataInBackground = async () => {
      try {
        console.log('Data sync completed in the background');
        await userNotificationCtx.updateUserNotificationsState();
        await userNotificationCtx.updateAccountSettingsState();
      } catch (error) {
        console.error('Background sync error:', error);
      }
    };

    const backgroundSyncInterval = setInterval(() => {
      syncDataInBackground();
    }, 60 * 1000);

    return () => {
      clearInterval(backgroundSyncInterval);
    };
  }, [
    userNotificationCtx,
    userNotificationCtx.updateAccountSettingsState,
    userNotificationCtx.updateUserNotificationsState
  ]);

  return <></>;
};

export default BackgroundSync;
