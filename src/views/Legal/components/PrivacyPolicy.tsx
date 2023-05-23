import { useEffect } from 'react';

const privacyPolicy = 'https://www.wineinvestment.com/company/privacy-policy/';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.open(privacyPolicy, '_blank');
  }, []);
  return null;
};

export default PrivacyPolicy;
