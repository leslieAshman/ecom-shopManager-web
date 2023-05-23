/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../components/AuthLayout';
import { getLoginValidationSchema } from '../helpers';
import * as yup from 'yup';
import { LoginModelProp } from '../types';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthentication';
import { NavigationPath } from '../../../types/DomainTypes';

import { DisplayField, DisplayFieldType } from '../../../components/DisplayForms';
import { Button } from '../../../components';
import { buildDisplayText, classNames, validateEmail } from '../../../utils';
import { getFieldAttributes } from '../../../helpers';
import DisplayForm from '../../../components/DisplayForms/DisplayForm';
import { logError } from '../../../components/LogError';
import { updateUserToken } from 'services/auth';
import { AppContext } from 'context/ContextProvider';
import { AuthEventTypes } from 'types/AuthType';
import { isLoggedInVar } from 'graphql/cache';
import { LoginResult } from '__generated__/graphql';
import { SettingsEventTypes } from 'types/AppType';

enum DisplayTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
  REGISTER_LINK = 'registerLink',
  FORGOT_PASSWORD_LINK = 'forgotPasswordLink',
  FAILED_TO_LOGIN = 'failedToLogin',
  LOGIN = 'login',
  FIND_OUT_MORE = 'findOutMore',
  SHOW = 'show',
  HIDE = 'hide',
  CTA = 'callToAction',
  EMAIL_TEXT = 'email.title',
  PASSWORD_TEXT = 'password.title',
  SIGN_UP_LINK_TEXT = 'signUpLinkText',
  REGISTER_TEXT = 'registerLink',
}

type Model = {
  [key in LoginModelProp]: string;
};

type FormValidationType = {
  [Key in LoginModelProp]: boolean;
};
const initialModel = {
  [`${LoginModelProp.EMAIL}`]: '',
  [`${LoginModelProp.PASSWORD}`]: '',
} as Model;

const validateLoginFormFunc = (value: string, modelKey: string) => {
  if (modelKey === LoginModelProp.EMAIL) {
    return validateEmail(value);
  }
  if (modelKey === LoginModelProp.PASSWORD) {
    return value.length >= 8;
  }
  return false;
};

interface LoginFormProps {
  emailAddress?: string;
}

const LoginForm: FC<LoginFormProps> = ({ emailAddress }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [isForceValid, setIsForceValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formValidation, setFormValidation] = useState<FormValidationType>({
    [LoginModelProp.PASSWORD]: false,
    [LoginModelProp.EMAIL]: false,
  });
  // const { results, data } = useExecuteQuery('getUser', GET_USERS, {
  //   variables: { email: 'Loser@623.com' },
  //   context: { serviceName: 'insecure' },
  // });
  // console.log('RESULTS', results, data);

  // const { results, data } = useExecuteQuery('login', LoginAuth, {
  //   variables: {
  //     loginUserDetails: {
  //       email: 'Loser@623.com',
  //       password: 'Te$ting123',
  //       clientId: process.env.REACT_APP_CLIENT_ID ?? '',
  //       shopRef: '',
  //       isStaff: false,
  //       pushToken: '',
  //     },
  //   },
  //   context: { serviceName: 'insecure' },
  //   // Catches network errors and returns them in errors in response
  //   onError: () => null,
  // });
  // console.log('RESULTS', results, data);

  const displayText = React.useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'auth:loginForm', t), []);
  const [model, setModel] = useState<Model>({
    ...initialModel,
  });

  const errorHandler = (message: string) => {
    throw new Error(message);
  };

  const onSuccessLogin = (loginResult: LoginResult) => {
    updateUserToken(loginResult.userToken ?? '');
    isLoggedInVar(true);
    dispatch({
      type: AuthEventTypes.LOGIN,
      payload: {
        isLogin: true,
        requiredActions: [loginResult.messageType as string],
      },
    });

    dispatch({
      type: SettingsEventTypes.UPDATE_SETTINGS,
      payload: {
        email: loginResult.result?.email,
      },
    });
    navigate(NavigationPath.PORTFOLIO);

    // onSuccess: ({ portalAuthMfaVerify: { accessToken, refreshToken, userToken } }) => {
    //   dispatch({
    //     type: AuthEventTypes.LOGIN,
    //     payload: {
    //       isLogin: true,
    //     },
    //   });
    //   setIsLoggingIn(false);
    //   updateAccessToken(accessToken);
    //   updateRefreshToken(refreshToken);
    //   updateUserToken(userToken);
    //   navigate(NavigationPath.PORTFOLIO);
    // },
  };

  const { onLogin } = useAuth({
    errorHandler,
    onError: (e: Error) => {
      setIsLoggingIn(false);
      setError(e);
      logError(e);
    },
    onSuccess: onSuccessLogin,
  });
  const onClear = (key: string) => {
    if (isForceValid) setIsForceValid(false);
    formik.setFieldValue(key, '');
    setFormValidation({ ...formValidation, [key]: false });
  };

  const updateFormValidation = (value: string, modelKey: LoginModelProp) => {
    const validationResult = validateLoginFormFunc(value, modelKey);
    if (formValidation[modelKey] !== validationResult) {
      setFormValidation({ ...formValidation, [modelKey]: validationResult });
    }
  };
  const onForgetPassword = () => {
    navigate(NavigationPath.FORGET_PASSWORD);
  };

  const onSignUp = () => {
    navigate(NavigationPath.REGISTRATION);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    e.preventDefault();
    formik.handleChange(e);
    if (isForceValid) setIsForceValid(false);
    const { value } = e.target;
    updateFormValidation(value, field!.modelKey as LoginModelProp);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    formik.handleBlur(e);
    if (isForceValid) setIsForceValid(false);
    const { value } = e.target;
    updateFormValidation(value, field!.modelKey as LoginModelProp);
  };

  const mValidationSchema = yup.object({
    ...getLoginValidationSchema(t),
  });

  const formik = useFormik<Model>({
    initialValues: { ...initialModel, email: emailAddress || '' },
    onSubmit: async (values) => {
      setIsLoggingIn(true);
      onLogin(values);
    },
    validationSchema: mValidationSchema || model,
  });
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    handleChange(e, field);
    setModel({ ...model, [`${field!.modelKey}`]: e.target.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loginForm = useMemo(() => {
    const emailHasError = formik.touched[LoginModelProp.EMAIL] && formik.errors[LoginModelProp.EMAIL];
    const emailAttrs = getFieldAttributes(
      LoginModelProp.EMAIL,
      LoginModelProp.EMAIL,
      displayText[DisplayTextKeys.EMAIL_TEXT],
    );
    const emailField = {
      ...emailAttrs,
      disabled: isLoggingIn,
      inputProps: {
        showClearButton: true,
        inputClassName: 'bg-transparent',
        inputContainerClassName: emailHasError ? '!border-red' : '!border-gray-300',
      },
      onClear: (dField?: DisplayField) => {
        if (dField) onClear(dField.id);
      },
      onChange: onFieldUpdate,
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
        handleBlur(e, field);
      },

      helperText: emailHasError ? formik.errors[LoginModelProp.EMAIL] : '',
      label: {
        ...emailAttrs.label,
        className: classNames(`${emailAttrs.label}`, `${emailHasError ? 'text-red' : ''}`),
      },
    };
    const pwdAttrs = getFieldAttributes(
      LoginModelProp.PASSWORD,
      LoginModelProp.PASSWORD,
      displayText[DisplayTextKeys.PASSWORD_TEXT],
    );
    const pwdHasError = formik.touched[LoginModelProp.PASSWORD] && formik.errors[LoginModelProp.PASSWORD];
    const passwordField = {
      ...pwdAttrs,
      disabled: isLoggingIn,
      className: 'border-gray-500',
      type: DisplayFieldType.PASSWORD,
      inputProps: {
        showClearButton: true,
        inputClassName: 'bg-transparent',
        inputContainerClassName: '!border-gray-300',
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key.toLowerCase() === 'enter') {
            formik.handleSubmit();
          }
        },
      },
      helperText: pwdHasError ? formik.errors[LoginModelProp.PASSWORD] : '',
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

    const isFormValid =
      isForceValid || (formValidation[LoginModelProp.PASSWORD] && formValidation[LoginModelProp.EMAIL]);
    return {
      isValid: isFormValid,
      sections: [
        {
          className: 'w-full  gap-5',
          fields: [emailField, passwordField],
        },
      ],
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, formik]);

  const formIsValid = isForceValid || (formValidation[LoginModelProp.PASSWORD] && formValidation[LoginModelProp.EMAIL]);

  useEffect(() => {
    const validations = Object.keys(initialModel).reduce((result: boolean[], key) => {
      const value = formik.values[key as keyof Model];
      updateFormValidation(value, key as LoginModelProp);
      return [...result, validateLoginFormFunc(value, key)];
    }, []);
    if (!validations.includes(false)) setIsForceValid(true);
  }, []);

  return (
    <AuthLayout
      title={displayText[DisplayTextKeys.TITLE]}
      error={{ body: error?.message || '', onClose: () => setError(null) }}
      subTitle={displayText.subTitle}
    >
      <div className="w-[70%] max-w-[420px]">
        <DisplayForm
          titleContainerClassName="mt-10"
          sectionsContainerClassName="pb-1"
          sections={loginForm.sections}
          title=""
          model={{ ...model, modelType: 'login' }}
        />
        <div className="mt-4">
          <Button isLink={true} onClick={onForgetPassword} className="btn-link">
            {displayText[DisplayTextKeys.FORGOT_PASSWORD_LINK]}
          </Button>
        </div>

        <Button
          onClick={formik.handleSubmit}
          type="submit"
          isDisable={!formIsValid}
          className={`w-full mt-10 mb-3 ${!formIsValid ? 'btn-disabled' : 'btn-primary'}`}
          isProcessing={isLoggingIn}
          props={{
            name: 'login',
          }}
        >
          {displayText[DisplayTextKeys.LOGIN]}
        </Button>

        <div className="w-full justify-center items-center flex">
          <Button isLink={true} onClick={onSignUp} className="btn-link">
            {displayText[DisplayTextKeys.REGISTER_LINK]}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
