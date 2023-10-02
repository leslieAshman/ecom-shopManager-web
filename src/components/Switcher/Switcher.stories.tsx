import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Switcher from '.';

const meta: Meta<typeof Switcher> = {
  title: 'Switcher',
  component: Switcher,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    className: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Switcher>;

export const Off: Story = {
  args: {
    checked: false,
  },
};

export const On: Story = {
  args: {
    checked: true,
  },
};
