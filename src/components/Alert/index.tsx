import { FC, ReactNode } from 'react';
import { classNames } from '../../utils';

interface AlertProps {
  children?: ReactNode;
  icon?: ReactNode;
  show: boolean;
  className?: string;
  onClose?: () => void;
}
const Alert: FC<AlertProps> = ({ children, icon, className, show = false, onClose }) => {
  const dismiss = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;
  return (
    <div className={classNames('flex items-center  px-4 py-5 space-x-2', className || '')} role="alert">
      {icon}
      <div className="overflow-y-auto max-h-[200px]">{children}</div>
      <span className="absolute -top-2 bottom-0 -right-3 px-4 py-3 cursor-pointer" onClick={dismiss}>
        <svg
          className="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  );
};

export default Alert;
