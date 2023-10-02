import React, { FC, ReactNode } from 'react';
import { Switch } from '@headlessui/react';
import { ObjectType } from 'types/commonTypes';
import { classNames } from 'utils';

interface SwitcherProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  className?: string;
  text?: string;
  trackClassName?: string;
  trackBallClassName?: string;
}
const Switcher: FC<SwitcherProps> = ({ checked, onChange, trackClassName, trackBallClassName, text }) => {
  return (
    <Switch
      className={classNames(
        `${checked ? 'bg-orange' : 'bg-gray-200'}`,
        'relative inline-flex h-6 w-11 items-center rounded-full',
        `${trackClassName ?? ''}`,
      )}
      {...{ checked, onChange }}
    >
      {text && <span className="sr-only">{text}</span>}
      <span
        className={classNames(
          `${checked ? 'translate-x-6' : 'translate-x-1'}`,
          'inline-block h-4 w-4 transform rounded-full transition',
          `${trackBallClassName ?? 'bg-white'}`,
        )}
      />
    </Switch>
  );
};

export default Switcher;
