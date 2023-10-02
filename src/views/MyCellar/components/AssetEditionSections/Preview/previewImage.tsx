import React from 'react';

const PreviewImage = () => {
  return (
    <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
      <img
        src="https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg"
        alt="Two each of gray, white, and black shirts arranged on table."
        className="object-cover object-center"
      />
    </div>
  );
};

export default PreviewImage;
