/* eslint-disable @typescript-eslint/no-use-before-define */
import { useFormik } from 'formik';
import React, { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { BackArrow } from '../../../assets/icons';
import { Button } from '../../../components';
import { DisplayField } from '../../../components/DisplayForms';
import DisplayForm from '../../../components/DisplayForms/DisplayForm';
import { logError } from '../../../components/LogError';
import { appIsWorkingVar } from '../../../graphql/cache';
import { getFieldAttributes } from '../../../helpers';
import { NavigationPath } from '../../../types/DomainTypes';
import { buildDisplayText, classNames, validateEmail } from '../../../utils';
import AuthLayout from '../components/AuthLayout';
import ShowTextIn from '../components/ShowTextIn';
import { executePasswordResetRequest, getLoginValidationSchema, selectErrorMessage } from '../helpers';
import { LoginModelProp } from '../types';
import usePasswordResetQuery from '../hooks/usePasswordMutation';
import { useLazyExecuteQuery } from 'views/hooks/useLazyExecuteQuery';
import { RESET_PASSWORD_QUERY } from '../graphql/resetPassword';
import { LoginResult } from '__generated__/graphql';
import { ObjectType } from 'types/commonTypes';
import useCountdown from '../hooks/useCountdown';

enum DisplayTextKeys {
  TITLE = 'forgotPasswordTitle',
  EMAIL_SENT_VIEW_TITLE = 'checkEmailTitle',
  EMAIL_SENT_VIEW_SUBTITLE = 'checkEmailBody',
  SUBTITLE = 'subTitle',
  REGISTER_LINK = 'registerLink',
  FORGOT_PASSWORD_LINK = 'forgotPasswordLink',
  FAILED_TO_LOGIN = 'failedToLogin',
  BUTTON = 'button',
  EMAIL_SENT_VIEW_CTA = 'checkEmailCallToAction',
  FIND_OUT_MORE = 'findOutMore',
  ERROR_MESSAGE = 'error',
  EMAIL_LABEL = 'auth:emailAddress.label',
  EMAIL_PLACEHOLDER = 'auth:emailAddress.required',
  RESEND_EMAIL_LINK = 'resendEmailLink',
}

const resendEmailMaxTime = 10;
const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { executor: resetPasswordExec } = useLazyExecuteQuery(RESET_PASSWORD_QUERY);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [isFormValid, setFormValidation] = React.useState(false);
  const [showResubmitText, setShowResubmitText] = useState(false);
  const [errContent, setErrContent] = useState<ReactNode>(null);
  const displayText = React.useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'auth:resetPassword', t),
    [t],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    formik.handleChange(e);
    const { value } = e.target;
    setFormValidation(validateEmail(value));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.handleBlur(e);
    const { value } = e.target;
    setFormValidation(validateEmail(value));
  };
  const onBack = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    resetState();
    navigate(NavigationPath.LOGIN);
  };

  const resetState = () => {
    appIsWorkingVar(false);
    setIsEmailSent(false);
    setErrorMessage(null);
    setIsLoggingIn(false);
    formik.resetForm();
  };

  const recoverPassword = async ({ email }: { email: string }) => {
    appIsWorkingVar(true);
    console.log('EMAIL', email);
    const { error, data } = await resetPasswordExec(
      {
        clientId: process.env.REACT_APP_CLIENT_ID!,
        email,
      },
      { context: { serviceName: 'insecure' }, fetchPolicy: 'no-cache', onError: () => null },
    );

    if (error) {
      appIsWorkingVar(false);
      setErrorMessage(displayText[DisplayTextKeys.ERROR_MESSAGE]);
      logError(selectErrorMessage(error));
      setIsLoggingIn(false);
      setShowResubmitText(true);
    } else {
      appIsWorkingVar(false);
      setIsLoggingIn(false);
      const { isSuccess, message } = (data as ObjectType)?.resetPassword as LoginResult;
      if (!isSuccess) {
        setErrorMessage(message ?? displayText[DisplayTextKeys.ERROR_MESSAGE]);
        //TODO: setErrContent to activate account
        setShowResubmitText(true);
      } else setIsEmailSent(true);
    }
  };

  const mValidationSchema = yup.object({
    [LoginModelProp.EMAIL]: getLoginValidationSchema(t)[LoginModelProp.EMAIL],
  });

  const formik = useFormik({
    initialValues: { [LoginModelProp.EMAIL]: '' },
    onSubmit: async (values) => {
      setErrContent(null);
      setErrorMessage(null);
      if (isEmailSent) navigate(NavigationPath.LOGIN);
      else {
        setIsLoggingIn(true);
        recoverPassword(values);
      }
    },
    validationSchema: mValidationSchema,
  });

  const recoveryForm = useMemo(() => {
    const emailHasError = formik.touched[LoginModelProp.EMAIL] && formik.errors[LoginModelProp.EMAIL];
    const emailAttrs = getFieldAttributes(
      LoginModelProp.EMAIL,
      LoginModelProp.EMAIL,
      displayText[DisplayTextKeys.EMAIL_LABEL],
    );
    const emailField = {
      ...emailAttrs,
      isAutoFocus: true,
      disabled: isLoggingIn,
      placeholder: displayText[DisplayTextKeys.EMAIL_PLACEHOLDER],
      inputProps: {
        showClearButton: true,
        inputClassName: 'bg-transparent',
        inputContainerClassName: emailHasError ? '!border-red' : '!border-gray-300',
      },
      onChange: handleChange,
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleBlur(e);
      },
      onClear: (dField?: DisplayField) => {
        setFormValidation(false);
        formik.setFieldValue(dField!.id as string, '');
      },

      helperText: emailHasError ? formik.errors[LoginModelProp.EMAIL] : '',
      label: {
        ...emailAttrs.label,
        className: classNames(`${emailAttrs.label}`, `${emailHasError ? 'text-red' : ''}`),
      },
    };

    return [
      {
        className: 'w-full  gap-5',
        fields: [emailField],
      },
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik]);

  const displayInfo = {
    title: isEmailSent ? (
      displayText[DisplayTextKeys.EMAIL_SENT_VIEW_TITLE]
    ) : (
      <div id="title-container" className="flex items-center">
        <BackArrow className="mr-5 cursor-pointer" data-testid="back-arrow-button" onClick={(e) => onBack(e)} />
        <h5 className="text-lg">{displayText[DisplayTextKeys.TITLE]}</h5>
      </div>
    ),

    subTitle: displayText[isEmailSent ? DisplayTextKeys.EMAIL_SENT_VIEW_SUBTITLE : DisplayTextKeys.SUBTITLE],
  };
  const isSubmitDisabled = showResubmitText || (!isEmailSent && !isFormValid);

  return (
    <AuthLayout
      error={{ body: errorMessage, onClose: () => setErrorMessage(''), content: () => errContent }}
      title={displayInfo.title}
      subTitle={displayInfo.subTitle}
      classNames={{
        subTitle: 'w-[70%] ',
      }}
    >
      <div className=" w-[70%]">
        {!isEmailSent && (
          <DisplayForm
            titleContainerClassName="mt-1"
            sectionsContainerClassName="pb-1"
            sections={recoveryForm}
            title=""
            model={{ [LoginModelProp.EMAIL]: formik.values[LoginModelProp.EMAIL], modelType: 'login' }}
          />
        )}
        <Button
          onClick={formik.handleSubmit}
          type="submit"
          isDisable={isSubmitDisabled}
          className={`w-full mt-10 mb-3 ${isSubmitDisabled ? 'btn-disabled' : 'btn-primary'}`}
          isProcessing={isLoggingIn}
          props={{
            name: 'reset-password',
          }}
        >
          {displayText[isEmailSent ? DisplayTextKeys.EMAIL_SENT_VIEW_CTA : DisplayTextKeys.BUTTON]}
        </Button>

        {showResubmitText && (
          <div className="flex justify-center">
            <ShowTextIn
              translationKey={displayText[DisplayTextKeys.RESEND_EMAIL_LINK]}
              initValue={resendEmailMaxTime}
              onEnd={() => setShowResubmitText(false)}
            />
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
