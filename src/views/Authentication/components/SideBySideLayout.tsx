import React, { FC, ReactNode } from 'react';

type EmptyObject = Partial<Record<string, unknown>>;
interface StyleProps {
  container?: EmptyObject;
  rightContainer?: EmptyObject;
  leftContainer?: EmptyObject;
  rightBox?: EmptyObject;
  title?: EmptyObject;
  subTitle?: EmptyObject;
}

export interface SideBySideLayoutProps {
  title: string | React.ReactNode;
  subTitle: string;
  children: ReactNode;
  leftBox: JSX.Element;
  styles?: StyleProps;
  classNames?: {
    main?: string;
    left?: string;
    right?: string;
    title?: string;
    subTitle?: string;
  };
}

const SideBySideLayout: FC<SideBySideLayoutProps> = ({ title, subTitle, children, styles, leftBox, classNames }) => {
  return (
    <main
      className={`flex flex-col sm:flex-row w-full ${classNames?.main || ''}`}
      style={{
        ...styles?.container,
      }}
    >
      <div
        id="left-box-container"
        className={` ${classNames?.left || ''}`}
        style={{ ...(styles?.leftContainer || {}) }}
      >
        {leftBox}
      </div>
      <div
        id="right-box-container"
        className={`flex bg-inherit relative ${classNames?.right || ''}`}
        style={{
          ...styles?.rightContainer,
        }}
      >
        {title && typeof title === 'string' && (
          <h5 className={`${classNames?.title || ''}`} style={styles?.title}>
            {title}
          </h5>
        )}
        {title && typeof title !== 'string' && title}
        <h5 className={`${classNames?.subTitle || ''}`}>{subTitle}</h5>
        {children}
      </div>
    </main>
  );
};

export default SideBySideLayout;
