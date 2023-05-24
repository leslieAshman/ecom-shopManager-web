import { ObjectType } from 'types/commonTypes';
import { RequiredStringSchema } from 'yup/lib/string';

export type ModelValidationSchemaType = Record<
  string,
  RequiredStringSchema<string | undefined, Record<string, unknown>>
>;

export enum ChangePasswordModelProp {
  PASSWORD = 'password',
  CONFIRM_NEW_PASSWORD = 'confirmpassword',
}

export enum LoginModelProp {
  EMAIL = 'email',
  PASSWORD = 'password',
}

export interface BaseResultType {
  isSuccess: boolean;
  message?: string;
  messageType?: string;
  result?: ObjectType;
}

export interface MfaRequestProps {
  mfaToken: string;
  mfaOOBCode: string;
  emailAddress: string;
  password: string;
}

export interface RegistrationResult {
  registerUser: {
    isSuccess: boolean;
    message: string;
    messageType: string;
  };
}

export interface ValidateEmailResponse {
  validateEmail: {
    message?: string;
    isSuccess?: boolean;
    messageType: string;
  };
}
