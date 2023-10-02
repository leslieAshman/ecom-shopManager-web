import React from 'react';
import Button from '.';
import type { Meta, StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    className: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Primary: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    className: 'btn-primary',
    children: 'Click Me',
  },
};

export const Accent: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    className: 'btn-accent',
    children: 'Click Me',
  },
};
export const Secondary = () => <Button className="btn-outline"> Click Me</Button>;
export const Large: Story = {
  args: {
    className: 'btn-primary w-full',
    children: 'Click Me',
  },
};
export const Disabled: Story = {
  args: {
    className: 'btn-primary btn-disabled',
    children: 'Click Me',
  },
};

export const Link: Story = {
  args: {
    isLink: true,
    children: 'Click Me',
  },
};

export const Badge: Story = {
  args: {
    type: 'badge',
    children: 'I am a badge',
  },
};
