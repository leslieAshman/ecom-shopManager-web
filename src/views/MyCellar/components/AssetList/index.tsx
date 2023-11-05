/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/

import React, { FC, forwardRef } from 'react';
import { getRange, pickRandom } from 'utils';
import { AssetTypeSummary } from '../types';
import { EventArgs, EventTypes } from 'types';

const images = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },

  // More products...
];

interface AssetListProps {
  items: AssetTypeSummary[];
  onCTA?: EventArgs['onCTA'];
}

const AssetList: FC<AssetListProps> = ({ items, onCTA }) => {
  console.log('items', items);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="flex w-full  px-3 py-3">
          <div className="flex-1"></div>
          <span className="text-sm cursor-pointer" onClick={() => onCTA?.(EventTypes.NEW)}>
            New Item<span aria-hidden="true"> →</span>
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {items.map((item, index) => {
            // let lastElemRefOption = { ref: isItemVisible };
            // if (results.length === index + 1) {
            //   lastElemRefOption = { ref: lastItemRef };
            // }

            const { title, price, serviceId } = item;
            const id = `${item.id}-${index}`;
            const name = `${item.title}`;
            // const qtyString = `${item.ecommerceInfo?.units}`;

            const regionColor = undefined;
            const textColor = `text-black`;

            const itemImage = 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg';
            const imagex = (
              <div className="h-[130px]">
                <img className="img h-full" alt={name} src={itemImage} />
              </div>
            );
            return (
              <a key={id} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={itemImage}
                    alt={title}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="mt-2 text-sm text-gray-700 flex-1">{name}</h3>
                  <p className="flex divide-x-2 items-center">
                    <span className="mt-1  px-1 text-14 font-medium text-gray-900">{item.price}</span>
                    <span className="pl-1 text-sm">15 items</span>
                  </p>

                  <ul className="flex space-x-2 text-sm">
                    <li className="underline cursor-pointer" onClick={() => onCTA?.(EventTypes.DELETE, serviceId)}>
                      <span>delete </span>
                    </li>
                    <li className="underline cursor-pointer" onClick={() => onCTA?.(EventTypes.PREVIEW, item)}>
                      <span className="">preview</span>
                    </li>
                    <li className="underline cursor-pointer" onClick={() => onCTA?.(EventTypes.EDIT, item)}>
                      <span>edit </span>
                    </li>
                  </ul>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssetList;
