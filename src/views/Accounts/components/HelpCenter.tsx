import { FC } from 'react';
import { ContactUsIcon, FAQIcon } from '../../../assets/icons';

const knowledgeBaseUrl = 'https://knowledge.cultwines.com/cult-wine-investment';
interface HelpCenterProps {
  onChangeRequest: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
const HelpCenter: FC<HelpCenterProps> = ({ onChangeRequest }) => {
  return (
    <div className="flex flex-wrap w-full h-full p-5 gap-5   justify-center">
      {[
        {
          title: 'Contact Us',
          icon: <ContactUsIcon />,
          className: 'bg-vine text-white',
          description: 'Click here to contact us a speak to a member of our team ',
          onClick: onChangeRequest,
        },
        {
          title: 'FAQ',
          icon: <FAQIcon />,
          className: 'bg-orange text-white',
          description: 'Click here to see our frequently asked questions',
          onClick: () => window.open(knowledgeBaseUrl, '_blank'),
        },
      ].map((item, index) => {
        const { className, icon, title, description } = item;
        return (
          <div
            onClick={item.onClick}
            key={`help-${index}`}
            className={`flex flex-col p-5  cursor-pointer w-full sm:w-[300px] h-[400px] text-center items-center gap-5 rounded-md ${className}`}
          >
            <span>{title}</span>
            <div>{icon}</div>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HelpCenter;
