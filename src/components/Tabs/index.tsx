import { FC, ReactNode } from 'react';
import { Tab } from '@headlessui/react';

export interface TabType {
  id: string;
  value: string;
  title?: ReactNode;
  content: () => ReactNode;
}

export interface TabsProp {
  value?: string;
  onItemSelect: (item: TabType) => void;
  items: TabType[];
  className?: string;
}

const Tabs: FC<TabsProp> = ({ onItemSelect, items, value, className }) => {
  return (
    <div className={`flex flex-col h-full`}>
      <Tab.Group>
        <Tab.List className={`flex flex-nowrap justify-evenly sm:justify-start bg-white ${className || ''}`.trim()}>
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <Tab
                className="mr-2 cursor-pointer w-[199.67px] h-[50px] outline-none focus:outline-none"
                key={item.id}
                onClick={() => onItemSelect(item)}
              >
                <div
                  className={`inline-block p-4 w-full rounded-t-lg border-b-2  hover:text-vine hover:border-vine ${
                    value === item.value ? 'border-vine  text-black' : 'border-transparent text-gray-700'
                  }`}
                >
                  {item.title}
                </div>
              </Tab>
            ))}
        </Tab.List>
        <Tab.Panels className={`mt-5 h-full w-full`}>
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <Tab.Panel className={`h-full w-full  flex flex-col`} key={item.id}>
                {item.content()}
              </Tab.Panel>
            ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
