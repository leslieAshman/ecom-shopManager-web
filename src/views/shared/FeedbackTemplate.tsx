import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorIcon, WarningIcon } from '../../assets/icons';
import Loading from '../../components/Loading/loading';
import MessageTemplate, {
  MessageProductTemplateProp,
} from '../../components/ProductTemplates/components/MessageTemplate';
import { ViewStateType } from '../../components/ProductTemplates/types';
import noConnectionImage from '../../assets/images/noConnectionImage.png';
import thankYouImage from '../../assets/images/thank_you_image.png';
import paymentSuccessImage from '../../assets/images/payment_success.png';
import SuccessImage from '../../assets/images/success.png';

export type MessageType = Pick<
  MessageProductTemplateProp,
  'title' | 'subTitle' | 'onClick' | 'buttonText' | 'content' | 'footer'
>;
enum DisplayTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
  BUTTON_TEXT = 'buttonText',
}

interface FeedbackTemplateProps {
  onClose?: () => void;
  templateConfig?: MessageType;
  children?: ReactNode;
  viewState: ViewStateType;
  onCTA?: (viewState: ViewStateType) => void;
}

const FeedbackTemplate: FC<FeedbackTemplateProps> = ({ onClose, templateConfig, children, viewState, onCTA }) => {
  const { t } = useTranslation();

  return (
    <>
      {viewState === ViewStateType.THANK_YOU && (
        <MessageTemplate
          displayTextKeys={DisplayTextKeys}
          onClick={() => {
            if (onClose) onClose();
          }}
          translationKey="common:thankYou"
          imageSrc={thankYouImage}
        />
      )}

      {viewState === ViewStateType.SOMETHING_WENT_WRONG && (
        <MessageTemplate
          onClick={() => {
            if (onCTA) onCTA(ViewStateType.DEFAULT);
          }}
          displayTextKeys={DisplayTextKeys}
          translationKey="common:somethingWentWrong"
          imageSrc={noConnectionImage}
          title={() => (
            <div className="flex items-center gap-3">
              <WarningIcon />
              <span className="text-20 font-medium ">{t('common:somethingWentWrong.title')}</span>
            </div>
          )}
        />
      )}
      {viewState === ViewStateType.ERROR_RESULT && (
        <MessageTemplate
          onClick={() => {
            if (onCTA) onCTA(ViewStateType.DEFAULT);
          }}
          displayTextKeys={DisplayTextKeys}
          translationKey="common:errorResult"
          title={() => (
            <div className="flex flex-col">
              <ErrorIcon className="" />
              <span className="text-20 font-medium mt-5 ">{t('common:errorResult.title')}</span>
            </div>
          )}
          subTitle={() => <div className="text-14 mt-2">{t('common:errorResult.subTitle')}</div>}
          {...templateConfig}
        />
      )}
      {viewState === ViewStateType.SUCCESS && (
        <MessageTemplate
          onClick={() => {
            if (onClose) onClose();
          }}
          displayTextKeys={DisplayTextKeys}
          translationKey="common:generalSuccess"
          imageSrc={SuccessImage}
          {...(templateConfig || {})}
        />
      )}

      {viewState === ViewStateType.PAYMENT_SUCCESS && (
        <MessageTemplate
          onClick={() => {
            if (onCTA) onCTA(ViewStateType.DEFAULT);
          }}
          displayTextKeys={DisplayTextKeys}
          translationKey="common:paymentSuccess"
          imageSrc={paymentSuccessImage}
          {...(templateConfig || {})}
        />
      )}

      {viewState === ViewStateType.CUSTOM && <MessageTemplate displayTextKeys={DisplayTextKeys} {...templateConfig} />}

      {viewState === ViewStateType.MESSAGE && (
        <MessageTemplate
          displayTextKeys={DisplayTextKeys}
          translationKey="common:somethingWentWrong"
          imageSrc={noConnectionImage}
          {...templateConfig}
        />
      )}

      {viewState === ViewStateType.LOADING && (
        <MessageTemplate
          displayTextKeys={DisplayTextKeys}
          translationKey="common:loading"
          showButton={false}
          imageSrc={noConnectionImage}
          title={() => (
            <div className="flex items-center gap-3">
              <Loading />
              <span className="text-20 font-medium ">{t('common:loading.title')}</span>
            </div>
          )}
        />
      )}

      {viewState === ViewStateType.DEFAULT && (children || null)}
    </>
  );
};

export default FeedbackTemplate;
