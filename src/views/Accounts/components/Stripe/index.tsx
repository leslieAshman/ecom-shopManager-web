import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const GBP_STRIPE_PUBLIC_KEY = process.env.REACT_APP_GBP_STRIPE_PUBLIC_KEY || '';

const stripeTestPromise = loadStripe(GBP_STRIPE_PUBLIC_KEY);
export const StripeContainer = ({
  options,
  children,
}: {
  options: { [key: string]: unknown };
  children: JSX.Element;
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Elements stripe={stripeTestPromise} options={options as any}>
      {children}
    </Elements>
  );
};

export default StripeContainer;
