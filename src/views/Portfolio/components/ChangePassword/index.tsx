/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as yup from 'yup';
import { LoginModelProp } from '../../../Authentication/types';
import { useFormik } from 'formik';
import { DisplayField, DisplayFieldType } from '../../../../components/DisplayForms';
import { Button } from '../../../../components';
import { buildDisplayText, classNames, validateEmail } from '../../../../utils';
import { getFieldAttributes, passwordChangeValidationTests } from '../../../../helpers';
import { SuccessTickIcon } from '../../../../assets/icons';
import DisplayForm from '../../../../components/DisplayForms/DisplayForm';
import { logError } from '../../../../components/LogError';
import { AuthEventTypes, EmailValuationType } from '../../../../types/AuthType';
import { AppContext } from '../../../../context/ContextProvider';
import { useExecuteMutation } from '../../../hooks/useExecuteMutation';
import { useNavigate } from 'react-router-dom';
import { CHANGE_PASSWORD } from './grahql';
import { BaseResultType } from '__generated__/graphql';
import { GQLMessageKeys } from 'types/gqlMessageTypes';

enum DisplayTextKeys {
  TITLE = 'auth:changePassword.title',
  SUBTITLE = 'auth:changePassword.subTitle',
  OTP_TITLE = 'auth:otpForm.title',
  OTP_SUBTITLE = 'auth:otpForm.subTitle',
  REGISTER_LINK = 'registerLink',
  FORGOT_PASSWORD_LINK = 'forgotPasswordLink',
  FAILED_TO_LOGIN = 'failedToLogin',
  FIND_OUT_MORE = 'findOutMore',
  SHOW = 'show',
  HIDE = 'hide',
  CTA = 'callToAction',
  EMAIL_TEXT = 'email.title',
  PASSWORD_TEXT = 'password.title',
  CONFIRM_PASSWORD_TEXT = 'confirmPassword.title',

  PASSWORD_INSTRUCTIONS = 'password_instructions',
  PASSWORD_INVALID_TEXT = 'password.invalid',
  PASSWORD_REQUIRED_TEXT = 'password.required',

  EMAIL_INVALID_TEXT = 'email.invalid',
  EMAIL_REQUIRED_TEXT = 'email.required',
  SUBMIT_BUTTON_TEXT = 'auth:changePassword.submit_button_text',
  INVALID_REGISTRATION_TEXT = 'invalid_registration_text',
  ALREADY_REGISTERED_TEXT = 'already_registered_text',
  VERIFY_BUTTON_TEXT = 'verify_button_text',
  ENROLMENT_ERROR_TEXT = 'enrolment_error_text',
}

enum RegistrationModelProp {
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmpassword',
}

type Model = {
  [key in RegistrationModelProp]: string;
};

type FormValidationType = {
  [Key in keyof Model]: boolean;
};

const initialModel = {
  [`${RegistrationModelProp.PASSWORD}`]: '',
  [`${RegistrationModelProp.CONFIRM_PASSWORD}`]: '',
} as Model;

const validateRegistrationFormFunc = (value: string, modelKey: string) => {
  if (modelKey === RegistrationModelProp.EMAIL) {
    return validateEmail(value);
  }
  return false;
};

interface ChangePasswordFormProp {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}
const ChangePasswordForm: FC<ChangePasswordFormProp> = () => {
  const { t } = useTranslation();
  const [viewState, setViewState] = useState({
    lastCheckEmail: '',
    capturePassword: true,
    lastEmailCheckResult: EmailValuationType.IN_VALID,
  });

  const {
    state: {
      auth: { requiredActions },
      settings: { email },
    },
    dispatch,
  } = useContext(AppContext);

  const displayText = React.useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'auth:registrationForm', t),
    [],
  );

  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formValidation, setFormValidation] = useState<FormValidationType>({
    [RegistrationModelProp.PASSWORD]: false,
    [RegistrationModelProp.EMAIL]: false,
    [RegistrationModelProp.CONFIRM_PASSWORD]: false,
  });

  const [model, setModel] = useState<Model>({
    [RegistrationModelProp.PASSWORD]: '',
    [RegistrationModelProp.CONFIRM_PASSWORD]: '',
    [RegistrationModelProp.EMAIL]: '',
  });

  const {
    executor: onChangePassword,
    data: changePwdData,
    error: changePwdError,
  } = useExecuteMutation(CHANGE_PASSWORD);

  const onClear = (key: string) => {
    formik.setFieldValue(key, '');
    setFormValidation({ ...formValidation, [key]: false });
    updateModel(key, '');
  };

  const updateFormValidation = (value: string, modelKey: RegistrationModelProp) => {
    const validationResult = validateRegistrationFormFunc(value, modelKey);
    if (formValidation[modelKey] !== validationResult) {
      setFormValidation({ ...formValidation, [modelKey]: validationResult });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    e.preventDefault();
    formik.handleChange(e);
    updateFormValidation(e.target.value, field!.modelKey as RegistrationModelProp);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    formik.setFieldTouched(field!.name, true);
    updateFormValidation(e.target.value, field!.modelKey as RegistrationModelProp);
  };

  const mValidationSchema = yup.object({
    [RegistrationModelProp.PASSWORD]: yup
      .string()
      .test(
        LoginModelProp.PASSWORD,
        displayText[DisplayTextKeys.PASSWORD_INVALID_TEXT],
        (password) => (password || '').length === 0 || (password || '').length > 7,
      )
      .required(displayText[DisplayTextKeys.PASSWORD_REQUIRED_TEXT]),
  });

  const formik = useFormik<Model>({
    initialValues: initialModel,
    onSubmit: async (values) => {
      setIsProcessing(true);
      setError(null);
      const passwordInfo = {
        userCredentials: {
          password2: values.confirmpassword,
          password: values.password,
          email,
        },
      };
      onChangePassword({ ...passwordInfo }, { context: { serviceName: 'insecure' } });
    },
    validationSchema: mValidationSchema || model,
  });

  const updateModel = (key: string, value: unknown) => {
    setModel({ ...model, [key]: value });
  };
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    handleChange(e, field);
    updateModel(field?.modelKey || '', e.target.value);
  };

  const signUpform = useMemo(() => {
    const passwordFields: DisplayField[] = (['PASSWORD', 'CONFIRM_PASSWORD'] as const).map((field) => {
      const pwdHasError = formik.touched[RegistrationModelProp[field]] && formik.errors[RegistrationModelProp[field]];
      const pwdAttrs = getFieldAttributes(
        RegistrationModelProp[`${field}` as const],
        RegistrationModelProp[`${field}` as const],
        displayText[DisplayTextKeys[`${field}_TEXT` as const]],
      );
      return {
        ...pwdAttrs,
        disabled: isProcessing || !viewState.capturePassword,
        className: 'border-gray-500',
        type: DisplayFieldType.PASSWORD,
        // placeholder: t('auth:password.required'),
        inputProps: {
          showClearButton: true,
          inputClassName: 'bg-transparent',
          inputContainerClassName: '!border-gray-300',
        },
        helperText: pwdHasError ? formik.errors[RegistrationModelProp[`${field}`]] : '',
        onChange: onFieldUpdate,
        onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, fieldIn?: DisplayField) => {
          handleBlur(e, fieldIn);
        },
        onClear: (dField?: DisplayField) => {
          if (dField) onClear(dField.id);
        },
        label: {
          ...pwdAttrs.label,
          className: classNames(`${pwdAttrs.label}`, `${pwdHasError ? 'text-red' : ''}`),
        },
      };
    });

    const validations: Record<
      string,
      {
        isValid: boolean;
        text: string;
      }
    > = {
      ...passwordChangeValidationTests(
        model[RegistrationModelProp.PASSWORD],
        t,
        `account:settings.${DisplayTextKeys.PASSWORD_INSTRUCTIONS}` as const,
      ),
      sameTest: {
        isValid:
          model[RegistrationModelProp.PASSWORD].length > 0 &&
          model[RegistrationModelProp.PASSWORD] === model[RegistrationModelProp.CONFIRM_PASSWORD],
        text: t(`account:settings.sameTest`),
      },
    };

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

    const isFormValid =
      !Object.keys(validations)
        .map((key) => validations[key].isValid)
        .includes(false) && viewState.capturePassword;

    const visibleFields: DisplayField[] = [...passwordFields, passwordContraints];

    return {
      isValid: isFormValid,
      sections: [
        {
          className: 'w-full  gap-5',
          fields: visibleFields,
        },
      ],
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, formik]);

  useEffect(() => {
    if (changePwdData) {
      const { isSuccess, message } = (changePwdData as { changePassword: BaseResultType }).changePassword;
      if (isSuccess) {
        dispatch({
          type: AuthEventTypes.LOGIN,
          payload: {
            isLogin: true,
            requiredActions: requiredActions?.filter((x) => x !== GQLMessageKeys.PASSWORD_CHANGE_REQUIRED),
          },
        });
      } else {
        setError(new Error((message || t('common:somethingWentWrong.subTitle')) as string));
      }
    }
  }, [changePwdData]);

  if (changePwdError) {
    logError(changePwdError);
    setError(new Error(t('common:somethingWentWrong.subTitle')));
  }

  console.log(formik.values);

  return (
    <div className="w-full sm:w-[70%] max-w-[420px] py-5">
      <h5 className="text-md text-center mb-1">{displayText[DisplayTextKeys.TITLE]} </h5>
      <h5 className="text-14 text-center">{displayText[DisplayTextKeys.SUBTITLE]} </h5>
      <DisplayForm
        titleContainerClassName="mt-3"
        sectionsContainerClassName="pb-10"
        sections={signUpform.sections}
        title=""
        model={{ ...model, modelType: 'registration' }}
      />
      {error && <h5 className="text-red text-12">{error.message}</h5>}

      <Button
        onClick={formik.handleSubmit}
        isDisable={!signUpform.isValid}
        className={`w-full mt-10 mb-3 ${!signUpform.isValid ? 'btn-disabled' : 'btn-primary'}`}
        isProcessing={isProcessing}
        props={{
          name: 'update_password_button',
        }}
      >
        {displayText[DisplayTextKeys.SUBMIT_BUTTON_TEXT]}
      </Button>
    </div>
  );
};

export default ChangePasswordForm;
