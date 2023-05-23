import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountOverviewIcon, ChevronRight, HelpCenterIcon, ProfileIcon, SettingsIcon } from '../../../assets/icons';
import { AccountViewType, SubjectOptionKeys } from '../types';
import { classNames } from 'utils';

const accountMenuOptions = [
  {
    id: AccountViewType.OVERVIEW,
    titleKey: 'overview',
    icon: () => <AccountOverviewIcon />,
  },
  {
    id: AccountViewType.PROFILE,
    titleKey: 'profile',
    icon: () => <ProfileIcon />,
  },
  // {
  //   id: AccountViewType.PAYMENTS,
  //   title: 'Payments',
  //   icon: () => <PaymnetIcon />,
  // },
  {
    id: AccountViewType.SETTINGS,
    titleKey: 'settings',
    icon: () => <SettingsIcon />,
  },
  {
    id: AccountViewType.HELP_CENTER,
    titleKey: 'help-center',
    icon: () => <HelpCenterIcon />,
  },
];

export enum DisplayTextKeys {
  CONTACT_RM = 'contact_rm',
}

interface AccSideMenuProps {
  selectedView: AccountViewType;
  setSelectedView: (id: AccountViewType, subject?: SubjectOptionKeys) => void;
  containerClassName?: string;
}

const AccSideMenu: FC<AccSideMenuProps> = ({ setSelectedView, selectedView, containerClassName }) => {
  const { t } = useTranslation();
  // const { results: rmDetails, loading: loadingRmDetails } = useExecuteQuery('getCustomerRM', GET_RM_DETAILS);
  // const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:sideMenu', t), [t]);
  const cClassname = containerClassName && containerClassName.length > 0 ? containerClassName : `hidden sm:flex w-fit`;
  const accountsMenu = useMemo(() => {
    return accountMenuOptions.map((x) => ({ ...x, title: t(`account:titles.${x.titleKey}`) }));
  }, [t]);
  // const rmInfo = useMemo(() => {
  //   if (loadingRmDetails) return null;
  //   const rm = rmDetails as RMDetails;
  //   return { title: '', name: rm.name, photoUrl: rm.photo };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [rmDetails]);
  return (
    <div className={`flex-col items-center h-full min-w-[263px] ${cClassname}`}>
      <div className="flex-1 w-full">
        {accountsMenu.map((menuItem) => (
          <div
            key={`${menuItem.id}`}
            onClick={() => setSelectedView(menuItem.id)}
            className={classNames(
              'cursor-pointer flex items-center px-3  py-5 text-gray-700 ',
              'hover:bg-gray-100 hover:text-gray-900',
              `block px-4 py-2 text-sm ${selectedView === menuItem.id ? 'bg-gray-300 text-gray-900' : ''}`.trim(),
            )}
          >
            {menuItem.icon()}
            <div className="text-base flex-1 ml-3">{menuItem.title}</div>
            <ChevronRight />
          </div>
        ))}
      </div>
      {/* Commentting this for now, awaiting business decision */}
      {/* <div className="flex bg-gray-100 w-[263px] p-1 rounded-lg items-center m-2 mt-5 border border-gray-300">
        {loadingRmDetails && (
          <div className="flex w-full h-full justify-center items-center">
            <Loading />
          </div>
        )}
        {!loadingRmDetails && (
          <>
            <img className="w-[97px] h-[104px] object-cover rounded-lg rounded-r-none" src={rmInfo?.photoUrl} alt="" />
            <div className="flex flex-1 flex-col items-center justify-center  ">
              <span className="text-base">{rmInfo?.name}</span>
              <span className="text-xs">{rmInfo?.title}</span>
              <Button
                className={`btn text-14 mt-3 font-normal rounded-lg border border-black  text-black`}
                onClick={() => setSelectedView(AccountViewType.CONTACT_US, SubjectOptionKeys.RELATION_MGR)}
                props={{
                  name: 'viewPortfolio',
                }}
              >
                {displayText[DisplayTextKeys.CONTACT_RM]}
              </Button>
            </div>
          </>
        )}
      </div> */}
    </div>
  );
};

export default AccSideMenu;
