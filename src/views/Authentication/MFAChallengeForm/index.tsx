import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components';
import { logError } from '../../../components/LogError';
import { AppContext } from '../../../context/ContextProvider';
import { appIsWorkingVar, isLoggedInVar } from '../../../graphql/cache';
import { buildDisplayText } from '../../../utils';

import OtpInput from '../components/OtpInput/OtpInput';
import ShowTextIn from '../components/ShowTextIn';
import useCountdown from '../hooks/useCountdown';
import { useLazyExecuteQuery } from 'views/hooks/useLazyExecuteQuery';
import { GENERATE_PASSCODE, GET_VERIFICATION_TOKEN } from '../graphql/generatePasscode';
import { useExecuteMutation } from 'views/hooks/useExecuteMutation';
import { SUBMIT_ONE_TIME_PASSCODE } from '../graphql/mfaChallenge';
import { ObjectType } from 'types/commonTypes';
import { BaseResultType, LoginResult } from '__generated__/graphql';
import { GQLMessageKeys } from 'types/gqlMessageTypes';
import { NavigationPath } from 'types/DomainTypes';

export interface OTPFormProps {
  mfaToken: string | null;
  mfaOOBCode: string | null;
  emailAddress: string | null;
  timesStamp?: number;
  password?: string;
  passcode?: string;
  mfaCodeLength?: number;
  viewExpiryTimeInSeconds?: number;
  onBack?: () => void;
  onError?: (err: Error | null) => void;
}

enum DisplayTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
  RESEND_CODE = 'resendCode',
  INVALID_DATA = 'invalidData',
  SUBMIT_BUTTON = 'common:submit',
  BACK_TO_LOGIN = 'backToLogin',
  VIEW_EXPIRED = 'viewExpired',
  REGENERATE_CODE = 'regenerateCode',
  WAIT_TO_SUBMIT = 'waitToResubmit',
}

interface MFAViewState {
  isLoading: boolean;
  showWaitToSubmit: boolean;
  showCodeGenTimer: boolean;
  isViewExpired: boolean;
  isCodeSent: boolean;
}

interface OTPInfoType {
  token: string | null;
  email: string | null;
  password: string | null;
}

const FIVE_MINUTE = 10 * 60 * 1000;
const NOW_IN_MS = new Date().getTime();
const dateTimeAfter5Minutes = NOW_IN_MS + FIVE_MINUTE;

const defaultViewState = {
  isLoading: false,
  showWaitToSubmit: false,
  showCodeGenTimer: false,
  isViewExpired: false,
  isCodeSent: false,
};
const MFAChallengeForm = ({
  mfaToken,
  emailAddress,
  password,
  passcode,
  timesStamp = NOW_IN_MS,
  mfaCodeLength = 6,
  viewExpiryTimeInSeconds = dateTimeAfter5Minutes,
  onBack,
  onError,
}: OTPFormProps): JSX.Element => {
  const [oneTimePasscode, setOneTimePasscode] = useState(passcode || '');

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [viewState, setViewState] = useState<MFAViewState>({ ...defaultViewState });

  const [otpInfo, setOTPInfo] = useState<OTPInfoType>({
    token: mfaToken,
    email: emailAddress,
    password: password || null,
  });
  const { dispatch } = useContext(AppContext);
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const { data: countDownData, onTargetDateChange } = useCountdown(viewExpiryTimeInSeconds);
  const [, , minutes, seconds] = countDownData;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayText = React.useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'auth:otpForm', t), [t]);
  const errorHandler = (message: string) => {
    setIsLoggingIn(false);
    throw new Error(message);
  };

  const {
    executor: codeRegenerator,
    loading,
    error: codeGenerationError,
    data: codeResult,
  } = useLazyExecuteQuery(GENERATE_PASSCODE);

  const {
    executor: getVerificationToken,
    loading: gettingToken,
    error: getVerificationTokenError,
    data: verificationTokenData,
  } = useLazyExecuteQuery(GET_VERIFICATION_TOKEN);

  const {
    executor: submitMfaChallenge,
    error: submitMfaError,
    loading: submittingMfs,
    data: submissionResult,
  } = useExecuteMutation(SUBMIT_ONE_TIME_PASSCODE);

  if (codeGenerationError) {
    setIsLoggingIn(false);
    onError?.(codeGenerationError);
  }

  const onClearTimer = () => {
    setViewState({ ...viewState, showCodeGenTimer: false, isCodeSent: false });
    onError?.(null);
  };

  if (isTimerEnabled && minutes + seconds <= 0 && !viewState.isViewExpired) {
    setIsLoggingIn(false);
    setViewState({ ...viewState, isViewExpired: true });
    onError?.(new Error(displayText[DisplayTextKeys.VIEW_EXPIRED]));
  }

  if (isTimerEnabled && minutes + seconds > 0 && viewState.isViewExpired) {
    setViewState({ ...viewState, isViewExpired: false });
    onError?.(null);
  }

  const reloadView = (initialTimeStamp = new Date().getTime(), update?: Partial<MFAViewState>) => {
    onTargetDateChange(initialTimeStamp + FIVE_MINUTE);
    setIsTimerEnabled(true);
    setViewState({ ...defaultViewState, ...(update || {}) });
    onError?.(null);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { token: _token, email: _email } = otpInfo;
    console.log(_token);
    if (!_token || !_email) {
      logError({ _token, _email }, displayText[DisplayTextKeys.INVALID_DATA]);
      onError?.(new Error(displayText[DisplayTextKeys.INVALID_DATA]));
      return;
    }
    appIsWorkingVar(true);
    setIsLoggingIn(true);
    setViewState({ ...viewState, showWaitToSubmit: true });
    submitMfaChallenge(
      {
        code: oneTimePasscode,
        email: _email,
        token: _token,
        password: passcode ?? '',
      },
      {
        context: { serviceName: 'insecure' },
      },
    );
  }

  useEffect(() => {
    if (submissionResult) {
      appIsWorkingVar(false);
      setIsLoggingIn(false);
      const resp = (submissionResult as { activationCodeSubmit: LoginResult }).activationCodeSubmit;

      if (resp.isSuccess) {
        if (resp.messageType === GQLMessageKeys.LOGIN_SUCCESSFULLY) {
          navigate(NavigationPath.PORTFOLIO);
        }
        if (resp.messageType === GQLMessageKeys.LOGIN_REQUIRED) {
          navigate(NavigationPath.LOGIN);
        }
      } else {
        switch (resp.messageType) {
          case GQLMessageKeys.INVALID_PASSCODE:
            console.log(resp.message);
            onError?.(new Error(`${resp.message || displayText[DisplayTextKeys.INVALID_DATA]}`));
            break;
          case GQLMessageKeys.ACCOUNT_ACTIVATION_TOKEN_NOT_MATCH:
            console.log(resp.message);
            onError?.(new Error(`${resp.message || displayText[DisplayTextKeys.INVALID_DATA]}`));
            break;

          default:
            break;
        }
      }

      //isLoggedInVar(true);

      // {

      //   appIsWorkingVar,
      //   submitOTP,
      //   t,
      //   onError: (message) => {
      //     setIsLoggingIn(false);
      //     logError(`FAILED: ${message}`);
      //     setError(new Error(message));
      //   },
      //   onSuccess: ({ portalAuthMfaVerify: { accessToken, refreshToken, userToken } }) => {
      //     dispatch({
      //       type: AuthEventTypes.LOGIN,
      //       payload: {
      //         isLogin: true,
      //       },
      //     });
      //     setIsLoggingIn(false);
      //     updateAccessToken(accessToken);
      //     updateRefreshToken(refreshToken);
      //     updateUserToken(userToken);
      //     navigate(NavigationPath.PORTFOLIO);
      //   },
      //   isLoggedInVar,
      // },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionResult]);

  useEffect(() => {
    if (!password) {
      getVerificationToken(
        {
          email: emailAddress,
        },
        {
          context: { serviceName: 'insecure' },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (verificationTokenData) {
      const resp = (verificationTokenData as { getVerificationToken: BaseResultType }).getVerificationToken;
      if (resp.isSuccess) {
        setOTPInfo({ ...otpInfo, token: resp.message ?? '' });
        if (GQLMessageKeys.ACTIVATION_CODE_SENT === resp.messageType) {
          setViewState({ ...viewState, isCodeSent: true });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationTokenData]);

  const onResendCode = () => {
    if (emailAddress) {
      // setViewState({ ...viewState, showCodeGenTimer: true });
      reloadView(new Date().getTime(), { showCodeGenTimer: true });
      codeRegenerator({ email: emailAddress }, { context: { serviceName: 'insecure' }, fetchPolicy: 'no-cache' });
    }
  };

  useEffect(() => {
    if (codeResult) {
      const { message, isSuccess } = (codeResult as { getPassCode: ObjectType }).getPassCode;
      if (Boolean(isSuccess)) {
        setOTPInfo({ ...otpInfo, token: `${message}` });
        setViewState({ ...viewState, isCodeSent: true });
      } else {
        onError?.(new Error(message as string));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeResult]);

  useEffect(() => {
    reloadView(timesStamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesStamp]);

  if (submitMfaError) {
    onError?.(new Error('Oops something went wrong!'));
  }

  const isSubmitDisabled =
    viewState.isViewExpired ||
    loading ||
    viewState.showWaitToSubmit ||
    viewState.showCodeGenTimer ||
    oneTimePasscode.length !== mfaCodeLength;

  return (
    <form
      className=" my-10 flex flex-col items-center "
      aria-label="one-time-passcode"
      noValidate
      onSubmit={handleSubmit}
    >
      {viewState.isCodeSent && <h5 className="text-14 text-center mb-5">{displayText[DisplayTextKeys.SUBTITLE]}</h5>}
      <OtpInput
        value={oneTimePasscode}
        valueLength={mfaCodeLength}
        onChange={(value) => {
          setOneTimePasscode(value.trim());
        }}
      />

      <Button
        type="submit"
        isDisable={isSubmitDisabled}
        className={`w-full mt-10 mb-3 ${isSubmitDisabled ? 'btn-disabled' : 'btn-primary'}`}
        isProcessing={isLoggingIn}
        props={{
          name: 'mfa',
        }}
      >
        {displayText[DisplayTextKeys.SUBMIT_BUTTON]}
      </Button>

      {!viewState.isViewExpired && viewState.showCodeGenTimer && (
        <div className="flex cursor-pointer justify-center">
          <ShowTextIn translationKey={'auth:otpForm.resendCode'} initValue={10} onEnd={onClearTimer} />
        </div>
      )}
      {viewState.isViewExpired && (
        <Button
          isLink={true}
          onClick={() => {
            if (onBack) onBack();
          }}
        >
          {displayText[DisplayTextKeys.BACK_TO_LOGIN]}
        </Button>
      )}

      {!viewState.isViewExpired && viewState.showWaitToSubmit && (
        <div className="flex cursor-pointer justify-center">
          <ShowTextIn
            translationKey={displayText[DisplayTextKeys.WAIT_TO_SUBMIT]}
            initValue={10}
            onEnd={() => setViewState({ ...viewState, showWaitToSubmit: false })}
          />
        </div>
      )}

      {!viewState.isViewExpired && !viewState.showCodeGenTimer && !viewState.showWaitToSubmit && (
        <Button isLink={true} onClick={onResendCode}>
          {displayText[DisplayTextKeys.REGENERATE_CODE]}
        </Button>
      )}
    </form>
  );
};

export default MFAChallengeForm;
