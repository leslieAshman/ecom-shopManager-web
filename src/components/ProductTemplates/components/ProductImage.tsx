import { FC, ReactNode } from 'react';
import { getRegionColors } from '../../../helpers';
import { classNames } from '../../../utils';

const defaultBgColor = '#F4F4F4';
interface ProductImageProps {
  bgColor?: string;
  imageUrl: string;
  region?: string;
  textColor?: string;
  children?: ReactNode;
  imageContainer?: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductImage: FC<ProductImageProps> = ({
  bgColor,
  imageUrl,
  region,
  textColor,
  children,
  imageContainer = '',
}) => {
  const txtColor = textColor || getRegionColors(region).textColor;

  return (
    <div className="relative">
      <div
        className={` overflow-hidden flex flex-col  justify-center items-center`}
        style={{
          background: defaultBgColor,
          height: '264px',
        }}
      >
        {!children && imageUrl && imageUrl.length > 0 && (
          <div className="w-full relative left-0 flex flex-col h-100  items-center">
            <div className={classNames(' relative h-[264px] img-container', `${imageContainer}`.trim())}>
              <img src={imageUrl} alt="product" className="bg-transparent object-cover img" />
            </div>
          </div>
        )}
        {children && (
          <div className="w-full relative left-0 flex flex-col h-100  items-start">
            <div className=" relative, min-w-[375px] h-[264px] flex-1">{children}</div>
          </div>
        )}
        {!children && (!imageUrl || imageUrl.length === 0) && (
          <div className="w-full relative left-0 flex flex-col h-100  items-start">
            <div className=" relative min-w-[375px] h-[264px] flex-1"></div>
          </div>
        )}
        {region && (
          <div
            className={`px-3 h-5 border absolute top-3 right-3 flex rounded-full text-sm justify-center whitespace-nowrap items-center ${
              txtColor || ''
            }`.trim()}
            style={{ background: bgColor || 'transparent' }}
          >
            {region}
          </div>
        )}
      </div>
      <div className="w-full h-[15px]" style={{ background: bgColor || '' }}></div>
    </div>
  );
};

export default ProductImage;
