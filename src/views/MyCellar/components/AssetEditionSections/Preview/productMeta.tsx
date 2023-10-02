import React, { FC, useEffect, useState } from 'react';
import { formatter } from 'utils';
interface ProductMetaModelType {
  reviewCount: number;
  price: number;
  isOnPromotion: boolean;
  promotionPrice: number;
  priceMeta?: string[];
  ratings?: number;
  units: number;
}

interface ProductMetaProps {
  modelIn: ProductMetaModelType;
}
const ProductMeta: FC<ProductMetaProps> = ({ modelIn }) => {
  const [model, setModel] = useState<ProductMetaModelType>();

  useEffect(() => {
    setModel(modelIn);
  }, [modelIn]);

  if (!model) return null;
  return (
    <section aria-labelledby="information-heading" className="mt-2">
      <h3 id="information-heading" className="sr-only">
        Product information
      </h3>

      <p className="text-md text-gray-900">{formatter.format(model.price)}</p>

      {/* <!-- Reviews --> */}
      <div className="mt-6">
        <h4 className="sr-only">Reviews</h4>
        <div className="flex items-center">
          <div className="flex items-center">
            {/* <!-- Active: "text-gray-900", Default: "text-gray-200" --> */}
            {Array.from({ length: 5 }, (x, i) => {
              return (
                <svg
                  key={i}
                  className={`${i < (model?.ratings || 0) ? 'text-gray-900' : 'text-gray-200'} h-5 w-5 flex-shrink-0`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              );
            })}
          </div>
          <p className="sr-only">{`${model?.ratings || 0} out of 5 stars}`}</p>
          <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
            {model.reviewCount} reviews
          </a>
        </div>
      </div>
      <div className="mt-3">
        {[`In stock ${model.units}`, ...(model.priceMeta || [])].map((x, i) => (
          <div key={`${i}`} className="flex flex-row mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="w-[20px] text-green mr-2"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-14">{x}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductMeta;
