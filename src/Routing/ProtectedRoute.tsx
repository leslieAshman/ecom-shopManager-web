/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedInVar } from '../graphql/cache';
import { NavigationPath } from '../types/DomainTypes';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const isLogin = isLoggedInVar();

  useEffect(() => {
    if (!isLogin) {
      navigate(NavigationPath.LOGIN);
    }
  }, [isLogin]);

  return <>{children}</>;
};

export default ProtectedRoute;
