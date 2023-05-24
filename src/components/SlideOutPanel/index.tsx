import { FC, ReactNode } from 'react';
import { BackArrow, BackArrowWhite, Close, CloseBlackIcon } from '../../assets/icons';

interface SlideOutPanelProp {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isBackgroundDark?: boolean;
  closeButtonTemplate?: () => ReactNode;
  headClassName?: string;
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}
const SlideOutPanel: FC<SlideOutPanelProp> = ({
  children,
  isOpen,
  onClose,
  closeButtonTemplate,
  onBack,
  title = '',
  headClassName = '',
  isBackgroundDark = false,
  showBackButton = false,
}) => {
  return (
    <div className={`w-full h-full fixed inset-0  ${!isOpen ? 'invisible' : ''}`}>
      <div
        onClick={() => onClose()}
        className={`absolute inset-0 w-full h-full duration-500 ease-out transition-all  cursor-pointer bg-gray-900 opacity-${
          isOpen ? '50' : '0'
        } overflow-hidden`}
      ></div>
      <div
        className={` absolute top-0 right-0  flex flex-col duration-300 ease-out transition-all h-screen ${
          !isOpen ? 'translate-x-full' : ''
        } `}
      >
        <div className={`relative w-fit flex-1 flex flex-col overflow-hidden  ${headClassName || ''}`}>
          <div className="flex  w-full items-center p-5 ">
            <>
              {showBackButton && isBackgroundDark === false && (
                <BackArrow
                  className=" cursor-pointer text-14 z-10  top-4"
                  onClick={() => {
                    if (onBack) onBack();
                  }}
                />
              )}

              {showBackButton && isBackgroundDark === true && (
                <BackArrowWhite
                  className=" cursor-pointer text-14 z-10  top-4"
                  onClick={() => {
                    if (onBack) onBack();
                  }}
                />
              )}
              <span className={`text-base flex-1 text-center ${isBackgroundDark ? 'text-white' : 'text-black'} `}>
                {title}
              </span>
              {closeButtonTemplate ? (
                closeButtonTemplate
              ) : isBackgroundDark ? (
                <Close className="right-5 cursor-pointer text-14 z-10  top-4" onClick={onClose} />
              ) : (
                <CloseBlackIcon className="right-5 cursor-pointer text-14 z-10  top-4" onClick={onClose} />
              )}
            </>
          </div>
          <div className="relative w-fit text-left flex-1 flex flex-col h-100 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SlideOutPanel;
