import React from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

interface Props<T> {
  inputRef: (instance: NumberFormat<T> | null) => void;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  name: string;
  ['data-thousand-separator']?: boolean;
  ['data-format']?: string;
}

export default function NumberFormatCustom<T>(props: Props<T>): JSX.Element {
  const {
    inputRef,
    onChange,
    'data-thousand-separator': dataThousandSeparator,
    'data-format': format,
    ...other
  } = props;
  return (
    <NumberFormat
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      getInputRef={inputRef}
      onValueChange={(values: NumberFormatValues) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        } as unknown as React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>);
      }}
      thousandSeparator={dataThousandSeparator !== undefined ? dataThousandSeparator : true}
      isNumericString
      format={format}
    />
  );
}
