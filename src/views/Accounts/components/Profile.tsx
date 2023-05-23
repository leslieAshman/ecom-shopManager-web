import React, { FC, useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChangeRequestIcon } from '../../../assets/icons';
import { DisplayField, DisplayFieldType, DisplaySection } from '../../../components/DisplayForms';
import DisplayForm from '../../../components/DisplayForms/DisplayForm';
import Loading from '../../../components/Loading/loading';
import { AppContext } from '../../../context/ContextProvider';
import { getFieldAttributes } from '../../../helpers';
import { UserProfile } from '../../../types/DomainTypes';
import { buildDisplayText } from '../../../utils';
import { useExecuteQuery } from '../../hooks/useExecuteQuery';
import { GET_USER_PROFILE } from '../graphql/getUserProfile';

enum DisplayTextKeys {
  PAGE_TITLE = 'page-title',
  BILLING_ADDRESS_TEXT = 'billing_address_text',
  CHANGE_REQUEST = 'change-request',
  FIRST_NAME = 'firstname',
  LAST_NAME = 'lastname',
  DOB = 'dob',
  EMAIL = 'email',

  COUNTRY = 'country',
  CITY = 'city',
  ADDRESS_1 = 'address_1',
  ADDRESS_2 = 'address_2',
  ADDRESS_3 = 'address_3',
  POSTCODE = 'postcode',
  STATE = 'state',
}

enum ModelKeys {
  FIRST_NAME = 'firstname',
  LAST_NAME = 'lastname',
  DOB = 'dob',
  EMAIL = 'email',

  ADDRESS_1 = 'address_1',
  ADDRESS_2 = 'address_2',
  ADDRESS_3 = 'address_3',
  POSTCODE = 'postcode',
  CITY = 'city',
  STATE = 'state',
  COUNTRY = 'country',
}
type ModelType = { [key: string]: string };

const buildUserProfileModel = (userProfile: UserProfile): ModelType => {
  const userProfileModelMapper = new Map<keyof UserProfile, ModelKeys>([
    ['firstName', ModelKeys.FIRST_NAME],
    ['lastName', ModelKeys.LAST_NAME],
    ['email', ModelKeys.EMAIL],
    ['dateOfBirth', ModelKeys.DOB],
    ['addressline1', ModelKeys.ADDRESS_1],
    ['addressline2', ModelKeys.ADDRESS_2],
    ['addressline3', ModelKeys.ADDRESS_3],
    ['city', ModelKeys.CITY],
    ['country', ModelKeys.COUNTRY],
    ['postCode', ModelKeys.POSTCODE],
    ['state', ModelKeys.STATE],
  ]);

  return Object.keys(userProfile).reduce((results, key) => {
    return {
      ...results,
      [userProfileModelMapper.get(key as keyof UserProfile) as keyof UserProfile]:
        userProfile[key as keyof UserProfile],
    };
  }, {});
};

const defaultModel: ModelType = {
  [ModelKeys.FIRST_NAME]: '',
  [ModelKeys.LAST_NAME]: '',
  [ModelKeys.DOB]: '',
  [ModelKeys.EMAIL]: '',
  [ModelKeys.COUNTRY]: '',
  [ModelKeys.CITY]: '',
  [ModelKeys.ADDRESS_1]: '',
  [ModelKeys.ADDRESS_2]: '',
  [ModelKeys.ADDRESS_3]: '',
  [ModelKeys.POSTCODE]: '',
  [ModelKeys.STATE]: '',
};

interface ProfileProps {
  onChangeRequest: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
const Profile: FC<ProfileProps> = ({ onChangeRequest }) => {
  const { t } = useTranslation();
  const {
    state: {
      settings: { email },
    },
  } = useContext(AppContext);
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:profile', t), [t]);
  // const [model] = useState<ModelType>(defaultModel);
  const {
    results: userProfile,
    loading,
    error: userProfileError,
  } = useExecuteQuery('getCustomer', GET_USER_PROFILE, {
    variables: {
      email,
    },
  });

  const model = useMemo(() => {
    return { ...defaultModel, ...(userProfileError ? {} : buildUserProfileModel(userProfile as UserProfile)) };
  }, [userProfile, userProfileError]);

  const containerRef = useRef<HTMLDivElement | null>();
  const containerClassName = 'w-full items-center flex sm:flex-row flex-col';

  const personalInfoSections: DisplaySection[] = useMemo(() => {
    const personalInfoFields: DisplayField[] = (['LAST_NAME', 'FIRST_NAME', 'DOB', 'EMAIL'] as const).map((field) => {
      return {
        ...getFieldAttributes(field, ModelKeys[`${field}` as const], displayText[DisplayTextKeys[`${field}` as const]]),
        disabled: true,
      };
    });
    const userInitials = `${model[ModelKeys.FIRST_NAME].charAt(0)}${model[ModelKeys.LAST_NAME].charAt(
      0,
    )}`.toUpperCase();

    return [
      {
        className: 'w-full items-center flex mt-5',
        fields: [
          {
            containerClassName: 'w-[50px] mr-5',
            id: 'initials',
            name: 'initials',
            type: DisplayFieldType.CUSTOM,
            customTemplate: () => {
              return (
                <div className="rounded-full flex items-center justify-center bg-orange w-[50px] h-[50px]">
                  {userInitials}
                </div>
              );
            },
          },
          ...personalInfoFields
            .filter((x) => ['LAST_NAME'].includes(x.id))
            .map((x) => ({ ...x, className: 'flex-1', containerClassName: 'mt-0' })),
        ],
      },
      {
        className: containerClassName,
        fields: personalInfoFields.filter((x) => ['FIRST_NAME', 'DOB'].includes(x.id)),
      },
      {
        className: containerClassName,
        fields: personalInfoFields.filter((x) => ['EMAIL'].includes(x.id)),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const addressSections: DisplaySection[] = useMemo(() => {
    const addressFields: DisplayField[] = (
      ['ADDRESS_1', 'ADDRESS_2', 'ADDRESS_3', 'CITY', 'STATE', 'COUNTRY', 'POSTCODE'] as const
    ).map((field) => {
      return {
        ...getFieldAttributes(field, ModelKeys[`${field}` as const], displayText[DisplayTextKeys[`${field}` as const]]),
        disabled: true,
      };
    });

    return [
      {
        className: ' w-full ',
        fields: addressFields.filter((x) => x.id.startsWith('ADDRESS')),
      },
      {
        className: ' w-full   flex sm:flex-row  flex-col',
        fields: addressFields.filter((x) => ['CITY', 'STATE'].includes(x.id)),
      },
      {
        className: '  w-full  flex sm:flex-row  flex-col',
        fields: addressFields.filter((x) => ['COUNTRY', 'POSTCODE'].includes(x.id)),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col w-full h-full p-5 overflow-x-hidden" ref={(r) => (containerRef.current = r)}>
      <div className="flex items-center w-full">
        <div className="flex-1 text-base font-medium">{displayText[DisplayTextKeys.PAGE_TITLE]}</div>
        <div className=" flex  items-center pr-5 text-sm  cursor-pointer" onClick={onChangeRequest}>
          <ChangeRequestIcon className="mr-2" />
          <span className="underline">{displayText[DisplayTextKeys.CHANGE_REQUEST]}</span>
        </div>
      </div>

      {loading && (
        <div className="w-full h-full p-10 flex justify-center ">
          <Loading />
        </div>
      )}
      {!loading && (
        <>
          <DisplayForm sections={personalInfoSections} model={{ ...model, modelType: 'Personal' }} />
          <DisplayForm
            titleContainerClassName="mt-10"
            sectionsContainerClassName="pb-10"
            sections={addressSections}
            title={displayText[DisplayTextKeys.BILLING_ADDRESS_TEXT]}
            model={{ ...model, modelType: displayText[DisplayTextKeys.BILLING_ADDRESS_TEXT] }}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
