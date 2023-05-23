import { FC } from 'react';
import { Button } from '.';

interface BitSelectorProp {
  isTrue: boolean;
  onClick: (isTrue: boolean) => void;
  leftText: string;
  rightText: string;
  title?: string;
}

const BitSelector: FC<BitSelectorProp> = ({ isTrue, onClick, leftText, rightText, title }) => {
  const defaultClassName = 'btn w-fit h-[26px] text-14 whitespace-nowrap mr-3';
  const selectedClassName = 'btn-primary text-white';
  const deSelectedClassName = 'outline outline-black text-black';

  return (
    <div className="py-5 px-3">
      {title && <span className="my-3">{title}</span>}
      <div className="flex mt-5">
        <Button
          onClick={() => onClick(true)}
          className={`${defaultClassName} ${isTrue ? selectedClassName : deSelectedClassName}`}
        >
          {leftText}
        </Button>
        <Button
          onClick={() => onClick(false)}
          className={`${defaultClassName} ${!isTrue ? selectedClassName : deSelectedClassName}`}
        >
          {rightText}
        </Button>
      </div>
    </div>
  );
};

export default BitSelector;
