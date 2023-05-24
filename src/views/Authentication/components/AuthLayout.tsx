import { FC, ReactNode } from 'react';
import SideBySideLayout, { SideBySideLayoutProps } from './SideBySideLayout';
import { ReactComponent as FullScreenLogo } from '../../../assets/images/logos/logoAll.svg';
import { ReactComponent as WarningIcon } from '../../../assets/icons/warning.svg';

import { SmallScreenLogo } from '../../../assets/icons';
import Alert from '../../../components/Alert';

type AuthLayoutProps = Omit<SideBySideLayoutProps, 'leftBox'> & {
  error?: { body: string | null; onClose?: () => void; content?: () => ReactNode };
};

const AuthLayout: FC<AuthLayoutProps> = ({ title, subTitle, children, styles, error, classNames }) => {
  return (
    <SideBySideLayout
      title={title}
      subTitle={subTitle}
      classNames={{
        title: `text-lg mb-2 text-center ${(classNames || { title: '' }).title}`,
        subTitle: `text-14 text-center ${(classNames || { subTitle: '' }).subTitle}`,
        main: `bg-stone h-screen  ${(classNames || { main: '' }).main}`,
        left: 'h-40 w-full overflow-hidden   sm:h-screen  sm:w-1/3',
        right: 'flex-col flex-1 sm:justify-center items-center p-5',
      }}
      styles={styles}
      leftBox={
        <div id="logo-wrapper" className="relative w-full ">
          <div className="flex items-center justify-center bg-vine p-10 w-full sm:hidden">
            {/* <SmallScreenLogo /> */}
          </div>
          <div className="absolute w-full text-xl h-screen justify-center items-center left-0 top-0 hidden sm:flex">
            {' '}
            LOGO HERE
          </div>
          {/* <FullScreenLogo className="absolute w-full h-screen left-0 top-0 hidden sm:flex" /> */}
        </div>
      }
    >
      <>
        {error && error.body && error.body.length > 0 && (
          <Alert
            className="bg-red absolute top-3 w-[80%] text-14 text-white"
            show={true}
            onClose={() => {
              if (error.onClose) error.onClose();
            }}
            icon={<WarningIcon />}
          >
            {error.body}
            {error.content && error.content()}
          </Alert>
        )}
        {children}
      </>
    </SideBySideLayout>
  );
};

export default AuthLayout;
