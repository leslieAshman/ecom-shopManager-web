/* eslint-disable react/prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayFieldType, DisplayField, DisplaySection, ModelValidationSchemaType, OverridableFieldType } from './';
import CustomInput from '../CustomInput';
import { classNames } from '../../utils';
import { getFieldAttributes } from 'helpers';

export const getFields = (
  fieldsIn: OverridableFieldType[],
  onFieldUpdate?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field?: DisplayField) => void,
): DisplayField[] => {
  return [...fieldsIn].map((field) => {
    const config = {
      ...getFieldAttributes(field.modelKey as string, field.modelKey as string, field?.label?.text ?? ''),
      sectionId: field.sectionId ?? '',
      containerClassName: 'mt-10 mr-5',
      inputProps: {
        inputClassName: classNames('bg-transparent '),
        showClearButton: true,
        inputContainerClassName: '!border-gray-700',
      },
      onChange: onFieldUpdate,
    };
    return {
      ...config,
      ...(field?.overrides?.(config) ?? {}),
    };
  });
};

export enum DisplayFormTestIds {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
}

export interface DisplayFormProps<T> {
  title?: string;
  subTitle?: string;
  sections: DisplaySection[];
  model: T;
  onChange?: (value: string, fieldId: string) => void;
  onBlur?: (value: string, fieldId: string) => void;
  validationSchema?: ModelValidationSchemaType;
  sectionsContainerClassName?: string;
  titleContainerClassName?: string;
}

const DisplayForm = <T extends { modelType: string | undefined }>({
  onChange,
  title,
  subTitle,
  sections,
  model,
  onBlur,
  sectionsContainerClassName = '',
  titleContainerClassName = '',
}: DisplayFormProps<T>): JSX.Element => {
  const { t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    field: DisplayField,
  ) => {
    if (field.onChange) field.onChange(e, field);
    else if (onChange) onChange(e.target.value, field.id);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field: DisplayField) => {
    const { value } = e.target;
    if (field.onBlur) field.onBlur(e, field);
    else if (onBlur) {
      onBlur(value, field.id);
    }
  };

  return (
    <>
      <div className={classNames('flex flex-col', titleContainerClassName)}>
        {!!title && title.length > 0 && (
          <h1 className="text-base" data-testid={DisplayFormTestIds.TITLE}>
            {title}
          </h1>
        )}
        {!!subTitle && subTitle.length > 0 && (
          <div className="text-sm" data-testid={DisplayFormTestIds.SUBTITLE}>
            {subTitle}
          </div>
        )}
      </div>

      <form className={classNames('flex w-full flex-wrap', sectionsContainerClassName)}>
        {sections &&
          sections.length > 0 &&
          sections.map((section, index) => {
            if (!section) return null;
            return (
              <div key={`field-group-${section?.name || index}`} className="flex flex-col w-full ">
                {section.head && section.head(section)}
                <div className={section?.className || ''}>
                  {section?.fields &&
                    section.fields.length > 0 &&
                    section.fields.map((field) => {
                      const {
                        id,
                        name,
                        numberFormat,
                        className = '',
                        thousandSeparate = false,
                        disabled = false,
                        type = DisplayFieldType.TEXT,
                        onClear = () => null,
                      } = field;
                      field.sectionId = section.id ?? '';
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const placeholder = t((field.translationKey || '') as any) || field.placeholder;
                      const fieldReference = field.id;
                      const inputProps = {
                        'data-testid': fieldReference,
                        ...(type === DisplayFieldType.NUMERIC
                          ? {
                              'data-thousand-separator': thousandSeparate,
                              'data-format': numberFormat,
                            }
                          : {}),
                        autoFocus: field.isAutoFocus || false,
                        ...(field.inputProps || {}),
                      };

                      return (
                        <div
                          key={`${field.id}`}
                          data-testid={`container-${field.id}`}
                          className={`w-full ${field.containerClassName} ${field.disabled ? 'disabled' : ''}`.trim()}
                        >
                          {field.label?.isShow && field.label?.isShow === true && (
                            <label
                              htmlFor={field.id}
                              className={`text-gray-700 text-sm ${field.label?.className || ''}`}
                            >
                              {`${field.label.text}${field.isRequired ? '*' : ''}`}
                            </label>
                          )}

                          {type === DisplayFieldType.CUSTOM && field.customTemplate && field.customTemplate(field)}
                          {type !== DisplayFieldType.CUSTOM && (
                            <CustomInput
                              type={type}
                              onClear={() => onClear(field)}
                              aria-label={`${field.ariaLabel || field.id}`}
                              {...{ disabled, className, id, name, placeholder, inputProps }}
                              value={!model ? '' : (model[field.modelKey as keyof T] as string)}
                              onChange={(e) => handleChange(e, field)}
                              onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                handleBlur(e, field)
                              }
                              helperTextClassName={field.helperTextClassName ?? ''}
                              helperText={field.helperText}
                              addOnEnd={() => field.customTemplate && field.customTemplate(field)}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
                {section.footer && section.footer(section)}
              </div>
            );
          })}
      </form>
    </>
  );
};

export default DisplayForm;
