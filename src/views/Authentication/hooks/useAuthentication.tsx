import { useLazyQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { appIsWorkingVar } from '../../../graphql/cache';
import { LOGIN } from '../graphql/login';
import { executeLoginRequest } from '../helpers';
import { LoginModelProp } from '../types';
import { LoginResult } from '__generated__/graphql';
import { useLazyExecuteQuery } from 'views/hooks/useLazyExecuteQuery';

type Model = {
  [key in LoginModelProp]: string;
};

export interface UseAuthPropTypes {
  onError: (e: Error) => void;
  errorHandler: (message: string) => void;
  onSuccess: (loginResult: LoginResult) => void;
}

export const useAuth = ({ errorHandler, onError, onSuccess }: UseAuthPropTypes) => {
  const { t } = useTranslation();
  const { executor: login } = useLazyExecuteQuery(LOGIN);

  const onLogin = ({ email, password }: Model) => {
    executeLoginRequest({
      model: { email, password },
      appIsWorkingVar,
      login,
      errorHandler,
      t,
      onError,
      onSuccess,
    });
  };

  return { onLogin, login };
};
