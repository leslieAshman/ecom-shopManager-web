import { useEffect } from 'react';

const termsAndConditions = 'https://www.wineinvestment.com/company/terms-and-conditions/';
const TermsAndConditions = () => {
  useEffect(() => {
    window.open(termsAndConditions, '_blank');
  }, []);

  return null;
};

export default TermsAndConditions;
