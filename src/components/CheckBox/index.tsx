import React, { FC, ReactNode } from 'react';

interface CheckBoxProps {
  id?: string;
  isChecked: boolean;
  children?: ReactNode;
  className?: string;
  inputClassName?: string;
  onChange?: (id: string, checked: boolean) => void;
  isDisabled?: boolean;
}

const CheckBox: FC<CheckBoxProps> = ({
  children,
  className,
  inputClassName,
  onChange,
  id,
  isChecked = false,
  isDisabled = false,
}) => {
  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled && onChange) onChange(id || '', e.target.checked);
  };

  return (
    <div className={`flex items-center ${className || ''}`.trim()}>
      <input
        disabled={isDisabled}
        type="checkbox"
        checked={isChecked}
        onChange={onCheck}
        className={`border-gray-300 rounded h-5 w-5 ${inputClassName || ''}`.trim()}
      />
      {children || null}
    </div>
  );
};

export default CheckBox;
