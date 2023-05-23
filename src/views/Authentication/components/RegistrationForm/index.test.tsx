/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-wait-for-empty-callback */
import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { defaultOptions } from '../../../../graphql/client';
import { NavigationPath } from '../../../../types/DomainTypes';
import RegistrationForm from '.';
import { VALIDATE_EMAIL } from '../../graphql/validateEmail';
import { ValidateEmailResponse } from '../../types';
import resolvers from '../../../../graphql/mocks/graphql-resolvers';
import { MemoryRouter } from 'react-router-dom';

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
const submitButtonRegx = /auth:registrationForm.submit_button_text/i;

const validateEmailFn = (emailAddress: string, status: string) => {
  return {
    request: {
      query: VALIDATE_EMAIL,
      variables: {
        emailAddress,
      },
    },
    result: {
      data: {
        validateEmail: {
          isSuccess: true,
          message: '',
          messageType: status,
        },
      },
    },
  };
};

const renderForm = (args = {}) =>
  render(
    <MemoryRouter initialEntries={[NavigationPath.REGISTRATION]}>
      <MockedProvider defaultOptions={defaultOptions} {...args} resolvers={resolvers}>
        <RegistrationForm />
      </MockedProvider>
    </MemoryRouter>,
  );

describe('<RegistrationForm />', () => {
  it('Hide submit button, no email', async () => {
    renderForm();
    const submit = screen.queryByRole('button', { name: submitButtonRegx });
    await waitFor(() => {
      expect(submit).not.toBeInTheDocument();
    });
  });

  it('Disable verify email button, no email', async () => {
    renderForm();
    await waitFor(() => {
      const verifyEmailButton = screen.getByRole('button', {
        name: /auth:registrationForm.verify_button_text/i,
      });
      expect(verifyEmailButton).toBeDisabled();
    });
  });

  it('Disable verify email button, invalid email', async () => {
    renderForm();
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'invaild2email.com' },
    });
    await waitFor(() => {
      const verifyEmailButton = screen.getByRole('button', {
        name: /auth:registrationForm.verify_button_text/i,
      });
      expect(verifyEmailButton).toBeDisabled();
    });
  });

  it('Enable verify email button, valid email', async () => {
    renderForm();
    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'vaild@email.com' },
    });
    await waitFor(() => {
      const verifyEmailButton = screen.getByRole('button', { name: /auth:registrationForm.verify_button_text/i });
      expect(verifyEmailButton).toBeEnabled();
    });
  });

  it('Hide password fields, no email, no verification', async () => {
    renderForm();
    const pwdField = screen.queryByTestId('container-password');
    const confirmPwdField = screen.queryByTestId('container-confirmpassword');
    await waitFor(() => {
      expect(pwdField).not.toBeInTheDocument();
      expect(confirmPwdField).not.toBeInTheDocument();
    });
  });

  it('Show error message on INVALID  email verifications check', async () => {
    const emailAddress = 'homerjs@invalid.com';
    const validateEmailResponse: MockedResponse<ValidateEmailResponse> = validateEmailFn(emailAddress, 'INVALID');
    renderForm({
      mocks: [validateEmailResponse],
      addTypename: false,
    });

    fireEvent.change(screen.getByRole('textbox', { name: /auth:registrationForm.email.title/i }), {
      target: { value: emailAddress },
    });

    const verifyEmailButton = screen.queryByRole('button', {
      name: /auth:registrationForm.verify_button_text/i,
    });
    if (verifyEmailButton) fireEvent.click(verifyEmailButton);

    expect(await screen.findByText(/Auth:registrationForm.invalid_registration_text/i)).toBeInTheDocument();
    await waitFor(() => {
      const pwdField = screen.queryByTestId('container-password');
      const confirmPwdField = screen.queryByTestId('container-confirmpassword');
      expect(pwdField).not.toBeInTheDocument();
      expect(confirmPwdField).not.toBeInTheDocument();
    });
  });

  // it('Enable both password fields on VALID email after verifications check', async () => {
  //   const validateEmailResponse: MockedResponse<ValidateEmailResponse> = validateEmailFn(
  //     'homerjs@springfield.com',
  //     'VALID',
  //   );

  //   renderForm({
  //     mocks: [validateEmailResponse],
  //     addTypename: false,
  //   });

  //   fireEvent.change(screen.getByRole('textbox', { name: /auth:registrationForm.email.title/i }), {
  //     target: { value: 'homerjs@springfield.com' },
  //   });

  //   const verifyEmailButton = screen.queryByRole('button', {
  //     name: /auth:registrationForm.verify_button_text/i,
  //   });
  //   if (verifyEmailButton) fireEvent.click(verifyEmailButton);
  //   const pwdField = await screen.findByTestId('container-password');
  //   const confirmPwdField = await screen.findByTestId('container-confirmpassword');
  //   await waitFor(() => {
  //     expect(pwdField?.classList.contains('disabled')).toBeFalsy();
  //     expect(confirmPwdField?.classList.contains('disabled')).toBeFalsy();
  //   });
  // });

  // it('On clear email field after verification,  hide both password fields, valid email', async () => {
  //   const emailAddress = 'homerjs@valid.com';
  //   const validateEmailResponse: MockedResponse<ValidateEmailResponse> = validateEmailFn(emailAddress, 'INVALID');

  //   renderForm({
  //     mocks: [validateEmailResponse],
  //     addTypename: false,
  //   });
  //   const emailField = screen.getByRole('textbox', { name: /auth:registrationForm.email.title/i });

  //   fireEvent.change(emailField, {
  //     target: { value: emailAddress },
  //   });

  //   const verifyEmailButton = screen.queryByRole('button', {
  //     name: /auth:registrationForm.verify_button_text/i,
  //   });
  //   if (verifyEmailButton) fireEvent.click(verifyEmailButton);

  //   const pwdField = await screen.findByTestId('password');
  //   const confirmPwdField = await screen.findByTestId('confirmpassword');

  //   await waitFor(() => {
  //     expect(pwdField).toBeEnabled();
  //     expect(confirmPwdField).toBeEnabled();
  //   });

  //   const emailClearButton = await screen.findByTestId('email_clear_button');
  //   fireEvent.click(emailClearButton);

  //   const emailFieldValue = (emailField as HTMLInputElement).value;
  //   await waitFor(() => {
  //     expect(emailFieldValue).toBe('');
  //     expect(screen.queryByTestId('password')).not.toBeInTheDocument();
  //     expect(screen.queryByTestId('confirmpassword')).not.toBeInTheDocument();
  //   });
  // });

  // it('On invalid email field after verification,  hide both password fields, valid email', async () => {
  //   const validEmailAddress = 'homerjs@valid.com';
  //   const invalidEmailAddress = 'someInvalidEmailAddress';
  //   const validateEmailResponse: MockedResponse<ValidateEmailResponse> = validateEmailFn(validEmailAddress, 'INVALID');

  //   renderForm({
  //     mocks: [validateEmailResponse],
  //     addTypename: false,
  //   });
  //   const emailField = screen.getByRole('textbox', { name: /auth:registrationForm.email.title/i });

  //   fireEvent.change(emailField, {
  //     target: { value: validEmailAddress },
  //   });

  //   const verifyEmailButton = screen.queryByRole('button', {
  //     name: /auth:registrationForm.verify_button_text/i,
  //   });
  //   if (verifyEmailButton) fireEvent.click(verifyEmailButton);

  //   const pwdField = await screen.findByTestId('password');
  //   const confirmPwdField = await screen.findByTestId('confirmpassword');

  //   await waitFor(() => {
  //     expect(pwdField).toBeEnabled();
  //     expect(confirmPwdField).toBeEnabled();
  //   });

  //   fireEvent.change(emailField, {
  //     target: { value: invalidEmailAddress },
  //   });

  //   const emailFieldValue = (emailField as HTMLInputElement).value;
  //   await waitFor(() => {
  //     expect(emailFieldValue).toBe(invalidEmailAddress);
  //     expect(screen.queryByTestId('password')).not.toBeInTheDocument();
  //     expect(screen.queryByTestId('confirmpassword')).not.toBeInTheDocument();
  //   });
  // });

  it.skip('Enable submit button on valid form, valid email, valid password, valid confirm password', async () => {
    const emailAddress = 'homerjs@valid.com';
    const validateEmailResponse: MockedResponse<ValidateEmailResponse> = validateEmailFn(emailAddress, 'VALID');
    renderForm({
      mocks: [validateEmailResponse],
      addTypename: false,
    });
    const emailField = screen.getByRole('textbox', { name: /auth:registrationForm.email.title/i });

    fireEvent.change(emailField, {
      target: { value: emailAddress },
    });

    const verifyEmailButton = await screen.findByRole('button', {
      name: /auth:registrationForm.verify_button_text/i,
    });
    fireEvent.click(verifyEmailButton);
    const pwdField = await screen.findByTestId('password');
    const confirmPwdField = await screen.findByTestId('confirmpassword');

    await waitFor(() => {
      expect(pwdField).toBeInTheDocument();
      expect(confirmPwdField).toBeInTheDocument();
    });

    const passwordField = screen.getByLabelText(/Auth:registrationForm.password.title/i);
    const confirmPasswordField = screen.getByLabelText(/Auth:registrationForm.confirmPassword.title/i);
    fireEvent.change(passwordField, {
      target: { value: 'Testing1$' },
    });

    fireEvent.change(confirmPasswordField, {
      target: { value: 'Testing1$' },
    });

    await waitFor(async () => {
      const submit = screen.getByRole('button', { name: submitButtonRegx });
      expect(submit).toBeEnabled();
    });
  });
});
