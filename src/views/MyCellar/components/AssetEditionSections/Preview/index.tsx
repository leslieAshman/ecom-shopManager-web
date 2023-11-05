/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { FC } from 'react';
import Preview1, { PreviewProps, PreviewType } from './preview1';
import { EditVariationModelType } from '../editVariation';
import { EventArgs } from 'types';
import moment from 'moment';

const Preview: FC<PreviewProps> = ({ onCTA, modelIn }) => {
  console.log('Previewdsd', modelIn);
  return (
    <div className="flex w-full h-full bg-red ">
      <Preview1 modelIn={modelIn} onCTA={onCTA} type={PreviewType} />
    </div>
  );
};

export default Preview;

export interface PreviewModelType {
  title: string;
  price: number;
  units: number;
  description?: string;
  isOnPromotion: boolean;
  promotionPrice: number;
  priceMeta?: string[];
  pic?: { createdDate: string; pic: { image?: string | undefined } };
  reviewCount: number;
  ratings?: number;
  variations?: EditVariationModelType[];
}

export const mockPreviewModel = {
  title: 'Basic Tee 6-Pack',
  price: 192,
  qty: 10,
  isOnPromotion: true,
  promotionPrice: 100,
  priceMeta: ['per shirt'],
  ratings: 4,
  pic: {
    image: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg',
  },
  reviewCount: 10,
  variations: [
    {
      id: '123',
      name: 'color',
      options: [
        {
          id: '123',
          label: 'red',
          displayText: 'red',
          price: 23.24,
          qty: 5,
          isDefault: true,
          isVisible: true,
        },
        {
          id: '1234',
          label: 'black',
          displayText: 'black',
          price: 26.24,
          qty: 5,
          isDefault: true,
          isVisible: true,
        },
      ],
      units: 5,
      price: 23.24,
      modelType: 'color',
    },
    {
      id: '980',
      name: 'material',
      options: [
        {
          id: '34',
          label: 'Glass',
          displayText: 'Glass',
          price: 23.24,
          qty: 5,
          isDefault: true,
          isVisible: true,
        },
      ],
      units: 5,
      price: 83.24,
      modelType: 'color',
    },
  ],
};

export const mockPreviewModel2 = {
  title: 'T-shirt',
  type: 'Physical',
  description:
    "What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  price: 10,
  priceMeta: ['vat included'],
  units: 10,
  variations: [
    {
      id: '_c1e0f4d5-8dd9-4d9d-a789-76ca929516a1',
      name: 'Color',
      options: [
        {
          id: '_463711f9-500e-4ae6-a0f4-9b0355a2149a',
          label: 'Black',
          displayText: 'Black ',
          price: 0,
          qty: 2,
          isDefault: true,
          isVisible: true,
        },
        {
          id: '_3b185f11-b075-4c98-a23b-00aa349dbebb',
          label: 'Gold',
          displayText: 'Gold +£3.00',
          price: 3,
          qty: 2,
          isDefault: false,
          isVisible: true,
        },
        {
          id: '_4b148c2d-613f-47e5-a0a6-83902ca7bfbe',
          label: 'silver',
          displayText: 'silver +£2.00',
          price: 2,
          qty: 2,
          isDefault: false,
          isVisible: true,
        },
      ],
      units: 10,
      price: 10,
      modelType: 'variation',
    },
  ],
  hashTags: ['fahion', 'clothes'],
  reviewCount: 0,
  isOnPromotion: false,
  promotionPrice: 0,
  pic: {
    createdDate: moment().format(),
    pic: { image: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg' },
  },
};
