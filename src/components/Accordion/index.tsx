import { Disclosure, Transition } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { ChevronDown } from '../../assets/icons';

export interface AccordionItem {
  id: string;
  title: string | (() => ReactNode);
  content: () => ReactNode;
  className?: string;
  titleContainerClassName?: string;
  onItemClick?: (itemId: string, isOpen: boolean) => void;
}

interface AccordionProp {
  items: AccordionItem[];
  className?: string;
}
const Accordion: FC<AccordionProp> = ({ className = '', items = [] }) => {
  const onItemClick = (item: AccordionItem, isOpen: boolean) => {
    if (item.onItemClick) item.onItemClick(item.id, isOpen);
  };

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-col h-full prismic-content ${className}`.trim()}>
      {items.map((item, index) => {
        return (
          <Disclosure key={`item-${item.id}-${index}`}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  onClick={() => onItemClick(item, open)}
                  className={`w-full flex items-center justify-between ${open ? 'bg-gray-200' : ''} ${
                    item.titleContainerClassName || ''
                  }`.trim()}
                >
                  <div className={`flex-1 text-left ${item.className || ''}`.trim()} key={`panl-${index}`}>
                    {typeof item.title === 'string' ? item.title : item.title()}
                  </div>
                  <ChevronDown className={open ? 'rotate-180 transform' : ''} />
                </Disclosure.Button>
                <Transition
                  show={open}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel static className="w-full">
                    {item.content()}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
};

export default Accordion;
