/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../AuthLayout';
import * as yup from 'yup';
import { LoginModelProp, RegistrationResult, ValidateEmailResponse } from '../../types';
import { useFormik } from 'formik';
import { DisplayField, DisplayFieldType } from '../../../../components/DisplayForms';
import { Button } from '../../../../components';
import { buildDisplayText, classNames, validateEmail } from '../../../../utils';
import { getFieldAttributes, passwordChangeValidationTests } from '../../../../helpers';
import { BackArrow, SuccessTickIcon } from '../../../../assets/icons';
import DisplayForm from '../../../../components/DisplayForms/DisplayForm';

import { VALIDATE_EMAIL } from '../../graphql/validateEmail';
import { useLazyExecuteQuery } from '../../../hooks/useLazyExecuteQuery';
import { logError } from '../../../../components/LogError';
import { EmailValuationType } from '../../../../types/AuthType';
import { REGISTER_USER } from '../../graphql/registration';
import { AppContext } from '../../../../context/ContextProvider';
import { useExecuteMutation } from '../../../hooks/useExecuteMutation';
import { useNavigate } from 'react-router-dom';
import { NavigationPath } from '../../../../types/DomainTypes';
import MFAChallengeForm from 'views/Authentication/MFAChallengeForm';

enum DisplayTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
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
  SUBMIT_BUTTON_TEXT = 'submit_button_text',
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
  [`${RegistrationModelProp.EMAIL}`]: '',
  [`${RegistrationModelProp.PASSWORD}`]: '',
  [`${RegistrationModelProp.CONFIRM_PASSWORD}`]: '',
} as Model;

const validateRegistrationFormFunc = (value: string, modelKey: string) => {
  if (modelKey === RegistrationModelProp.EMAIL) {
    return validateEmail(value);
  }
  // if (modelKey === RegistrationModelProp.PASSWORD) {
  //   return value.length >= 8;
  // }
  return false;
};

const RegistrationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state: {
      app: { id: appId },
    },
  } = useContext(AppContext);
  const {
    executor: emailValidator,
    loading: emailValidatorValidating,
    error: emailValidatorError,
    data: emailValidatorResult,
  } = useLazyExecuteQuery(VALIDATE_EMAIL);

  const [isEmailValidationRequired, setIsEmailValidationRequired] = useState(false);
  const [viewState, setViewState] = useState({
    lastCheckEmail: '',
    capturePassword: false,
    isAccountVerified: true,
    lastEmailCheckResult: EmailValuationType.IN_VALID,
  });

  const displayText = React.useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'auth:registrationForm', t),
    [],
  );

  const [accountVerificationRequired, setAccountVerificationRequired] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [subTitle, setSubTitle] = useState(displayText.subTitle);
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
    executor: onRegisterUser,
    data: registrationResult,
    error: enrolmentError,
  } = useExecuteMutation(REGISTER_USER);

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
    [RegistrationModelProp.EMAIL]: yup
      .string()
      .email(t('auth:emailAddress.required'))
      .required(t('auth:emailAddress.required')),
  });

  const formik = useFormik<Model>({
    initialValues: initialModel,
    onSubmit: async (values) => {
      setIsProcessing(true);
      setError(null);
      const registration = {
        userCredentials: {
          password2: values.confirmpassword,
          password: values.password,
          email: values.email,
        },
      };
      onRegisterUser({ ...registration }, { context: { serviceName: 'insecure' } });
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

  const processEmailVerification = (result: string, isAccountVerified = true) => {
    switch (result.toLowerCase() as EmailValuationType) {
      case 'valid':
        setSubTitle('');
        setViewState({
          lastCheckEmail: model[RegistrationModelProp.EMAIL],
          capturePassword: true,
          isAccountVerified,
          lastEmailCheckResult: EmailValuationType.VALID,
        });

        break;
      case 'invalid':
        setViewState({
          lastCheckEmail: model[RegistrationModelProp.EMAIL],
          capturePassword: false,
          isAccountVerified,
          lastEmailCheckResult: EmailValuationType.IN_VALID,
        });
        setError(new Error(displayText[DisplayTextKeys.INVALID_REGISTRATION_TEXT]));
        break;

      case 'registered':
        if (!isAccountVerified) {
          setAccountVerificationRequired(true);
          setError(null);
        } else {
          setError(new Error(t('auth:registrationForm.already_registered_text')));
        }

        setSubTitle(displayText.subTitle);
        setViewState({
          isAccountVerified,
          lastCheckEmail: model[RegistrationModelProp.EMAIL],
          capturePassword: false,
          lastEmailCheckResult: EmailValuationType.REGISTERED,
        });

        break;

      default:
        break;
    }
  };
  const onBack = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (accountVerificationRequired) {
      setAccountVerificationRequired(false);
    } else {
      navigate(NavigationPath.LOGIN);
    }
  };

  const onBackToLogin = () => {
    navigate(NavigationPath.LOGIN);
  };

  const signUpform = useMemo(() => {
    const emailHasError = formik.touched[RegistrationModelProp.EMAIL] && formik.errors[RegistrationModelProp.EMAIL];
    const emailAttrs = getFieldAttributes(
      RegistrationModelProp.EMAIL,
      RegistrationModelProp.EMAIL,
      displayText[DisplayTextKeys.EMAIL_TEXT],
    );
    const emailField = {
      ...emailAttrs,
      disabled: emailValidatorValidating || isProcessing,
      isAutoFocus: model[RegistrationModelProp.EMAIL].length === 0,
      inputProps: {
        showClearButton: true,
        inputClassName: 'bg-transparent',
        inputContainerClassName: emailHasError ? '!border-red' : '!border-gray-300',
      },
      // placeholder: displayText[DisplayTextKeys.EMAIL_REQUIRED_TEXT],
      onChange: onFieldUpdate,
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
        handleBlur(e, field);
      },
      onClear: (dField?: DisplayField) => {
        if (dField) onClear(dField.id);
        setViewState({ ...viewState, capturePassword: false });
      },
      helperText: emailHasError ? formik.errors[RegistrationModelProp.EMAIL] : '',
      label: {
        ...emailAttrs.label,
        className: classNames(`${emailAttrs.label}`, `${emailHasError ? 'text-red' : ''}`),
      },
    };
    const passwordFields: DisplayField[] = (['PASSWORD', 'CONFIRM_PASSWORD'] as const).map((field) => {
      const pwdHasError = formik.touched[RegistrationModelProp[field]] && formik.errors[RegistrationModelProp[field]];
      const pwdAttrs = getFieldAttributes(
        RegistrationModelProp[`${field}` as const],
        RegistrationModelProp[`${field}` as const],
        displayText[DisplayTextKeys[`${field}_TEXT` as const]],
      );
      return {
        ...pwdAttrs,
        disabled: emailValidatorValidating || isProcessing || !viewState.capturePassword,
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
        .includes(false) &&
      !emailValidatorValidating &&
      formValidation[RegistrationModelProp.EMAIL] &&
      viewState.capturePassword;

    const verifyButtonField = {
      id: 'verify_Button',
      name: 'verify_Button',
      type: DisplayFieldType.CUSTOM,
      containerClassName: 'mt-5',
      customTemplate: () => {
        return (
          <Button
            onClick={() => {
              if (model[RegistrationModelProp.EMAIL] !== viewState.lastCheckEmail) {
                setIsEmailValidationRequired(true);
              } else if (!viewState.capturePassword) {
                processEmailVerification(viewState.lastEmailCheckResult, viewState.isAccountVerified);
              }
            }}
            className={`w-full mt-10 mb-3 ${!formValidation.email ? 'btn-disabled' : 'btn-primary'}`}
            isDisable={!formValidation.email}
            isProcessing={emailValidatorValidating}
            props={{
              name: displayText[DisplayTextKeys.VERIFY_BUTTON_TEXT],
            }}
          >
            {displayText[DisplayTextKeys.VERIFY_BUTTON_TEXT]}
          </Button>
        );
      },
    };

    let visibleFields: DisplayField[] = [emailField];
    if (!viewState.capturePassword) visibleFields = [...visibleFields, verifyButtonField];
    if (viewState.capturePassword) visibleFields = [...visibleFields, ...passwordFields, passwordContraints];

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
  }, [model, formik, emailValidatorValidating]);

  if (emailValidatorError) {
    logError(emailValidatorError);
  }

  useEffect(() => {
    if (formValidation.email && isEmailValidationRequired) {
      emailValidator(
        {
          email: model[RegistrationModelProp.EMAIL],
        },
        { context: { serviceName: 'insecure' }, fetchPolicy: 'no-cache' },
      );
      setIsEmailValidationRequired(false);
    }
    if (!formValidation.email) {
      setViewState({ ...viewState, capturePassword: false });
    }
  }, [formValidation.email, isEmailValidationRequired]);

  useEffect(() => {
    if (emailValidatorResult) {
      const resp = (emailValidatorResult as ValidateEmailResponse).validateEmail;
      processEmailVerification(resp.messageType, resp.message === 'true');
    }
  }, [emailValidatorResult]);

  useEffect(() => {
    if (registrationResult) {
      const enrolmentCard = registrationResult as RegistrationResult;
      if (enrolmentCard.registerUser && enrolmentCard.registerUser.isSuccess) {
        setAccountVerificationRequired(true);
      } else {
        setError(new Error(displayText[DisplayTextKeys.ENROLMENT_ERROR_TEXT]));
      }
    }
  }, [registrationResult]);

  if (enrolmentError) {
    logError(enrolmentError);
    setError(new Error(displayText[DisplayTextKeys.ENROLMENT_ERROR_TEXT]));
  }

  return (
    <AuthLayout
      title={
        <div id="title-container" className="flex items-center">
          <BackArrow className="mr-5 cursor-pointer" data-testid="back-arrow-button" onClick={(e) => onBack(e)} />
          <h5 className="text-lg text-center">
            {displayText[accountVerificationRequired ? DisplayTextKeys.OTP_TITLE : DisplayTextKeys.TITLE]}
          </h5>
        </div>
      }
      error={{ body: error?.message || '', onClose: () => setError(null) }}
      subTitle={accountVerificationRequired ? '' : subTitle}
    >
      <div className="w-full sm:w-[70%] max-w-[420px]">
        {!accountVerificationRequired && (
          <>
            <DisplayForm
              titleContainerClassName="mt-10"
              sectionsContainerClassName="pb-10"
              sections={signUpform.sections}
              title=""
              model={{ ...model, modelType: 'registration' }}
            />
            {viewState.capturePassword && (
              <Button
                onClick={() => formik.submitForm()}
                isDisable={!signUpform.isValid}
                className={`w-full mt-10 mb-3 ${!signUpform.isValid ? 'btn-disabled' : 'btn-primary'}`}
                isProcessing={isProcessing}
                props={{
                  name: 'register_button',
                }}
              >
                {displayText[DisplayTextKeys.SUBMIT_BUTTON_TEXT]}
              </Button>
            )}
          </>
        )}

        {accountVerificationRequired && (
          <MFAChallengeForm
            {...{
              mfaToken: '',
              mfaOOBCode: '',
              emailAddress: model[RegistrationModelProp.EMAIL],
              onBack: onBackToLogin,
              onError: (err: Error | null) => setError(err),
            }}
          />
        )}
      </div>
    </AuthLayout>
  );
};

export default RegistrationForm;
