import { useLazyQuery } from '@apollo/client';
import { RESET_PASSWORD_QUERY } from '../graphql/resetPassword';

const usePasswordResetQuery = () => {
  const [resetPassword] = useLazyQuery(RESET_PASSWORD_QUERY, {
    // Catches network errors and returns them in errors in response
    context: { serviceName: 'insecure' },
    onError: () => null,
  });
  return {
    resetPassword,
  };
};

export default usePasswordResetQuery;
