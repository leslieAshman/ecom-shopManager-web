import { Popover, Transition } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { Alignment } from '../../types/DomainTypes';

interface ItemPopoverProps {
  children: ReactNode;
  buttonTemplate: ReactNode;
  align?: Alignment;
}
const ItemPopover: FC<ItemPopoverProps> = ({ children, buttonTemplate, align = Alignment.CENTER }) => {
  const alignment =
    align === Alignment.CENTER
      ? '-translate-x-1/2 left-5 '
      : align === Alignment.RIGHT
      ? '-translate-x-full left-5 '
      : '';

  return (
    <Popover className="relative">
      <Popover.Button className="outline-none">{buttonTemplate}</Popover.Button>
      <Transition
        className={'z-50'}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className={`absolute z-10  shadow-lg ${alignment}`}>
          <div className="flex z-10">{children}</div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default ItemPopover;
