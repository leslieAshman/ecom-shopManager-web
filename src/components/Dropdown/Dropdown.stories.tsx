import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Dropdown, { DropdownItem } from '.';
import { toInternalId } from 'utils';
import { COUNTRIES } from 'ConstantsHelpers';

const model = {
  country: '',
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Dropdown> = {
  title: 'Dropdown',
  component: Dropdown,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Dropdown>;
const countries: DropdownItem[] = [
  ...COUNTRIES.slice(0, 5).map((x: string) => {
    const id = `${toInternalId(x)}`;
    return {
      id,
      value: id,
      text: x,
      content: (
        <div className="flex justify-between text-base">
          <span>{`${x}`}</span>
        </div>
      ),
    };
  }),
];

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    placeholder: 'Please select',
    value: model.country,
    containerClassName: 'border-b w-[250px]',
    itemsContainerClassName: 'h-[250px] w-full  overflow-y-auto',
    items: countries,
    className: 'flex-1  text-14 text-black',
    itemsWrapperClassName: 'w-full ',
  },
};

export const Controlled: Story = {
  args: {
    placeholder: 'Please select',
    value: model.country,
    open: true,
    autoClose: false,
    containerClassName: 'border-b w-[250px]',
    itemsContainerClassName: 'h-[250px] w-full  overflow-y-auto',
    items: countries,
    className: 'flex-1  text-14 text-black',
    itemsWrapperClassName: 'w-full ',
  },
};
