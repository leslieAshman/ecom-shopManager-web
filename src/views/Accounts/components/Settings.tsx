import React, { FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GET_MISCELLANEOUS } from '../../../App/graphql/getMiscellaneous';
import {
  LanguageIconCanada,
  LanguageIconChina,
  LanguageIconGB,
  LanguageIconHongKong,
  LanguageIconJapan,
  LanguageIconSingapore,
  LanguageIconUSA,
  SuccessTickIcon,
} from '../../../assets/icons';
import { Button, Dropdown } from '../../../components';
import { DisplayField, DisplayFieldType, DisplaySection } from '../../../components/DisplayForms';
import DisplayForm from '../../../components/DisplayForms/DisplayForm';
import { DropdownItem } from '../../../components/Dropdown';
import { logError } from '../../../components/LogError';
import { ViewStateType } from '../../../components/ProductTemplates/types';
import { AppContext } from '../../../context/ContextProvider';
import { getFieldAttributes, passwordChangeValidationTests } from '../../../helpers';
import { AppEventTypes, MiscellaneousType, SettingsEventTypes, UserSettings } from '../../../types/AppType';
import { NavigationPath, RefreshRegion } from '../../../types/DomainTypes';
import { buildDisplayText, capitalizeFirstLetter, sortItems, toInternalId } from '../../../utils';
import { useExecuteMutation } from '../../hooks/useExecuteMutation';
import { useExecuteQuery } from '../../hooks/useExecuteQuery';
import FeedbackTemplate from '../../shared/FeedbackTemplate';
import { CHANGE_PASSWORD_MUTATION } from '../graphql/changePasswodMutation';
import { UPDATE_USER_PREFERENCES } from '../graphql/updateUserPreferences';
import { AccountViewType, OpenSlideoutFnType, SlideOutPanelViews } from '../types';

const ddlConfig = {
  itemsWrapperClassName: 'min-w-[300px] overflow-x-hidden',
  itemWrapperStyle: { width: '100%' },
  containerClassName: 'w-full flex-1',
  itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
  itemClassName: 'text-base flex flex-1',
  className: 'flex-1 text-sm sm:text-14 text-black  whitespace-nowrap p-0 justify-start border-b border-b-gray-400',
};

type MiscItem = Pick<DropdownItem, 'id' | 'value' | 'text'> & { symbol?: string };
const feedbackViewContainerClassname =
  'flex flex-col flex-1 bg-gradient-to-b  from-gray-100 to-gray-500  pb-5 px-3 w-screen relative overflow-x-hidden sm:w-[390px]';
const languageIconMap = new Map<string, ReactNode>([
  ['en-GB', <LanguageIconGB />],
  ['zh-CN', <LanguageIconChina />],
  ['en-CA', <LanguageIconCanada />],
  ['en-HK', <LanguageIconHongKong />],
  ['en-US', <LanguageIconUSA />],
  ['ja-JP', <LanguageIconJapan />],
  ['en-SG', <LanguageIconSingapore />],
]);

const getCurrencyDropDownOptions = (source: MiscItem[]): DropdownItem[] => {
  return sortItems([...(source || [])], true, 'text').map((option) => {
    const { id, text, value, symbol } = option;
    const displayText = capitalizeFirstLetter(text!);
    return {
      id: toInternalId(id),
      value: value || id,
      text: displayText,
      content: (
        <div className="flex text-14 space-x-3">
          <span>{symbol}</span>
          <span>{displayText}</span>
        </div>
      ),
    };
  });
};

const getLanguageDropDownOptions = (source: MiscItem[]): DropdownItem[] => {
  return sortItems([...(source || [])], true, 'text').map((option) => {
    const { id, text, value, symbol } = option;
    return {
      id: toInternalId(id),
      value: value || id,
      text: `${text} (${symbol})`,
      content: (
        <div className="flex text-14 items-center justify-between w-full">
          <div className="flex items-center">
            <span>{languageIconMap.get(id)}</span>
            <span>{text}</span>
          </div>

          <span>{symbol}</span>
        </div>
      ),
    };
  });
};

enum DisplayTextKeys {
  LANGUAGE_TEXT = 'language_text',
  CURRENCY_TEXT = 'currency_text',
  EMAIL_TEXT = 'email-text',
  CHANGE_PASSWORD_TEXT = 'change_password_text',
  EDIT_TEXT = 'edit_text',
  CANCEL_TEXT = 'cancel_text',
  SAVE_TEXT = 'save_text',
  EMAIL_AUTHENTICATION_TEXT = 'email_authentication_text',
  TITLE_TEXT = 'preferences_text',
  SAME_AS_LOGIN_TEXT = 'same_as_login',
  CHANGE_PASSWORD = 'change_password',

  CURRENT_PASSWORD_TEXT = 'current_password_text',
  NEW_PASSWORD_TEXT = 'new_password_text',
  CONFIRM_NEW_PASSWORD_TEXT = 'confirm_new-password_text',

  PASSWORD_INSTRUCTIONS = 'password_instructions',

  PASSWORD_CHANGED_SUCCESS_TEXT = 'password_changed_success_text',
  PASSWORD_CHANGED_ERROR_TEXT = 'password_changed_error_text',
}

enum ModelKeys {
  LANGUAGE = 'language',
  CURRENCY = 'currency',
  EMAIL = 'email',
  SAME_AS_LOGIN = 'sameAsLogin',

  CURRENT_PASSWORD = 'currentPassword',
  NEW_PASSWORD = 'newPassword',
  CONFIRM_NEW_PASSWORD = 'confirmNewPassword',
}
interface UserPreference {
  portalUpdatePreferences: UserSettings;
}

interface ModelType {
  [ModelKeys.LANGUAGE]: string;
  [ModelKeys.CURRENCY]: string;
  [ModelKeys.EMAIL]: string;
  [ModelKeys.SAME_AS_LOGIN]: boolean;
  [ModelKeys.CURRENT_PASSWORD]: string;
  [ModelKeys.NEW_PASSWORD]: string;
  [ModelKeys.CONFIRM_NEW_PASSWORD]: string;
}

const defaultModel: ModelType = {
  [ModelKeys.LANGUAGE]: '',
  [ModelKeys.CURRENCY]: '',
  [ModelKeys.EMAIL]: '',
  [ModelKeys.SAME_AS_LOGIN]: false,
  [ModelKeys.CURRENT_PASSWORD]: '',
  [ModelKeys.NEW_PASSWORD]: '',
  [ModelKeys.CONFIRM_NEW_PASSWORD]: '',
};

interface SettingProps {
  openSlideout: OpenSlideoutFnType;
  onClose: (nextView?: AccountViewType) => void;
}
const Settings: FC<SettingProps> = ({ openSlideout, onClose }) => {
  const { t } = useTranslation();

  const {
    state: {
      settings: { email, currency, language },
    },
    dispatch,
    onLanguageChange,
  } = useContext(AppContext);

  const { results: misc } = useExecuteQuery('miscellaneous', GET_MISCELLANEOUS);
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:settings', t), [t]);

  const languageOptions = useMemo(
    () => getLanguageDropDownOptions((misc as MiscellaneousType).languages as MiscItem[]),
    [misc],
  );
  const currencyOptions = useMemo(
    () => getCurrencyDropDownOptions((misc as MiscellaneousType).currencies as MiscItem[]),
    [misc],
  );
  const containerRef = useRef<HTMLDivElement | null>();
  const [processingPwdChange, setProcessingPasswordChange] = useState(false);
  const {
    executor: savePreference,
    error: preferenceError,
    loading: savingPreferences,
    data: userPreferences,
  } = useExecuteMutation(UPDATE_USER_PREFERENCES);
  const [model, setModel] = useState<ModelType>({
    ...defaultModel,
    [ModelKeys.EMAIL]: email,
    [ModelKeys.CURRENCY]: currency,
    [ModelKeys.LANGUAGE]: language,
  });
  const {
    executor: passwordProcessor,
    error: passwordUpdateError,
    loading: loadingPasswordUpdates,
    data: pwdData,
  } = useExecuteMutation(CHANGE_PASSWORD_MUTATION);

  const closeOnSuccess = () => {
    dispatch({
      type: AppEventTypes.UPDATE_STATE,
      payload: {
        refresh: [RefreshRegion.HEADER, NavigationPath.PORTFOLIO, NavigationPath.MY_CELLAR, NavigationPath.INVEST],
      },
    });
    onClose();
  };

  const successView = useMemo(() => {
    return (
      <div className={feedbackViewContainerClassname}>
        <div className="w-full h-full rounded-md  overflow-y-auto flex flex-col">
          <FeedbackTemplate
            onClose={closeOnSuccess}
            templateConfig={{}}
            viewState={ViewStateType.SUCCESS}
            onCTA={closeOnSuccess}
          ></FeedbackTemplate>
        </div>
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ErrorView = useMemo(() => {
    return (
      <div className={feedbackViewContainerClassname}>
        <div className="w-full h-full rounded-md  overflow-y-auto flex flex-col">
          <FeedbackTemplate
            onClose={onClose}
            templateConfig={{}}
            viewState={ViewStateType.ERROR_RESULT}
            onCTA={() => onClose()}
          ></FeedbackTemplate>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangePassword = () => {
    const {
      [ModelKeys.NEW_PASSWORD]: passwordNew,
      [ModelKeys.CURRENT_PASSWORD]: passwordCurrent,
      [ModelKeys.CONFIRM_NEW_PASSWORD]: passwordConfirm,
    } = model;
    setProcessingPasswordChange(true);
    passwordProcessor({
      changePasswordInput: {
        clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
        passwordCurrent,
        passwordNew,
        passwordConfirm,
      },
    });
  };

  // const passwordChangeValidationTests = (value: string): Record<string, { isValid: boolean; text: string }> => {
  //   const keys = t(`account:settings.${DisplayTextKeys.PASSWORD_INSTRUCTIONS}`);
  //   const validations = keys.split(';').reduce((result, key) => {
  //     return {
  //       ...result,
  //       [key]: {
  //         isValid: validatePasswordChange(key as PasswordChangeValidationKeys, value),
  //         text: t(`account:settings.${key}`),
  //       },
  //     };
  //   }, {});

  //   return validations;
  // };

  const updateModel = (key: string, value: unknown) => {
    setModel({ ...model, [key]: value });
  };
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) =>
    updateModel(field?.modelKey || '', e.target.value);

  const onSavePrefences = () => {
    const { [ModelKeys.CURRENCY]: newCurrency, [ModelKeys.LANGUAGE]: newLanguage } = model;
    savePreference({
      request: {
        currency: newCurrency,
        language: newLanguage,
      },
    });
  };

  const sections: DisplaySection[] = useMemo(() => {
    const preferences: DisplayField[] = [
      {
        modelKey: ModelKeys.LANGUAGE,
        options: languageOptions,
      },
      {
        modelKey: ModelKeys.CURRENCY,
        options: currencyOptions,
      },
    ].map((preference) => ({
      ...getFieldAttributes(
        preference.modelKey,
        preference.modelKey,
        displayText[`${preference.modelKey}_TEXT`.toUpperCase()],
      ),
      type: DisplayFieldType.CUSTOM,
      customTemplate: () => {
        return (
          <div className="flex flex-col w-full">
            <span className="text-sm text-gray-700 mb-1 ">{displayText[`${preference.modelKey}_text`]}</span>
            <Dropdown
              placeholder="Select item"
              value={model[preference.modelKey] as string}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block">
                    {preference.options.find((x) => x.value === model[preference.modelKey])?.text}
                  </span>
                </div>
              }
              onItemSelect={(item: DropdownItem) => updateModel(preference.modelKey, item.value)}
              items={preference.options}
              {...ddlConfig}
            />
          </div>
        );
      },
    }));
    const isButtonDisabled =
      savingPreferences || (currency === model[ModelKeys.CURRENCY] && language === model[ModelKeys.LANGUAGE]);
    return [
      {
        className: 'w-full flex gap-5 ',
        fields: [...preferences],
        footer: () => (
          <div className="flex flex-col">
            <Button
              isProcessing={savingPreferences}
              isDisable={isButtonDisabled}
              className={` w-fit ${isButtonDisabled ? 'btn-disabled ' : 'btn-accent '} mt-5`}
              onClick={onSavePrefences}
              props={{
                name: displayText[DisplayTextKeys.SAVE_TEXT],
              }}
            >
              {displayText[DisplayTextKeys.SAVE_TEXT]}
            </Button>
          </div>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, savePreference]);

  const changePasswordSections: DisplaySection[] = useMemo(() => {
    if (passwordUpdateError) {
      if (processingPwdChange) setProcessingPasswordChange(false);
      logError(passwordUpdateError);
      openSlideout(SlideOutPanelViews.CUSTOM, { title: t`common:error`, customTemplate: () => ErrorView });
    }

    const changePasswordFields: DisplayField[] = (
      ['CURRENT_PASSWORD', 'NEW_PASSWORD', 'CONFIRM_NEW_PASSWORD'] as const
    ).map((field) => ({
      ...getFieldAttributes(
        field,
        ModelKeys[`${field}` as const],
        displayText[DisplayTextKeys[`${field}_TEXT` as const]],
      ),
      disabled: loadingPasswordUpdates,

      type: DisplayFieldType.PASSWORD,
      inputProps: { showClearButton: true },
      onChange: onFieldUpdate,
    }));

    let validations = passwordChangeValidationTests(
      model[ModelKeys.NEW_PASSWORD],
      t,
      `account:settings.${DisplayTextKeys.PASSWORD_INSTRUCTIONS}` as const,
    );

    validations = {
      ...validations,
      sameTest: {
        isValid:
          model[ModelKeys.NEW_PASSWORD].length > 0 &&
          model[ModelKeys.NEW_PASSWORD] === model[ModelKeys.CONFIRM_NEW_PASSWORD],
        text: validations.sameTest.text,
      },
    };

    const contraintsTests = Object.keys(validations).map((x) => validations[x].isValid);
    const passwordContraints = {
      ...getFieldAttributes('passwordContraints', 'passwordContraints', ''),
      type: DisplayFieldType.CUSTOM,
      customTemplate: () => {
        return (
          <ul className="list-none">
            {Object.keys(validations).map((key, index) => {
              const test = validations[key];
              return (
                <li key={`pwd-info-${index}`} className="text-sm">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {test.isValid ? <SuccessTickIcon /> : <div className="w-1 h-1 bg-black rounded-full" />}
                    </div>
                    <span> {`${test.text}`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        );
      },
    };

    const canChange =
      !contraintsTests.includes(false) && !loadingPasswordUpdates && model[ModelKeys.CURRENT_PASSWORD].length > 7;

    return [
      {
        className: 'w-full  gap-5',
        fields: [...changePasswordFields, passwordContraints],
        footer: () => (
          <div className="flex flex-col">
            <Button
              isProcessing={loadingPasswordUpdates}
              isDisable={!canChange}
              className={`mt-5 w-fit ${!canChange ? 'btn-disabled ' : 'btn-accent'}`}
              onClick={onChangePassword}
              props={{
                name: displayText[DisplayTextKeys.CHANGE_PASSWORD_TEXT],
              }}
            >
              {displayText[DisplayTextKeys.CHANGE_PASSWORD_TEXT]}
            </Button>
          </div>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, loadingPasswordUpdates, passwordUpdateError]);

  useEffect(() => {
    if (processingPwdChange && !loadingPasswordUpdates) {
      if (
        pwdData &&
        (pwdData as { authChangePassword: { wasPasswordChanged: boolean } }).authChangePassword.wasPasswordChanged
      )
        openSlideout(SlideOutPanelViews.CUSTOM, { title: t`common:success`, customTemplate: () => successView });
      else {
        openSlideout(SlideOutPanelViews.CUSTOM, { title: t`common:error`, customTemplate: () => ErrorView });
      }

      setProcessingPasswordChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingPasswordUpdates]);

  useEffect(() => {
    if (!savingPreferences && !!userPreferences) {
      if (preferenceError)
        openSlideout(SlideOutPanelViews.CUSTOM, { title: t`common:error`, customTemplate: () => ErrorView });
      else {
        openSlideout(SlideOutPanelViews.CUSTOM, { title: t`common:success`, customTemplate: () => successView });
        const { currency: newCurrency, language: newLanguage } = (userPreferences as UserPreference)
          .portalUpdatePreferences as UserSettings;
        setModel({ ...model, [ModelKeys.CURRENCY]: newCurrency, [ModelKeys.LANGUAGE]: newLanguage });
        if (newCurrency !== currency)
          dispatch({
            type: SettingsEventTypes.UPDATE_SETTINGS,
            payload: { currency: newCurrency },
          });

        if (newLanguage !== language && onLanguageChange) onLanguageChange(newLanguage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreferences]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
  }, []);

  if (preferenceError) {
    logError(preferenceError);
  }

  return (
    <div className="flex flex-col p-5 w-full overflow-y-auto" ref={(r) => (containerRef.current = r)}>
      <DisplayForm
        sectionsContainerClassName="gap-5"
        titleContainerClassName=""
        title={displayText[DisplayTextKeys.TITLE_TEXT]}
        sections={sections}
        model={{ ...model, modelType: 'Settings' }}
      />

      <DisplayForm
        titleContainerClassName="mt-10"
        sectionsContainerClassName="pb-10"
        sections={changePasswordSections}
        title={displayText[DisplayTextKeys.CHANGE_PASSWORD]}
        model={{ ...model, modelType: displayText[DisplayTextKeys.CHANGE_PASSWORD] }}
      />
    </div>
  );
};

export default Settings;
