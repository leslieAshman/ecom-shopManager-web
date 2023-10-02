import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FlatList from '.';
import { ObjectType } from 'types/commonTypes';

const meta: Meta<typeof FlatList> = {
  title: 'FlatList',
  component: FlatList,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof FlatList>;

const data = [...Array(100).keys()].map((z) => ({
  id: z,
}));

const itemRendered = (dataItem: ObjectType, index: number) => {
  return (
    <div className="border w-[250px] border-gray-200 p-[50px] flex justify-center items-center text-md">{`${dataItem.id}`}</div>
  );
};

export const Default: Story = {
  args: {
    data,
    itemRendered,
    containerClassName: ' w-1/2 h-[450px] overflow-auto',
  },
};
