import MessageTemplate from '../ProductTemplates/components/MessageTemplate';
import noConnectionImage from '../../assets/images/noConnectionImage.png';
import { SmallScreenLogoBlack } from '../../assets/icons';

enum DisplayTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
  BUTTON_TEXT = 'buttonText',
}

const templateConfig = {
  onClick: () => {
    window.location.reload();
  },
};

const FallbackError = () => {
  return (
    <div className="w-full h-screen overflow-hidden justify-center flex">
      <div className="w-[439px] flex flex-col items-center mt-[150px]">
        <div className="flex w-full  justify-center h-[91px] mb-[20px] items-center">
          <SmallScreenLogoBlack />
        </div>
        <MessageTemplate
          displayTextKeys={DisplayTextKeys}
          translationKey="common:somethingWentWrong"
          imageSrc={noConnectionImage}
          {...templateConfig}
        />
      </div>
    </div>
  );
};

export default FallbackError;
