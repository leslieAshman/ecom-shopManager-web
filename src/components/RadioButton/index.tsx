import React, { FC, ReactNode } from 'react';
import './index.css';

interface RadioButtonProps {
  id?: string;
  name: string;
  isChecked: boolean;
  children?: ReactNode;
  className?: string;
  onChange?: (id: string, checked: boolean) => void;
  onClick?: (id: string, checked: boolean) => void;
  isDisabled?: boolean;
}

const RadioButton: FC<RadioButtonProps> = ({
  children,
  name,
  className,
  onChange,
  onClick,
  id,
  isChecked = false,
  isDisabled = false,
}) => {
  const compId = id || `radio-${Date.now()}`;
  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(compId, Boolean(e.target.value));
  };
  return (
    <div className="flex items-center">
      <input id={compId} type="radio" name={name} className="hidden" checked={isChecked} onChange={onRadioChange} />
      <label
        htmlFor={compId}
        onClick={() => {
          if (onClick) onClick(compId, !isChecked);
        }}
        className={`flex items-center cursor-pointer ${isDisabled ? 'btn-disabled' : ''} ${className || ''}`.trim()}
      >
        <span className="w-4 h-4 inline-block mr-1 rounded-full border border-black"></span>
        {children || null}
      </label>
    </div>
  );
};

export default RadioButton;
