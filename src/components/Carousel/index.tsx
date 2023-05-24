/* eslint-disable @typescript-eslint/naming-convention */
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './Carousel.css';

export interface CarouselEvent {
  prevClick: () => void;
  nextClick: () => void;
  [key: string]: unknown;
}

const slideWidth = 300;
//const length = _items.length;
const createItem = (
  position: number,
  idx: number,
  activeIdx: number,
  itemsCount: number,
  slideItem: Record<string, unknown>,
) => {
  const item = {
    styles: {
      transform: `translateX(${position * slideWidth}px)`,
      width: `${slideWidth}px`,
    },
  };

  switch (position) {
    case itemsCount - 1:
    case itemsCount + 1:
      //   item.styles = { ...item.styles, filter: 'grayscale(1)' };
      item.styles = { ...item.styles };
      break;
    case itemsCount:
      break;
    default:
      //   item.styles = { ...item.styles, opacity: 0 };
      item.styles = { ...item.styles };
      break;
  }

  return { ...item, item: slideItem };
};
const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface TranslatedItem {
  item: Record<string, unknown>;
  styles?: {
    transform: string;
  };
  [key: string]: unknown;
}

export interface CarouselState {
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  id: string;
}

export interface CarouselRenderItem {
  index: number;
  pos: number;
  activeIdx: number;
  translatedItem: TranslatedItem;
}

export interface CarouselProps {
  renderItem: ({ index, pos, activeIdx, translatedItem }: CarouselRenderItem) => ReactNode;
  slideItems: Record<string, unknown>[];
  showRightButton?: boolean;
  showLeftButton?: boolean;
  id: string;
  onCarouselStateUpdate?: (args: CarouselState) => void;
}

const Carousel = forwardRef(
  (
    { id, renderItem, slideItems, onCarouselStateUpdate, showLeftButton = true, showRightButton = true }: CarouselProps,
    ref,
  ) => {
    const sliderRef = useRef<HTMLUListElement | null>(null);
    const [_items, setSlideItems] = useState([...slideItems]);
    // _items.push(..._items);
    const keys = Array.from(Array(_items.length).keys());
    const [sliderMargin, setSliderMargin] = useState(0);
    const [items] = useState(keys);
    const [isTicking, setIsTicking] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(false);

    const itemsCount = slideItems.length;

    const updateControls = (nextMargin: number, prevMargin: number) => {
      const upperLimit = (slideItems.length - 1) * slideWidth;
      const disablePrev = prevMargin < 0;
      const disableNext = Math.abs(nextMargin) >= upperLimit;
      setIsNextDisabled(disableNext);
      setIsPrevDisabled(disablePrev);
      if (onCarouselStateUpdate)
        onCarouselStateUpdate({
          isNextDisabled: disableNext,
          isPrevDisabled: disablePrev,
          id,
        });
    };

    const prevClick = (jump = 1) => {
      if (!isTicking) {
        setIsTicking(true);
        const margin = Math.abs(sliderMargin) - Math.abs(slideWidth * jump);
        updateControls(margin, margin - slideWidth);

        if (sliderMargin !== 0) {
          setSliderMargin(0 - margin);
        }
      }
    };

    const nextClick = (jump = 1) => {
      if (!isTicking) {
        setIsTicking(true);
        const margin = Math.abs(sliderMargin) + Math.abs(slideWidth * jump);
        updateControls(margin, margin - slideWidth);

        if (Math.abs(sliderMargin) < (slideItems.length - 1) * slideWidth) {
          setSliderMargin(0 - margin);
        }
      }
    };

    // as the second argument
    useImperativeHandle(ref, () => ({
      prevClick,
      nextClick,
    }));

    const handleDotClick = (idx: number) => {
      if (idx < activeIdx) prevClick(activeIdx - idx);
      if (idx > activeIdx) nextClick(idx - activeIdx);
    };

    useEffect(() => {
      if (isTicking) sleep(300).then(() => setIsTicking(false));
    }, [isTicking]);

    useEffect(() => {
      setActiveIdx(Math.abs(sliderMargin / slideWidth));
    }, [sliderMargin]);

    useEffect(() => {
      setSlideItems(slideItems);
    }, [slideItems]);
    useEffect(() => {
      if (onCarouselStateUpdate)
        onCarouselStateUpdate({
          isNextDisabled,
          isPrevDisabled,
          id,
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="flex flex-1 h-100 justify-center relative left-[50%] translate-x-[-50%]">
        <div className=" relative w-full px-5 ">
          {showLeftButton && (
            <button
              className="items-center border-0 cursor-pointer flex justify-center absolute left-5 top-[calc(50%-100px)] z-10"
              onClick={() => prevClick()}
            >
              <i className="carousel__btn-arrow carousel__btn-arrow--left  border-gray-200 hover:border-gray-500" />
            </button>
          )}
          <div className="h-full overflow-hidden relative w-full">
            <ul
              style={{ marginLeft: sliderMargin }}
              ref={(x) => (sliderRef.current = x)}
              className="h-full  list-none m-0 p-0 absolute  w-full transition-all duration-700 "
            >
              {items.map((pos, i) => {
                const translatedItem = createItem(pos, i, activeIdx, itemsCount, _items[i]);
                return (
                  <li
                    key={`${i}`}
                    className=" inline-block m-0 absolute  h-full transition-transform duration-700"
                    style={translatedItem.styles}
                  >
                    <div className="h-full mr-3">
                      {renderItem({
                        index: i,
                        pos,
                        activeIdx,
                        translatedItem,
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {showRightButton && (
            <button
              className="items-center border-0 cursor-pointer flex justify-center absolute right-5 top-[calc(50%-100px)] z-10"
              onClick={() => nextClick()}
            >
              <i className="carousel__btn-arrow carousel__btn-arrow--right  border-gray-200 hover:border-gray-500" />
            </button>
          )}
          <div className="carousel__dots -mt-3">
            {items.slice(0, itemsCount).map((pos, i) => (
              <div key={i} onClick={() => handleDotClick(i)} className="py-3 cursor-pointer flex items-center">
                <button className={i === activeIdx ? 'dot active' : 'dot'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

export default Carousel;
