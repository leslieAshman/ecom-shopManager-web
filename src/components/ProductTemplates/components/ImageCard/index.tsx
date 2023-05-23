import { forwardRef, ReactNode } from 'react';
import { classNames } from '../../../../utils';
interface ImageCardProps {
  id: string;
  image: ReactNode;
  onClick: (id: string) => void;
  children: ReactNode;
  className?: string;
  imageClassName?: string;
  isApplyDefaulImageClassname?: boolean;
}

const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  (
    {
      image,
      id,
      onClick,
      children,
      className,
      isApplyDefaulImageClassname = true,
      imageClassName = '',
    }: ImageCardProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const onItemSelect = () => {
      if (onClick) {
        onClick(id);
      }
    };
    //? ' relative w-[128px] h-[128px] top-[calc(50%-64px)] overflow-hidden left-[calc(50%-64px)] flex justify-center items-center'
    const defaultImageClassname = isApplyDefaulImageClassname
      ? ' relative  overflow-hidden flex justify-center items-center'
      : '';
    return (
      <div
        ref={ref}
        onClick={onItemSelect}
        key={id}
        className={classNames(
          `flex cursor-pointer  flex-col h-[365px] relative overflow-hidden p-3 space-y-5 items-start bg-white border border-gray-100 rounded-md`,
          className || '',
        )}
      >
        <div className="relative bg-[#f0ebe6] h-[164px] border-none self-stretch flex">
          <div className={classNames(defaultImageClassname, imageClassName)}>{image}</div>
        </div>
        {children}
      </div>
    );
  },
);

export default ImageCard;
