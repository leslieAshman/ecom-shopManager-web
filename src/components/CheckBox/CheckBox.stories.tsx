import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CheckBox from '.';
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof CheckBox> = {
  title: 'CheckBox',
  component: CheckBox,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof CheckBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Component: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    children: <span className="ml-3 text-black text-14">{'Hello World'}</span>,
    className: 'flex-1 sm:w-[300px]',
    isChecked: true,
    inputClassName: 'mr-3',
  },
};
