import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { toInternalId } from 'utils';
import Alert from '.';
import { WarningIcon } from 'assets/icons';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Alert> = {
  title: 'Alert',
  component: Alert,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Alert>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    children: <div> Holy smokes! Something seriously bad happened.</div>,
    className: 'bg-red absolute top-3 w-[80%] text-14 text-white',
    icon: <WarningIcon />,
    show: true,
  },
};

// export const Controlled: Story = {
//   args: {
//     placeholder: 'Please select',
//     value: model.country,
//     open: true,
//     autoClose: false,
//     containerClassName: 'border-b w-[250px]',
//     itemsContainerClassName: 'h-[250px] w-full  overflow-y-auto',
//     items: countries,
//     className: 'flex-1  text-14 text-black',
//     itemsWrapperClassName: 'w-full ',
//   },
// };
