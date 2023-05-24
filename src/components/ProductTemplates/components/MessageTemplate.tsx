import { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildDisplayText } from '../../../utils';
import Button from '../../Button';

export interface DisplayTextKeys {
  TITLE: string;
  SUBTITLE: string;
  BUTTON_TEXT?: string;
}

export interface MessageProductTemplateProp {
  displayTextKeys: DisplayTextKeys;
  translationKey?: string;
  imageSrc?: string;
  title?: () => ReactNode;
  subTitle?: () => ReactNode;
  showButton?: boolean;
  onClick?: () => void;
  buttonText?: string;
  content?: () => ReactNode;
  footer?: () => ReactNode;
}

const MessageTemplate: FC<MessageProductTemplateProp> = ({
  displayTextKeys,
  translationKey,
  imageSrc,
  title,
  subTitle,
  onClick,
  buttonText,
  content,
  footer,
  showButton = true,
}) => {
  const { t } = useTranslation();
  const displayText = useMemo(
    () => buildDisplayText(Object.values(displayTextKeys), translationKey || '', t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, displayTextKeys],
  );
  return (
    <div className="h-full w-full rounded-md flex-1 flex flex-col items-center bg-white p-5  text-center">
      {imageSrc && <img className="w-[161.31px] h-[160px]" src={imageSrc} alt={displayText[displayTextKeys.TITLE]} />}
      {!title && <span className="text-20 font-medium ">{displayText[displayTextKeys.TITLE]}</span>}
      {title && title()}
      {!subTitle && <div className="text-14 mt-2">{displayText[displayTextKeys.SUBTITLE]}</div>}
      {subTitle && subTitle()}
      {content && content()}
      {!content && showButton && displayTextKeys.BUTTON_TEXT && (
        <Button
          className={`btn text-14 font-normal bg-orange rounded-full mt-8  text-black w-full`}
          onClick={onClick}
          props={{
            name: displayTextKeys.BUTTON_TEXT,
          }}
        >
          {buttonText ? buttonText : displayText[displayTextKeys.BUTTON_TEXT]}
        </Button>
      )}
      {footer && footer()}
    </div>
  );
};

export default MessageTemplate;
