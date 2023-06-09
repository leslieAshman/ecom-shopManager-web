import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown, ChevronUp } from '../../assets/icons';
import { FC, ReactNode } from 'react';
import { classNames } from '../../utils';

export interface DropdownItem {
  id: string;
  value: string;
  content: ReactNode;
  text?: string;
}

export interface DropdownPropType {
  value?: string;
  placeholder?: string;
  onItemSelect?: (item: DropdownItem) => void;
  items?: DropdownItem[];
  className?: string;
  iconClassName?: string;
  style?: Record<string, unknown>;
  valueText?: string;
  header?: ReactNode;
  footer?: ReactNode;
  itemClassName?: string;
  onOpen?: () => void;
  children?: ReactNode;
  containerClassName?: string;
  itemsContainerClassName?: string;
  itemsWrapperClassName?: string;
  autoClose?: boolean;
  open?: boolean;
  isDisabled?: boolean;
  valueTemplate?: ReactNode;
  itemWrapperStyle?: Record<string, unknown>;
}

const Dropdown: FC<DropdownPropType> = ({
  onItemSelect,
  items,
  className,
  value,
  placeholder,
  iconClassName,
  style,
  valueText,
  valueTemplate,
  header,
  footer,
  containerClassName,
  itemClassName,
  itemsContainerClassName,
  itemsWrapperClassName,
  onOpen,
  children,
  open,
  isDisabled = false,
  autoClose = true,
  itemWrapperStyle,
}) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${containerClassName || ''}`.trim()}>
      <Menu.Button
        onClick={() => {
          if (onOpen && items && items.length > 1) onOpen();
        }}
        style={style}
        className={classNames(
          `${children ? '' : 'btn-dropdown '}  ${isDisabled ? `btn-disabled` : ''}`,
          `${className || ''}`,
        )}
      >
        {children ? (
          children
        ) : (
          <>
            {valueTemplate || valueText || value || placeholder || ''}

            {!open && items && items.length > 1 && (
              <ChevronDown
                className={`-mr-1 ml-2 mt-1 ${iconClassName || ''}  ${isDisabled ? 'opacity-30' : 'opacity-100'}`}
                aria-hidden="true"
              />
            )}
            {!isDisabled && items && items.length > 1 && open && (
              <ChevronUp className={`-mr-1 ml-2 mt-1 ${iconClassName || ''}`} aria-hidden="true" />
            )}
          </>
        )}
      </Menu.Button>

      {(header !== undefined || footer !== undefined || (items && items.length > 1)) && (
        <Transition
          as={Fragment}
          {...(!autoClose && { show: open })}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            style={{ ...(itemWrapperStyle || {}) }}
            {...(!autoClose && { static: true })}
            className={`absolute z-10 mt-2  origin-top-right  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
              itemsWrapperClassName || ''
            }`.trim()}
          >
            {header && <div className="py-1">{header}</div>}
            {items && (
              <div className={`py-1 ${itemsContainerClassName || ''}`.trim()}>
                {items &&
                  items.length > 0 &&
                  items.map((item) => (
                    <Menu.Item key={item.id}>
                      {({ active }: { active: boolean }) => (
                        <div
                          onClick={() => {
                            if (item.value !== value && onItemSelect) onItemSelect(item);
                          }}
                          className={classNames(
                            'cursor-pointer',
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            `block px-4 py-2 text-sm ${value === item.value ? 'bg-gray-300 text-gray-900' : ''}`.trim(),
                            `${itemClassName || ''}`.trim(),
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
              </div>
            )}
            {footer && <div className="py-1">{footer}</div>}
          </Menu.Items>
        </Transition>
      )}
    </Menu>
  );
};

export default Dropdown;
