import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading/loading';
import { AppContext } from '../../context/ContextProvider';
import { AppEventTypes } from '../../types/AppType';
import { ObjectType } from '../../types/commonTypes';
import { NavigationPath } from '../../types/DomainTypes';
import { buildDisplayText, sortItems } from '../../utils';
import { useExecuteMutation } from '../hooks/useExecuteMutation';
import useFadeInOnScroll from '../hooks/useFadeInOnScroll';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useLazyExecuteQuery } from '../hooks/useLazyExecuteQuery';
import SharedLayout from '../shared/SharedLayout';
import { GET_NOTIFICATIONS } from './graphql/getNotifications';
import { UPDATE_NOTIFICATION_ITEM } from './graphql/updateNotificationItem';
import NotificationTemplate from './NotificationTemplate';
import { NotificationResponse, NotificationType } from './types';

const getBlankNotification = (options = {} as ObjectType) => {
  return {
    id: '',
    summary: '',
    createdDateTime: '',
    description: '',
    type: '',
    isRead: false,
    sortingId: 0,
    category: '',
    updatedDateTime: '',
    isToday: false,
    showClearButton: false,
    ...options,
  };
};

enum DisplayTextKeys {
  TITLE = 'notifications:title',
  READ_TEXT = 'notifications:read_text',
  UNREAD_TEXT = 'notifications:unread_text',
  MARK_AS_READ_TEXT = 'notifications:mark_as_read_text',
  MARK_AS_UNREAD_TEXT = 'notifications:mark_as_unread_text',
  MARK_ALL_AS_READ_TEXT = 'notifications:mark_all_as_read_text',
  MARK_ALL_AS_UNREAD_TEXT = 'notifications:mark_all_as_unread_text',
  TODAY_TEXT = 'notifications:today',
  CLEAR_ALL = 'notifications:clear_all',
  PREVIOUS_TEXT = 'notifications:previous',
}

const Notifications = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    state: {
      app: { hasNotifications },
    },
  } = useContext(AppContext);

  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'notifications:', t), [t]);
  // const { results: fetchedNotifications } = useExecuteQuery('userNotifications', GET_NOTIFICATIONS, {
  //   variables: {
  //     from: 0,
  //     pageSize: 100000,
  //   },
  // });

  const {
    executor: fetchNotifications,
    data: fetchNotificationsResult,
    loading: loadingNotifications,
  } = useLazyExecuteQuery(
    //'userNotifications',
    GET_NOTIFICATIONS,
  );

  const { executor: updateNotificationItem } = useExecuteMutation(UPDATE_NOTIFICATION_ITEM);
  const [currentNotifications, setCurrentNotifications] = useState<NotificationType[]>();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const notifications = useMemo(() => {
    if (currentNotifications?.length === 0) {
      setIsProcessing(false);
      return [];
    }

    const items = (currentNotifications || []).map((x) => ({
      ...x,
      sortingId: moment(x.createdDateTime).toDate().getTime(),
      isToday: moment(x.createdDateTime).isSame(moment(), 'day'),
    }));

    const unread = items.filter((x) => !x.isRead);
    const hasUnread = unread.length > 0;
    if (!hasUnread && hasUnreadNotifications) {
      setHasUnreadNotifications(false);
    } else if (hasUnread && !hasUnreadNotifications) {
      setHasUnreadNotifications(true);
    }

    let todayNotifications = items.filter((x) => x.isToday);
    if (todayNotifications.length > 0) {
      todayNotifications = [
        {
          ...getBlankNotification({
            id: 'todayHeader',
            type: 'HEADER',
            summary: displayText[DisplayTextKeys.TODAY_TEXT],
            showClearButton: hasUnread,
          }),
        },
        ...todayNotifications,
      ];
    }

    let prevNotifications = items.filter((x) => !x.isToday);
    if (prevNotifications.length > 0) {
      prevNotifications = [
        {
          ...getBlankNotification({
            id: 'prevHeader',
            type: 'HEADER',
            summary: displayText[DisplayTextKeys.PREVIOUS_TEXT],
            showClearButton: todayNotifications.length === 0 && hasUnread,
          }),
        },
        ...prevNotifications,
      ];
    }
    setIsProcessing(false);
    return [...todayNotifications, ...prevNotifications];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNotifications]);

  const { isLoading, results: datasource, lastItemRef } = useInfiniteScroll(notifications);
  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading });

  const onUpdate = (itemId: string, markAsRead: boolean) => {
    let otherItems: NotificationType[];
    let unSortedItem: NotificationType[];
    let selectedItem: NotificationType | undefined;
    let idsToUpdate: string[] = [];
    if (itemId === '') {
      otherItems = (currentNotifications || []).filter((x) => x.isRead !== markAsRead);
      unSortedItem = (currentNotifications || []).filter((x) => x.isRead === markAsRead);
      unSortedItem = [...unSortedItem, ...(otherItems || []).map((x) => ({ ...x, isRead: markAsRead }))];
      idsToUpdate = unSortedItem.map((x) => x.id);
    } else {
      otherItems = (currentNotifications || []).filter((x) => x.id !== itemId);
      selectedItem = currentNotifications?.find((x) => x.id === itemId);
      unSortedItem = [...(otherItems || [])!, { ...selectedItem!, isRead: markAsRead }];
      idsToUpdate = [itemId];
    }
    updateNotificationItem({
      request: {
        ids: idsToUpdate,
        isRead: markAsRead,
      },
    });

    setCurrentNotifications(sortItems(unSortedItem, false, 'sortingId'));
  };

  useEffect(() => {
    if (!loadingNotifications && fetchNotificationsResult) {
      const notificationResponse = (fetchNotificationsResult as { userNotifications: NotificationResponse })
        .userNotifications;
      if (notificationResponse && notificationResponse.results?.length > 0) {
        const items = (notificationResponse.results as NotificationType[]).map((x) => ({
          ...x,
          sortingId: moment(x.createdDateTime).toDate().getTime(),
        }));
        setCurrentNotifications(sortItems(items, false, 'sortingId'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotificationsResult]);

  useEffect(() => {
    if (hasUnreadNotifications !== hasNotifications) {
      dispatch({
        type: AppEventTypes.UPDATE_STATE,
        payload: {
          hasNotifications: hasUnreadNotifications,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasUnreadNotifications]);

  useEffect(() => {
    setIsProcessing(true);
    fetchNotifications({
      from: 0,
      pageSize: 100000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SharedLayout
      view={NavigationPath.NOTIFICATIONS}
      title={displayText[DisplayTextKeys.TITLE]}
      onBack={() => null}
      showBackButton={false}
    >
      <div className="flex flex-col w-full h-full">
        {(loadingNotifications || isProcessing) && <Loading />}
        {datasource && datasource?.length > 0 && (
          <div className="flex-flex-col pb-5">
            <NotificationTemplate
              preformanceConfig={{
                fadeOnScrollClassName,
                isItemVisible,
                lastItemRef,
              }}
              hasUnreadNotifications={hasUnreadNotifications}
              className="pl-5"
              notifications={datasource || []}
              onUpdate={(itemId: string) => onUpdate(itemId, true)}
              buttonText={displayText[DisplayTextKeys.MARK_ALL_AS_READ_TEXT]}
              buttonClassname="text-gray-900"
            />
          </div>
        )}
      </div>
    </SharedLayout>
  );
};

export default Notifications;
