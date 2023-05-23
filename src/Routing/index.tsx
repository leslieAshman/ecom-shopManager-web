import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Login } from '../views/Authentication';
import ResetPassword from '../views/Authentication/ResetPassword';
import Portfolio from '../views/Portfolio';
import { NavigationPath } from '../types/DomainTypes';
import Invest from '../views/Invest';
import Accounts from '../views/Accounts';
import Discover from '../views/Discover';
import MyCellar from '../views/MyCellar';
import { useEffect } from 'react';
import RegistrationForm from '../views/Authentication/components/RegistrationForm';
import Notifications from '../views/Notifications';
import NoRoute from './NoRoute';
import ProtectedRoute from './ProtectedRoute';
import { signOut } from '../services/auth';
import { isLoggedInVar } from '../graphql/cache';
import VintradeMapper from '../views/VintradeMapper';

const mapToVintradePath = '/maptovintrade';
const publicPages = [
  NavigationPath.LOGIN,
  NavigationPath.REGISTRATION,
  NavigationPath.FORGET_PASSWORD,
  mapToVintradePath,
] as string[];
const Routing = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLogin = isLoggedInVar();

  useEffect(() => {
    if (!isLogin && !publicPages.includes(pathname as string)) {
      navigate(NavigationPath.LOGIN);
    }

    if (isLogin && publicPages.includes(pathname as string)) {
      signOut();
      isLoggedInVar(false);
      navigate(NavigationPath.LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isLogin]);

  return (
    <Routes>
      <Route path={NavigationPath.LOGIN} element={<Login />} />
      <Route path={NavigationPath.FORGET_PASSWORD} element={<ResetPassword />} />
      <Route path={NavigationPath.REGISTRATION} element={<RegistrationForm />} />
      <Route path={mapToVintradePath} element={<VintradeMapper />} />

      <Route
        path={NavigationPath.PORTFOLIO}
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />
      <Route
        path={NavigationPath.INVEST}
        element={
          <ProtectedRoute>
            <Invest />
          </ProtectedRoute>
        }
      />
      <Route
        path={NavigationPath.MY_CELLAR}
        element={
          <ProtectedRoute>
            <MyCellar />
          </ProtectedRoute>
        }
      />
      <Route
        path={NavigationPath.ACCOUNTS}
        element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path={`${NavigationPath.ACCOUNTS}${NavigationPath.PAYMENT_CONFIRMATION}/*`}
        element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path={NavigationPath.DISCOVER}
        element={
          <ProtectedRoute>
            <Discover />{' '}
          </ProtectedRoute>
        }
      />
      <Route
        path={NavigationPath.NOTIFICATIONS}
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route path={'*'} element={<NoRoute />} />
    </Routes>
  );
};

export default Routing;
