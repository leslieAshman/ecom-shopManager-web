import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, Dropdown } from '../../../components';
import { DisplayField, DisplayFieldType, DisplaySection } from '../../../components/DisplayForms';
import DisplayForm from '../../../components/DisplayForms/DisplayForm';
import { DropdownItem } from '../../../components/Dropdown';
import { logError } from '../../../components/LogError';
import { AppContext } from '../../../context/ContextProvider';
import { getFieldAttributes } from '../../../helpers';
import { buildDisplayText, capitalizeFirstLetter, toInternalId } from '../../../utils';
import { useExecuteMutation } from '../../hooks/useExecuteMutation';
import { CONTACT_RELATION_MANAGER_MUTATION } from '../graphql/contactRelationManagerMutation';
import { SubjectOptionKeys } from '../types';

const ddlConfig = {
  itemWrapperStyle: { width: '100%' },
  containerClassName: 'w-full',
  itemsContainerClassName: 'h-[300px] overflow-y-auto w-full',
  itemClassName: 'py-5 text-base flex',
  className: 'flex-1 text-sm sm:text-14 text-black whitespace-nowrap p-0 justify-start border-b border-b-gray-400',
};

enum DisplayTextKeys {
  CONTACT_METHOD_TEXT = 'contact-method-text',
  CONTACT_METHOD_PLACEHOLDER_TEXT = 'contact-method-placeholder-text',
  TITLE_TEXT = 'title_text',
  SUBTITLE_TEXT = 'subTitle_text',
  CONTACT_TEXT = 'contact-text',
  SUBJECT_TEXT = 'subject-text',
  MESSAGE_TEXT = 'message-text',
  SEND_REQUEST_TEXT = 'send-message',
  SEND_REQUEST_SUCCESS_TEXT = 'send-request-success-text',
  SEND_REQUEST_ERROR_TEXT = 'send-request-error-text',

  FINANCIAL = 'financial',
  GENERAL = 'general',
  RELATION_MGR = 'relationMgr',
  SUPPORT = 'support',
  UPDATE_DETAILS = 'updateDetails',
}

enum ContactMethodType {
  EMAIL = 'email',
  PHONE = 'phone-call',
}

enum ModelKeys {
  CONTACT_METHOD = 'contactMethod',
  CONTACT = 'contact',
  SUBJECT = 'subject',
  MESSAGE = 'message',
}

const contactMethodOptions = (t: TFunction) => {
  return Object.values(ContactMethodType).map((option) => {
    const text = capitalizeFirstLetter(t(`account:contactUs:${option}`));
    return {
      id: toInternalId(option),
      value: option,
      text,
      content: (
        <div className="flex text-14">
          <span>{text}</span>
        </div>
      ),
    };
  });
};

const getSubjectOptions = (displayText: Record<string, string>) => {
  return Object.values(SubjectOptionKeys).map((option) => {
    const text = capitalizeFirstLetter(displayText[option]);
    return {
      id: toInternalId(option),
      value: option,
      text,
      content: (
        <div className="flex text-14">
          <span>{text}</span>
        </div>
      ),
    };
  });
};

interface ModelType {
  [ModelKeys.SUBJECT]: string;
  [ModelKeys.MESSAGE]: string;
  [ModelKeys.CONTACT]: string | number;
  [ModelKeys.CONTACT_METHOD]: string;
}

const defaultModel: ModelType = {
  [ModelKeys.SUBJECT]: SubjectOptionKeys.GENERAL,
  [ModelKeys.MESSAGE]: '',
  [ModelKeys.CONTACT]: '',
  [ModelKeys.CONTACT_METHOD]: ContactMethodType.EMAIL,
};

const ContactUs = () => {
  const { t } = useTranslation();
  const { state: locationParam } = useLocation();
  const {
    state: { settings: language },
  } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'account:contactUs', t), [t]);
  const contactOptions = useMemo(() => contactMethodOptions(t), [t]);
  const subjectOptions = useMemo(() => getSubjectOptions(displayText), [displayText]);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const {
    executor: sendRequest,
    data: sendRequestResult,
    loading: sendingRequest,
    error: errorSendingRequest,
  } = useExecuteMutation(CONTACT_RELATION_MANAGER_MUTATION);

  const [model, setModel] = useState<ModelType>({ ...defaultModel });
  const onSendRequest = () => {
    setIsSendingRequest(true);
    sendRequest({
      request: {
        subject: model[ModelKeys.SUBJECT],
        message: model[ModelKeys.MESSAGE],
        contactMethod: model[ModelKeys.CONTACT_METHOD],
        contactMethodValue: model[ModelKeys.CONTACT],
      },
    });
  };

  const updateModel = (key: string, value: unknown) => {
    setModel({ ...model, [key]: value });
  };
  const onFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) =>
    updateModel(field?.modelKey || '', e.target.value);

  const sections: DisplaySection[] = useMemo(() => {
    const contactField = 'CONTACT';
    const messageField = 'MESSAGE';
    const fields: DisplayField[] = [
      {
        ...getFieldAttributes(ModelKeys.SUBJECT, ModelKeys.SUBJECT, displayText[DisplayTextKeys.SUBJECT_TEXT]),
        type: DisplayFieldType.CUSTOM,
        customTemplate: () => {
          return (
            <Dropdown
              placeholder="Select item"
              value={model[ModelKeys.SUBJECT]}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block">
                    {subjectOptions.find((x) => x.value === model[ModelKeys.SUBJECT])!.text}
                  </span>
                </div>
              }
              onItemSelect={(item: DropdownItem) => {
                setModel({ ...model, [ModelKeys.SUBJECT]: item.value });
              }}
              items={subjectOptions}
              {...ddlConfig}
            />
          );
        },
      },

      {
        ...getFieldAttributes(
          messageField,
          ModelKeys[`${messageField}` as const],
          displayText[DisplayTextKeys[`${messageField}_TEXT` as const]],
        ),
        type: DisplayFieldType.TEXT_AREA,
        onChange: onFieldUpdate,
        className: 'min-h-[160px]',
      },

      {
        ...getFieldAttributes(
          ModelKeys.CONTACT_METHOD,
          ModelKeys.CONTACT_METHOD,
          displayText[DisplayTextKeys.CONTACT_METHOD_TEXT],
        ),
        type: DisplayFieldType.CUSTOM,
        customTemplate: () => {
          return (
            <Dropdown
              placeholder="Select item"
              value={model[ModelKeys.CONTACT_METHOD]}
              valueTemplate={
                <div className="flex w-[95%]">
                  <span className="truncate block">
                    {contactOptions.find((x) => x.value === model[ModelKeys.CONTACT_METHOD])!.text}
                  </span>
                </div>
              }
              onItemSelect={(item: DropdownItem) => {
                setModel({ ...model, [ModelKeys.CONTACT_METHOD]: item.value, [ModelKeys.CONTACT]: '' });
              }}
              items={contactOptions}
              {...ddlConfig}
            />
          );
        },
      },
      {
        ...getFieldAttributes(
          contactField,
          ModelKeys[`${contactField}` as const],
          displayText[DisplayTextKeys[`${contactField}_TEXT` as const]],
        ),
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => {
          updateModel(field?.modelKey || '', e.target.value);
        },
        type:
          model[ModelKeys.CONTACT_METHOD] === ContactMethodType.PHONE ? DisplayFieldType.PHONE : DisplayFieldType.TEXT,
      },
    ];

    return [
      {
        className: 'w-full  gap-5',
        fields: [...fields],
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  if (errorSendingRequest) {
    logError(errorSendingRequest);
  }
  useEffect(() => {
    if (isSendingRequest && !sendingRequest) {
      setIsSendingRequest(false);
      if (!errorSendingRequest) {
        const result = sendRequestResult as {
          portalContactRelationshipManger: {
            errorMessage: null;
            isSuccess: true;
          };
        };
        enqueueSnackbar(
          result?.portalContactRelationshipManger.isSuccess
            ? displayText[DisplayTextKeys.SEND_REQUEST_SUCCESS_TEXT]
            : displayText[DisplayTextKeys.SEND_REQUEST_ERROR_TEXT],
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendingRequest]);

  useEffect(() => {
    setModel({
      ...model,
      [ModelKeys.SUBJECT]:
        locationParam && locationParam?.subject && locationParam.subject !== model[ModelKeys.SUBJECT]
          ? locationParam.subject
          : SubjectOptionKeys.GENERAL,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationParam?.subject, language]);

  const isFormValid = model[ModelKeys.MESSAGE].length > 0 && model[ModelKeys.SUBJECT].length > 0;
  const disableButton = isSendingRequest || !isFormValid;
  return (
    <div className={`flex flex-col p-5 ${isSendingRequest ? 'opacity-30 pointer-events-none' : ''}`}>
      <h1>{displayText[DisplayTextKeys.TITLE_TEXT]}</h1>
      <p className="text-14 mt-3">{displayText[DisplayTextKeys.SUBTITLE_TEXT]}</p>
      <DisplayForm sections={sections} model={{ ...model, modelType: 'ContactUs' }} />
      <Button
        isProcessing={isSendingRequest}
        isDisable={disableButton}
        className={` mt-10 w-fit ${disableButton ? 'btn-disabled' : 'btn-accent'}`}
        onClick={onSendRequest}
        props={{
          name: displayText[DisplayTextKeys.SEND_REQUEST_TEXT],
        }}
      >
        {displayText[DisplayTextKeys.SEND_REQUEST_TEXT]}
      </Button>
    </div>
  );
};

export default ContactUs;
