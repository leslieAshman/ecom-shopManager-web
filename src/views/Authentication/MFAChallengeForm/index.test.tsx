/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { OTPFormProps } from '.';

import { MemoryRouter } from 'react-router-dom';
import { defaultOptions } from '../../../graphql/client';
import MFAChallengeForm from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: jest.fn(),
    };
  },
}));
jest.useFakeTimers();

const renderMFAChallengeForm = (mfaRequest?: OTPFormProps, apoloClientConfig = {}) =>
  render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <MockedProvider defaultOptions={defaultOptions} {...apoloClientConfig}>
        <MFAChallengeForm {...{ mfaToken: '', mfaOOBCode: '', emailAddress: '', ...(mfaRequest || {}) }} />
      </MockedProvider>
    </MemoryRouter>,
  );

describe('<OTPForm />', () => {
  it('Submit button disabled  on load', () => {
    renderMFAChallengeForm();
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();
  });

  it('Show re-generate code link on load', () => {
    renderMFAChallengeForm();
    expect(screen.getByText(/otpForm.regenerateCode/i)).toBeInTheDocument();
  });

  it('Submit button enabled, 6 digit code', () => {
    renderMFAChallengeForm({
      mfaToken: '',
      mfaOOBCode: '',
      emailAddress: '',
      passcode: '123456',
    });
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).not.toBeDisabled();
  });

  it('Submit button disabled, 4 digit code', () => {
    renderMFAChallengeForm({
      mfaToken: '',
      mfaOOBCode: '',
      emailAddress: '',
      passcode: '1234',
    });
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();
  });

  it('Disable submit button, show back to login link when view expires, expire view in 5s', async () => {
    renderMFAChallengeForm({
      mfaToken: '',
      mfaOOBCode: '',
      emailAddress: '',
      viewExpiryTimeInSeconds: 2,
    });
    jest.runAllTimers();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    expect(screen.getByText(/otpForm.backToLogin/i)).toBeInTheDocument();
  });
});
