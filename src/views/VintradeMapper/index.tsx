import React, { useMemo, useState } from 'react';
import { Button } from '../../components';
import DisplayForm from '../../components/DisplayForms/DisplayForm';
import * as yup from 'yup';
import { LoginModelProp } from '../Authentication/types';
import { getLoginValidationSchema } from '../Authentication/helpers';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { buildDisplayText, classNames, validateEmail } from '../../utils';
import { getFieldAttributes } from '../../helpers';
import { DisplayField, DisplayFieldType } from '../../components/DisplayForms';
import { SmallScreenLogoBlack, WarningIcon } from '../../assets/icons';
import { useVintradeMapperService } from './hooks';
import Alert from '../../components/Alert';

enum ErrorMessage {
  ALREADY_REGISTERED = 'Email is already registered within Vintrade. Update will have to be done manually',
  NOT_FOUND = 'No records found',
  RECORD_UPDATED = 'Record updated successfully!!',
}

//ajdpatrick@icloud.com
enum DisplayTextKeys {
  ERROR_MESSAGE = 'error',
  EMAIL_LABEL = 'auth:emailAddress.label',
  EMAIL_PLACEHOLDER = 'auth:emailAddress.required',
}

type Model = {
  email: string;
  vinTradeId: number;
};

interface IEmailVerification {
  Documents: Record<string, string>[];
}

const initialModel = {
  email: '',
  vinTradeId: -1,
};
const VintradeMapper = () => {
  const { t } = useTranslation();

  const { onVerfiyEmail, onQueryByAccountHolderId, onUpdateClientEmail } = useVintradeMapperService();
  const [formValidation, setFormValidation] = useState<{
    [key: string]: boolean;
  }>({
    email: false,
    vinTradeId: false,
  });
  const [feedback, setFeedback] = useState<{ isError: boolean; msg: string } | null>(null);
  const [isProcessing, setIsLoggingIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const displayText = React.useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'auth:resetPassword', t),
    [t],
  );

  const mValidationSchema = yup.object({
    [LoginModelProp.EMAIL]: getLoginValidationSchema(t)[LoginModelProp.EMAIL],
  });

  const handleEmailVerification = async (email: string) => {
    const vResults = JSON.parse((await onVerfiyEmail(email)) as string) as IEmailVerification;
    if (vResults.Documents.length > 0) {
      setIsVerified(false);
      setFeedback({ isError: true, msg: ErrorMessage.ALREADY_REGISTERED });
    } else setIsVerified(true);
  };

  const handleUpdateClientEmail = async (vintradeAccId: number, clientEmail: string) => {
    const vResults = JSON.parse((await onQueryByAccountHolderId(vintradeAccId)) as string) as IEmailVerification;
    if (vResults.Documents.length === 0) {
      setFeedback({ isError: true, msg: ErrorMessage.NOT_FOUND });
    } else {
      const doc = {
        ...vResults.Documents[0],
        clientEmail,
      };
      const res = await onUpdateClientEmail(doc);
      const result = JSON.parse(res as string) as Record<string, unknown>;

      if (result.message) setFeedback({ isError: true, msg: result.message as string });
      else {
        setFeedback({ isError: false, msg: ErrorMessage.RECORD_UPDATED });
        setIsVerified(false);
      }
    }
  };

  const formik = useFormik<Model>({
    initialValues: initialModel,
    onSubmit: async (values) => {
      setFeedback(null);
      setIsLoggingIn(true);

      if (!isVerified) {
        await handleEmailVerification(values.email);
        setIsLoggingIn(false);
      } else {
        await handleUpdateClientEmail(values.vinTradeId, values.email);
        setIsLoggingIn(false);
      }
    },
    validationSchema: mValidationSchema,
  });
  const verifyVintradeId = (value: string | number) => `${value}`.length > 2;
  const updateFormValidation = (value: string, modelKey: keyof Model) => {
    if (feedback?.isError) {
      setFeedback(null);
    }
    let isVerifyNewVal = isVerified;
    if (modelKey === 'email' && isVerified) {
      isVerifyNewVal = false;
      setIsVerified(false);
    }

    setFormValidation({
      ...formValidation,
      email: validateEmail(modelKey === 'email' ? value : formik.values.email),
      vinTradeId: !isVerifyNewVal
        ? true
        : verifyVintradeId(modelKey === 'vinTradeId' ? value : formik.values.vinTradeId),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    e.preventDefault();
    formik.handleChange(e);
    const { value } = e.target;
    updateFormValidation(value, field?.modelKey as keyof Model);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
    formik.handleBlur(e);
    const { value } = e.target;

    updateFormValidation(value, field?.modelKey as keyof Model);
  };

  const mapperform = useMemo(() => {
    const emailHasError = formik.touched[LoginModelProp.EMAIL] && formik.errors[LoginModelProp.EMAIL];
    const emailAttrs = getFieldAttributes(
      LoginModelProp.EMAIL,
      LoginModelProp.EMAIL,
      displayText[DisplayTextKeys.EMAIL_LABEL],
    );
    const fields: DisplayField[] = [
      {
        ...emailAttrs,
        isAutoFocus: true,
        disabled: false,
        inputProps: {
          showClearButton: true,
          inputClassName: 'bg-transparent',
          inputContainerClassName: emailHasError ? '!border-red' : '!border-gray-300',
        },
        onChange: handleChange,
        onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          handleBlur(e);
        },
        onClear: (dField?: DisplayField) => {
          setFormValidation({ ...formValidation, email: false });
          setIsVerified(false);
          formik.setFieldValue(dField!.id as string, '');
        },

        helperText: emailHasError ? formik.errors[LoginModelProp.EMAIL] : '',
        label: {
          ...emailAttrs.label,
          className: classNames(`${emailAttrs.label}`, `${emailHasError ? 'text-red' : ''}`),
        },
      },
    ];

    const vintradeIdField = {
      ...getFieldAttributes('vinTradeId', 'vinTradeId', 'Vintrade Id'),
      onChange: handleChange,
      type: DisplayFieldType.NUMERIC,
    };
    if (isVerified) {
      fields.push(vintradeIdField);
      const vintradeValidationResults = verifyVintradeId(formik.values.vinTradeId);
      if (formValidation.vinTradeId !== vintradeValidationResults)
        setFormValidation({ ...formValidation, vinTradeId: vintradeValidationResults });
    }

    return [
      {
        className: 'w-full  gap-5',
        fields,
      },
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik, isVerified]);

  const isSubmitDisabled =
    isProcessing ||
    Object.keys(formValidation)
      .map((x) => formValidation[x])
      .includes(false);

  return (
    <div className="w-full h-screen overflow-hidden justify-center flex">
      <div className="w-[439px] flex flex-col items-center mt-[150px]">
        {feedback && feedback.msg.length > 0 && (
          <Alert
            className={`${feedback.isError ? 'bg-red' : 'bg-green'} absolute top-3 w-[80%] text-14 text-white`}
            show={true}
            onClose={() => {
              setFeedback(null);
            }}
            icon={<WarningIcon />}
          >
            {feedback.msg}
          </Alert>
        )}
        <div className="flex w-full  justify-center h-[91px] mb-[20px] items-center">
          <SmallScreenLogoBlack />
        </div>
        <>
          <DisplayForm
            titleContainerClassName="mt-10"
            sectionsContainerClassName="pb-1"
            sections={mapperform}
            title=""
            model={{ [LoginModelProp.EMAIL]: formik.values[LoginModelProp.EMAIL], modelType: 'login' }}
          />

          <Button
            onClick={formik.handleSubmit}
            type="submit"
            isDisable={isSubmitDisabled}
            className={`w-full mt-10 mb-3 ${isSubmitDisabled ? 'btn-disabled' : 'btn-primary'}`}
            isProcessing={isProcessing}
            props={{
              name: 'reset-password',
            }}
          >
            {isVerified ? 'Update' : 'Verfiy'}
          </Button>
        </>
      </div>
    </div>
  );
};

export default VintradeMapper;
