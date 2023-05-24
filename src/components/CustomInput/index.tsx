import React, { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCloseIcon } from '../../assets/icons';
import { CurrencyFormater } from '../../types/commonTypes';
import { classNames, formatter as defaultCurrencyFormatter, toNumeric } from '../../utils';
import { DisplayFieldType } from '../DisplayForms';

interface CustomInputProps {
  id?: string;
  name: string;
  value?: string | number;
  type?: DisplayFieldType;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  onInput?: (value: string | number) => void;
  onClear?: () => void;
  placeholder?: string;
  formatter?: CurrencyFormater;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    value?: string | number,
  ) => void;
  onTextAreaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>, value?: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>, value?: string | number) => void;
  helperTextClassName?: string;
  inputProps?: Record<string, unknown>;
  addOnEnd?: () => ReactNode;
}

const CustomInput: FC<CustomInputProps> = ({
  value,
  onInput,
  placeholder,
  onChange = () => null,
  onClear = () => null,
  onTextAreaChange,
  onBlur = () => null,
  type = DisplayFieldType.TEXT,
  className = '',
  inputClassName = '',
  id,
  name,
  helperText,
  helperTextClassName,
  inputProps = {},
  addOnEnd = () => null,
  formatter = defaultCurrencyFormatter,
}) => {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState<string | number>(value || '');
  const [currentType, setCurrentType] = useState<DisplayFieldType>(type);
  const [displayText, setDisplayText] = useState<string | number>(value || '');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = e.target.value;

    if (result !== currentValue) {
      setDisplayText(result);
      if (onTextAreaChange) onTextAreaChange(e, result);
      else if (onChange) {
        onChange(e, result);
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let result = e.target.value;
    if (
      currentType === DisplayFieldType.NUMERIC ||
      currentType === DisplayFieldType.CURRENCY ||
      currentType === DisplayFieldType.PHONE
    ) {
      result = toNumeric(result, currentType === DisplayFieldType.PHONE);
    }

    if (result !== currentValue) {
      setDisplayText(result);
      if (onChange) onChange(e, result);
    }
  };

  const onblur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { value: val } = e.target;
    if (currentType === DisplayFieldType.CURRENCY) {
      setDisplayText(formatter.format(Number(val)));
    }
    if (onBlur) onBlur(e, val);
  };

  const onFocus = () => {
    setDisplayText(currentValue);
  };

  useEffect(() => {
    if (currentValue !== value) setCurrentValue(value || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (type === DisplayFieldType.PASSWORD && isShowPassword === true) setCurrentType(DisplayFieldType.TEXT);
    else if (currentType !== type) setCurrentType(type || DisplayFieldType.TEXT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isShowPassword]);

  useEffect(() => {
    if (displayText !== currentValue) {
      setDisplayText(currentValue);
      if (onInput) onInput(currentValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  const additionalProp = useMemo(
    () =>
      currentType === DisplayFieldType.NUMERIC ||
      currentType === DisplayFieldType.CURRENCY ||
      currentType === DisplayFieldType.PHONE
        ? {
            onInput: (event: React.ChangeEvent<HTMLInputElement>) => {
              return setCurrentValue(toNumeric(event.target.value));
            },
          }
        : {},
    [currentType],
  );

  const {
    showClearButton,
    inputClassName: inputClasses,
    inputContainerClassName,
    onKeyDown,
    ...otherInput
  } = inputProps;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown)
      (
        onKeyDown as (
          e: React.KeyboardEvent<HTMLInputElement>,
          inputRef?: React.MutableRefObject<HTMLInputElement | null>,
        ) => void
      )(e, inputRef);
  };

  return (
    <div className={`flex flex-col ${className}`.trim()}>
      {currentType !== DisplayFieldType.TEXT_AREA && (
        <div
          className={classNames(
            'flex w-full border-b border-gray-200 items-center',
            (inputContainerClassName as string) || '',
          )}
        >
          <>
            <input
              ref={inputRef}
              id={id}
              name={name}
              autoFocus={false}
              className={`flex-1 outline-none pr-2 ${inputClassName} ${inputClasses || ''}`.trim()}
              autoComplete={currentType === DisplayFieldType.TEXT ? 'on' : 'off'}
              type={currentType}
              onBlur={onblur}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              value={displayText}
              onChange={handleOnChange}
              {...additionalProp}
              {...otherInput}
            />

            {showClearButton && showClearButton === true && currentValue && (
              <CircleCloseIcon
                data-testid={`${name}_clear_button`}
                className="cursor-pointer"
                onClick={() => {
                  setCurrentValue('');
                  inputRef.current?.focus();
                  if (onClear) onClear();
                }}
              />
            )}

            {type === DisplayFieldType.PASSWORD && currentValue && (
              <span
                data-testid={'showHidePassword'}
                className="cursor-pointer ml-2 text-sm"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {t(`common:${isShowPassword ? 'hide' : 'show'}`)}
              </span>
            )}
            {addOnEnd()}
          </>
        </div>
      )}
      {currentType === DisplayFieldType.TEXT_AREA && (
        <>
          <textarea
            id={id}
            name={name}
            onFocus={onFocus}
            placeholder={placeholder}
            value={displayText}
            onChange={textAreaChange}
            className={classNames(
              'block p-2.5 w-full h-full flex-1 outline-none text-14 text-gray-900 border border-gray-200 ',
              inputClassName || '',
            )}
            {...otherInput}
          ></textarea>
        </>
      )}
      {helperText && helperText.length > 0 && (
        <>
          <span className={`text-sm text-red opacity-75 mt-1 ${helperTextClassName || ''}`.trim()}>{helperText} </span>
        </>
      )}
    </div>
  );
};

export default CustomInput;
