import moment from 'moment';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../components';
import { classNames } from '../../utils';
import { NotificationType } from './types';

const dateFormat = 'YYYY/MM/DD';
interface NotificationTemplateProp {
  notifications: NotificationType[];
  onUpdate: (notificationId: string, isRead: boolean) => void;
  buttonText: string;
  buttonClassname?: string;
  className?: string;
  hasUnreadNotifications?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preformanceConfig?: Record<string, any>;
}

const NotificationTemplate: FC<NotificationTemplateProp> = ({
  notifications,
  onUpdate,
  buttonText,
  buttonClassname = '',
  className = '',
  preformanceConfig,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classNames('flex flex-col divide-y divide-gray-200', className)}>
      {notifications &&
        notifications.length > 0 &&
        notifications.map((item, index) => {
          const { id, createdDateTime: dateTime, type, isRead, showClearButton } = item;
          const textClassName = isRead ? 'text-gray-500' : 'text-black';
          const body = t(`notifications:messageTypes.${type.toLowerCase()}.body` as const);
          const subject = t(`notifications:messageTypes.${type.toLowerCase()}.subject` as const);
          let lastElemRefOption = { ref: preformanceConfig?.isItemVisible };
          if (notifications.length === index + 1) {
            lastElemRefOption = { ref: preformanceConfig?.lastItemRef };
          }
          if (type === 'HEADER') {
            return (
              <div
                key={`header-${index}`}
                className=" bg-white px-5 pt-10 pb-5 flex items-center  text-md font-medium border-b border-t border-gray-200  "
              >
                <div className="flex-1 text-20"> {item.summary}</div>
                {showClearButton && (
                  <Button
                    className={`w-fit mt-0 btn-accent`}
                    onClick={() => onUpdate('', true)}
                    props={{
                      name: 'clearAll',
                    }}
                  >
                    {t('notifications:clear_all')}
                  </Button>
                )}
              </div>
            );
          }
          return (
            <div
              {...lastElemRefOption}
              className={`${preformanceConfig?.fadeOnScrollClassName} flex flex-col p-5`}
              key={`${id}-${index}`}
            >
              {!isRead && (
                <div className="flex w-full h-full items-center mb-3">
                  <span className={`${textClassName} flex-1 text-sm`}>{moment(dateTime).format(dateFormat)}</span>
                  <Button
                    isLink={true}
                    className={`w-fit mt-0 ${buttonClassname}`}
                    onClick={() => onUpdate(id, true)}
                    props={{
                      name: id,
                    }}
                  >
                    {buttonText}
                  </Button>
                </div>
              )}

              <div className="flex flex-col w-full h-full space-y-2">
                <span className={`${textClassName} w-full font-medium truncate whitespace-nowrap text-base`}>
                  {subject}
                </span>
                <p className={`text-14 ${textClassName}`}>{body}</p>
                <div className="flex w-full pt-5">
                  <span className={`${textClassName} text-sm`}>{moment(dateTime).fromNow()}</span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default NotificationTemplate;
