import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationPath } from '../types/DomainTypes';

const NoRoute = () => {
  const navigate = useNavigate();
  useEffect(() => {
    return navigate(NavigationPath.PORTFOLIO as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default NoRoute;
