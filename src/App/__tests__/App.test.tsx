import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import App from '..';
import { defaultOptions } from '../../graphql/client';

jest.mock('logrocket');

jest.mock('launchdarkly-react-client-sdk', () => {
  return {
    ...jest.requireActual('launchdarkly-react-client-sdk'),
    withLDProvider: () => {
      return (app: ReactNode) => app;
    },
    useLDClient: jest.fn(),
    useFlags: jest.fn(),
    withLDConsumer: jest.fn(),
  };
});

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
jest.mock('../../Routing');

test('Render App', () => {
  render(
    <MockedProvider defaultOptions={defaultOptions}>
      <App />
    </MockedProvider>,
  );
  const app = screen.getByTestId('app-container');
  expect(app).toBeInTheDocument();
});
