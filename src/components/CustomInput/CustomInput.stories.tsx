import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CustomInput from '.';
import { DisplayFieldType } from 'components/DisplayForms';

const meta: Meta<typeof CustomInput> = {
  title: 'Input',
  component: CustomInput,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof CustomInput>;

const model = {
  numeric: 0,
  password: '',
  text: '',
};
export const Numeric: Story = {
  args: {
    name: 'numeric',
    type: DisplayFieldType.NUMERIC,
    value: model.numeric,
    placeholder: 'Enter a number',
    helperText: 'Error text here',
    className: 'w-[250px]',
  },
};

export const Text: Story = {
  args: {
    name: 'text',
    type: DisplayFieldType.TEXT,
    value: model.text,
    placeholder: 'Enter a text',
    className: 'w-1/3',
  },
};

export const Password: Story = {
  args: {
    name: 'password',
    type: DisplayFieldType.PASSWORD,
    value: model.password,
    placeholder: 'Enter a password',
    className: 'w-1/3',
  },
};

export const Currency: Story = {
  args: {
    name: 'numeric',
    type: DisplayFieldType.CURRENCY,
    value: model.numeric,
    placeholder: 'Enter a amount',
    className: 'w-[250px]',
  },
};

export const TextArea: Story = {
  args: {
    name: 'text',
    type: DisplayFieldType.TEXT_AREA,
    value: model.text,
    placeholder: 'Type here',
    className: 'w-1/2',
  },
};
