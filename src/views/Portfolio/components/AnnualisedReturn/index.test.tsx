import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import AnnualisedReturn, { DATA_TESTID } from '.';
import { defaultOptions } from '../../../../graphql/client';
// import { PORTFOLIO_ANNUALISED_RETURN } from './graphql';
// import { GetPortfolioAunualisedReturn } from './graphql/__generated__/GetPortfolioAunualisedReturn';

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
const renderAnnualisedReturn = (args = {}) =>
  render(
    <MockedProvider defaultOptions={defaultOptions} {...args}>
      <AnnualisedReturn />
    </MockedProvider>,
  );

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('Annualised Return Tests', () => {
  it('Annualised Return component loads', async () => {
    renderAnnualisedReturn();
    const component = await screen.findByTestId(DATA_TESTID.CONTAINER);
    expect(component).toBeInTheDocument();
  });

  // it.skip('Show error message, network error GetPortfolioAunualisedReturn', async () => {
  //   const gqlResponse: MockedResponse<GetPortfolioAunualisedReturn> = {
  //     request: {
  //       query: PORTFOLIO_ANNUALISED_RETURN,
  //     },
  //     result: {
  //       data: {
  //         portalPortfolioAnnualisedReturn: [],
  //       },
  //     },
  //     error: new Error('Network error'),
  //   };
  //   renderAnnualisedReturn({ mocks: [gqlResponse], addTypename: false });

  //   await waitFor(() => {
  //     expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  //   });
  // });
});
