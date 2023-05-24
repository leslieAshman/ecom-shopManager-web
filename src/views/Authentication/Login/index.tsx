/** @jsxImportSource @emotion/react */

import { useLocation } from 'react-router-dom';
import LoginForm from '../LoginForm';

const Login = () => {
  const forwardedEmail = useLocation().state?.email || '';
  return <LoginForm emailAddress={forwardedEmail} />;
};

export default Login;
