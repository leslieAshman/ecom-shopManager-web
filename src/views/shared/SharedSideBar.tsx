import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Close, CultwineLogo, CultWineSidebarMenuLogo } from '../../assets/icons';

import { Button } from '../../components';
import { NavigationPath } from '../../types/DomainTypes';
import { buildDisplayText } from '../../utils';
import AccSideMenu from '../Accounts/components/AccSideMenu';
import { AccountViewType, SubjectOptionKeys } from '../Accounts/types';
import { getSidebarIcons } from '../Portfolio/helpers';
import { SideBarProps } from './types';

const privacyPolicy = process.env.REACT_APP_PRIVACY_POLICY_URL || '';
const termsAndConditions = process.env.REACT_APP_TERMS_AND_CONDITION_URL || '';

const version = process.env.REACT_APP_VERSION;
enum SidebarOptions {
  TERMS_AND_CONDITIONS = 'termsAndConditions',
  PRIVACY_AND_POLICY = 'privacyAndPolicy',
}

const SideBar: FC<SideBarProps> = ({ onClick, isSmallScreen, onClose, value }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedView] = useState(AccountViewType.NONE);
  const displayText = useMemo(() => buildDisplayText(Object.values(SidebarOptions), 'portfolio:sideBarIcon', t), [t]);
  const sidebarIcons = useMemo(() => getSidebarIcons(t, navigate), [t, navigate]);

  return (
    <>
      {!isSmallScreen && (
        <div className=" w-[100px]  h-screen top-0 left-0 bg-vine hidden sm:flex flex-col pr-5 ">
          <div className="flex justify-center p-5">
            <CultwineLogo />
          </div>

          <div className="flex flex-col">
            {sidebarIcons.map((item, index) => {
              const title = item.title;
              const isSelected = item.value === value;
              return (
                <div
                  key={`icon-${index}`}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    else onClick(item);
                  }}
                  className={`flex flex-col cursor-pointer items-center mt-8 ${
                    isSelected ? 'border-orange border-l-[4px]' : ''
                  }`.trim()}
                >
                  {item.icon}
                  <span className="text-sm text-white mt-2">{title}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col flex-1 px-3  pb-8    justify-end items-center text-white">
            <Button
              isLink={true}
              onClick={() => window.open(termsAndConditions, '_blank')}
              className="flex-wrap mb-5 text-xs text-center"
            >
              {displayText[SidebarOptions.TERMS_AND_CONDITIONS]}
            </Button>
            <Button
              isLink={true}
              onClick={() => window.open(privacyPolicy, '_blank')}
              className="flex-wrap mb-5 text-xs text-center"
            >
              {displayText[SidebarOptions.PRIVACY_AND_POLICY]}
            </Button>
            <span className="flex-wrap mb-5 text-xs text-center">
              {t('portfolio:sideBarIcon.version', { version })}
            </span>
          </div>
        </div>
      )}

      {isSmallScreen && (
        <div className="sm:hidden absolute flex flex-col h-screen w-screen  z-10">
          <div className=" bg-vine">
            <div className="flex justify-center items-center py-10 ">
              <div
                className="p-5 cursor-pointer"
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                <Close />
              </div>
              <CultWineSidebarMenuLogo className="flex-1" />
            </div>
            <div className="flex flex-col">
              {sidebarIcons.map((item, index) => {
                const title = item.title;
                return (
                  <div
                    key={`icon-${index}`}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      else onClick(item);
                      if (onClose) onClose();
                    }}
                    className="flex cursor-pointer border-t border-gray-200 items-center"
                  >
                    <div className="p-5"> {item.icon}</div>
                    <span className="text-sm flex-1 text-white ">{title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 bg-gray-100">
            <AccSideMenu
              setSelectedView={(accountViewType: AccountViewType, subject?: SubjectOptionKeys) => {
                navigate(`${NavigationPath.ACCOUNTS}`, { state: { accountViewType, subject } });
                if (onClose) onClose();
              }}
              selectedView={selectedView}
              containerClassName={'flex!  w-full!'}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
