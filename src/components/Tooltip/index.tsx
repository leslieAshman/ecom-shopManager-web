import { FC, ReactNode, useRef } from 'react';
import { Alignment } from '../../types/DomainTypes';

interface Props {
  children: ReactNode;
  tooltip?: ReactNode;
  align?: Alignment;
}

const ToolTip: FC<Props> = ({ children, tooltip, align = Alignment.CENTER }): JSX.Element => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const alignment =
    align === Alignment.CENTER
      ? '-translate-x-1/2 left-5 '
      : align === Alignment.RIGHT
      ? '-translate-x-full left-5 '
      : '';
  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();
        tooltipRef.current.style.left = clientX - left + 'px';
      }}
      className="group relative inline-block"
    >
      {children}
      {tooltip ? (
        <div
          ref={tooltipRef}
          className={`invisible z-10  group-hover:visible opacity-0
           group-hover:opacity-100 transition
           rounded absolute top-full mt-2 ${alignment}`}
        >
          {tooltip}
        </div>
      ) : null}
    </div>
  );
};

export default ToolTip;
