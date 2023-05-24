import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '.';
import { defaultOptions } from '../../../graphql/client';
import { NavigationPath } from '../../../types/DomainTypes';

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

const renderResetPasswordForm = (args = {}) =>
  render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <MockedProvider defaultOptions={defaultOptions} {...args}>
        <ResetPassword />
      </MockedProvider>
    </MemoryRouter>,
  );

describe('<ResetPassword />', () => {
  it('Disable button on load, no email', async () => {
    renderResetPasswordForm();
    const submit = screen.getByRole('button', { name: /resetpassword/i });
    await waitFor(() => {
      expect(submit).toBeDisabled();
    });
  });

  it('Enable button, valid email', async () => {
    renderResetPasswordForm();
    const submit = screen.getByRole('button', { name: /resetpassword/i });
    fireEvent.change(screen.getByRole('textbox', { name: /emailaddress/i }), {
      target: { value: 'homerj@powerplant.com' },
    });
    await waitFor(() => {
      expect(submit).not.toBeDisabled();
    });
  });

  it('Disable button, invalid email', async () => {
    renderResetPasswordForm();
    const submit = screen.getByRole('button', { name: /resetpassword/i });
    fireEvent.change(screen.getByRole('textbox', { name: /emailaddress/i }), {
      target: { value: 'blargh' },
    });
    await waitFor(() => {
      expect(submit).toBeDisabled();
    });
  });

  it('Clear email field when clear is clicked, valid email', async () => {
    renderResetPasswordForm();
    const emailField = screen.getByRole('textbox', { name: /emailaddress/i });
    fireEvent.change(emailField, {
      target: { value: 'homer.simpson@cultwinesltd.com' },
    });

    await waitFor(() => {
      const clearButton = screen.getByTestId('email_clear_button');
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      fireEvent.click(clearButton);
    });

    await waitFor(() => {
      const emailFieldValue = (emailField as HTMLInputElement).value;
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(emailFieldValue).toBe('');
    });
  });

  // it('Show "CheckEmail" message on submit,  valid email', async () => {
  //   const variables: ResetPasswordMutationQueryVariables = {
  //     resetPasswordInput: {
  //       clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  //       emailAddress: 'homerj@powerplant.com',
  //     },
  //   };

  //   const response: MockedResponse<ResetPasswordMutationMutation> = {
  //     request: {
  //       query: RESET_PASSWORD_MUTATION,
  //       variables,
  //     },
  //     result: {
  //       data: {
  //         portalAuthResetPassword: {
  //           emailAddress: 'homerj@powerplant.com',
  //           __typename: 'AuthResetPasswordResponse',
  //         },
  //       },
  //     },
  //   };

  //   renderResetPasswordForm({ mocks: [response], addTypename: false });
  //   fireEvent.change(screen.getByRole('textbox', { name: /emailaddress/i }), {
  //     target: { value: 'homerj@powerplant.com' },
  //   });
  //   fireEvent.click(screen.getByRole('button', { name: /resetpassword/i }));

  //   await waitFor(() => {
  //     expect(screen.getByText(/checkemailtitle/i)).toBeInTheDocument();
  //   });
  // });

  // it('Show error message on graphQL errors,  valid email', async () => {
  //   const variables: ResetPasswordMutationMutationVariables = {
  //     resetPasswordInput: {
  //       clientId: 'test-client-id',
  //       emailAddress: 'homerj@powerplant.com',
  //     },
  //   };

  //   const response: MockedResponse<ResetPasswordMutationMutation> = {
  //     request: {
  //       query: RESET_PASSWORD_MUTATION,
  //       variables,
  //     },
  //     result: {
  //       errors: [new GraphQLError('error')],
  //     },
  //   };

  //   renderResetPasswordForm({ mocks: [response], addTypename: false });
  //   fireEvent.change(screen.getByRole('textbox', { name: /emailaddress/i }), {
  //     target: { value: 'homerj@powerplant.com' },
  //   });
  //   fireEvent.click(screen.getByRole('button', { name: /resetpassword/i }));

  //   await waitFor(() => {
  //     expect(screen.getByText(/resetPassword.error/i)).toBeInTheDocument();
  //   });
  // });

  // test.skip('Navigate to login on button click: valid email, click to reset email', async () => {
  //   const variables: ResetPasswordMutationMutationVariables = {
  //     resetPasswordInput: {
  //       clientId: 'test-client-id',
  //       emailAddress: 'homerj@powerplant.com',
  //     },
  //   };

  //   const response: MockedResponse<ResetPasswordMutationMutation> = {
  //     request: {
  //       query: RESET_PASSWORD_MUTATION,
  //       variables,
  //     },
  //     result: {
  //       data: {
  //         portalAuthResetPassword: {
  //           emailAddress: 'homerj@powerplant.com',
  //           __typename: 'AuthResetPasswordResponse',
  //         },
  //       },
  //     },
  //   };

  //   renderResetPasswordForm({ mocks: [response], addTypename: false });

  //   fireEvent.change(screen.getByRole('textbox', { name: /emailaddress/i }), {
  //     target: { value: 'homerj@powerplant.com' },
  //   });
  //   fireEvent.click(screen.getByRole('button', { name: /resetpassword/i }));

  //   await waitFor(() => {
  //     // eslint-disable-next-line testing-library/no-wait-for-side-effects
  //     fireEvent.click(screen.getByRole('button', { name: /checkemailcalltoaction/i }));
  //   });

  //   await waitFor(() => {
  //     expect(window.location.pathname).toBe(NavigationPath.LOGIN);
  //   });
  // });

  test.skip('Navigate to login on back arrow button click', async () => {
    renderResetPasswordForm();
    const arrowButton = screen.getByTestId('back-arrow-button');
    fireEvent.click(arrowButton);
    await waitFor(() => {
      expect(window.location.pathname).toBe(NavigationPath.LOGIN);
    });
  });
});
