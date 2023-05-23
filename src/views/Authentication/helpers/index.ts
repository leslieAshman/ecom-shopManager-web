import { GraphQLError } from 'graphql';
import { TFunction } from 'react-i18next';
import * as yup from 'yup';
import { logError } from '../../../components/LogError';
import { useAuth } from '../hooks/useAuthentication';

import usePasswordMutation from '../hooks/usePasswordMutation';
import { ChangePasswordModelProp, LoginModelProp, ModelValidationSchemaType } from '../types';
import { LoginResult } from '__generated__/graphql';

export const getLoginValidationSchema = (t: TFunction<'translation', undefined>): ModelValidationSchemaType => ({
  [LoginModelProp.PASSWORD]: yup
    .string()
    .test(LoginModelProp.PASSWORD, t('auth:password.invalid'), (password) => (password || '').length > 7)
    .required(t`auth:password.required`),
  [LoginModelProp.EMAIL]: yup.string().email(t('auth:emailAddress.required')).required(t('auth:emailAddress.required')),
});

export const getChangePasswordValidationSchema = (
  t: TFunction<'translation', undefined>,
): ModelValidationSchemaType => ({
  [ChangePasswordModelProp.PASSWORD]: yup.string().required(t`auth:password.required`),
  [ChangePasswordModelProp.CONFIRM_NEW_PASSWORD]: yup.string().required(t`auth:password.required`),
});

export function selectErrorMessage(errors: readonly GraphQLError[] | Error): string {
  return errors instanceof Error ? errors.message : errors[0].message;
}

export type IsFormValidFnType = () => boolean;

// export const executeLoginRequest2 = async (config: {
//   model: { email: string; password: string };
//   appIsWorkingVar: (arg: boolean) => boolean;
//   login: ReturnType<typeof useAuth>['login'];
//   errorHandler: (message: string) => void;
//   t: TFunction<'translation', undefined>;
//   getMFAAuthenticators: ReturnType<typeof useAuth>['getMFAAuthenticators'];
//   issueMFAChallenge: ReturnType<typeof useAuth>['issueMFAChallenge'];
//   onError: (e: Error) => void;
//   onMFARequested?: (args: { mfaToken: string; mfaOOBCode: string; emailAddress: string; password: string }) => void;
// }) => {
//   const { email: emailAddress, password } = config.model;
//   const { appIsWorkingVar, login, errorHandler, t, getMFAAuthenticators, issueMFAChallenge, onError, onMFARequested } =
//     config;
//   appIsWorkingVar(true);

//   try {
//     const loginResult = (await login({
//       variables: {
//         userCredentials: { email: emailAddress, password, clientId: process.env.REACT_APP_CLIENT_ID! },
//       },
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     })) as any;
//     const { errors: loginErrors } = loginResult;
//     // 403 is an error we tolerate, it means we need to getMFAAuthenticators with mfaToken from the response
//     if (
//       loginErrors &&
//       loginErrors.length > 0 &&
//       loginErrors[0].extensions &&
//       loginErrors[0].extensions.response?.status !== 403
//     ) {
//       errorHandler(selectErrorMessage(loginErrors));
//     }

//     // Network error - different typing (an object instead of array)
//     if (loginErrors !== undefined && !loginErrors.length) {
//       errorHandler(loginErrors.toString());
//     }

//     const mfaToken = loginErrors && loginErrors[0]?.extensions?.response.body.mfaToken;
//     if (!mfaToken) {
//       errorHandler(t('auth:loginForm.failedToLogin'));
//     }
//     const { data: mfaAuthenticatorsResponse, errors: mfaAuthenticatorsErrors } = await getMFAAuthenticators({
//       variables: {
//         getMfaAuthenticatorsRequestInput: {
//           mfaToken,
//         },
//       },
//     });
//     if (mfaAuthenticatorsErrors) {
//       errorHandler(selectErrorMessage(mfaAuthenticatorsErrors));
//     }

//     // only email is supported at time of writing, so
//     // request the code be sent to the registered email address.
//     const email = mfaAuthenticatorsResponse!.portalAuthMfaAuthenticators.mfaAuthenticators.find(
//       (authenticator: { oobChannel: string }) => authenticator.oobChannel === 'email',
//     );
//     if (!email) {
//       errorHandler(t('auth:loginForm.failedToLogin'));
//       return;
//     }

//     const { data: mfaData, errors: mfaErrors } = await issueMFAChallenge({
//       variables: {
//         mfaChallengeRequestInput: {
//           clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
//           authenticatorId: email.id,
//           mfaToken,
//         },
//       },
//     });
//     if (mfaErrors) {
//       errorHandler(selectErrorMessage(mfaErrors));
//     }

//     if (!mfaData) {
//       errorHandler(t('auth:loginForm.failedToLogin'));
//     }

//     appIsWorkingVar(false);
//     if (onMFARequested)
//       onMFARequested({
//         mfaOOBCode: (mfaData as IssueMfaChallengeMutation).portalAuthMfaChallenge.oobCode,
//         mfaToken,
//         emailAddress,
//         password,
//       });
//   } catch (e) {
//     appIsWorkingVar(false);
//     onError(e as Error);
//   }
// };

export const executeLoginRequest = async (config: {
  model: { email: string; password: string };
  appIsWorkingVar: (arg: boolean) => boolean;
  login: ReturnType<typeof useAuth>['login'];
  errorHandler: (message: string) => void;
  onSuccess: (loginResult: LoginResult) => void;
  t: TFunction<'translation', undefined>;
  onError: (e: Error) => void;
}) => {
  const { email: emailAddress, password } = config.model;
  const { appIsWorkingVar, login, errorHandler, t, onError, onSuccess } = config;
  appIsWorkingVar(true);

  try {
    const loginResult = (await login(
      {
        userCredentials: { email: emailAddress, password, clientId: process.env.REACT_APP_CLIENT_ID! },
      },
      {
        fetchPolicy: 'no-cache',
        context: { serviceName: 'insecure' },
        // Catches network errors and returns them in errors in response
        onError: () => null,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;

    console.log('LOGIN RESULT', loginResult);
    const { errors: loginErrors } = loginResult;
    // 403 is an error we tolerate, it means we need to getMFAAuthenticators with mfaToken from the response
    if (
      loginErrors &&
      loginErrors.length > 0 &&
      loginErrors[0].extensions &&
      loginErrors[0].extensions.response?.status !== 403
    ) {
      errorHandler(selectErrorMessage(loginErrors));
    }

    // Network error - different typing (an object instead of array)
    if (loginErrors !== undefined && !loginErrors.length) {
      errorHandler(loginErrors.toString());
    }

    if (!emailAddress) {
      errorHandler(t('auth:loginForm.failedToLogin'));
      return;
    }

    if (!loginResult.data.login.isSuccess) {
      errorHandler(loginResult.data.login.message);
      return;
    }

    onSuccess(loginResult.data.login);
    appIsWorkingVar(false);
  } catch (e) {
    appIsWorkingVar(false);
    onError(e as Error);
  }
};

export const executePasswordResetRequest = async (
  email: string,
  config: {
    appIsWorkingVar: (arg: boolean) => boolean;
    resetPassword: ReturnType<typeof usePasswordMutation>['resetPassword'];
    onError: (message: string) => void;
    onEmailSent: (sent: boolean) => void;
  },
) => {
  const { appIsWorkingVar, resetPassword, onError, onEmailSent } = config;
  appIsWorkingVar(true);

  const { errors } = (await resetPassword({
    variables: { clientId: process.env.REACT_APP_CLIENT_ID!, email },
  })) as any;
  if (errors) {
    appIsWorkingVar(false);
    onError(selectErrorMessage(errors));
  } else {
    appIsWorkingVar(false);
    onEmailSent(true);
  }
};
