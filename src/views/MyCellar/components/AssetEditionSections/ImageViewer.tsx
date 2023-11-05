/* eslint-disable @typescript-eslint/no-use-before-define */
import ImageComp from 'components/ImageUploader/components/imageComp';
import { MiscModal } from 'components/Misc';
import React, { FC, useEffect, useState } from 'react';
import { EventArgs, EventTypes } from 'types';
import { classNames } from 'utils';

const CONTROL_SLIDE_INDEX = 1;
const [IMAGE_WIDTH, IMAGE_HEIGHT] = [250, 250];
interface ImageSourceType {
  url: string;
}

const imageSourcesX = [
  {
    url: 'https://randomwordgenerator.com/img/picture-generator/52e4d7434f51a914f1dc8460962e33791c3ad6e04e5074417d2c7ed09f4acc_640.jpg',
  },
  {
    url: 'https://randomwordgenerator.com/img/picture-generator/55e8d146425bb10ff3d8992cc12c30771037dbf852547848702a7fd19545_640.jpg',
  },
  {
    url: 'https://randomwordgenerator.com/img/picture-generator/55e8d24b4257ac14f1dc8460962e33791c3ad6e04e507440752972d3924cc6_640.jpg',
  },
  {
    url: 'https://randomwordgenerator.com/img/picture-generator/55e0d44b4b56a414f1dc8460962e33791c3ad6e04e5074417c2d78d2954bcd_640.jpg',
  },
];

interface SlideType {
  id: string;
  display: string;
  src: string;
  description?: string;
  dotClassName?: string;
}

interface ImageViewerProps {
  imageSources?: ImageSourceType[];
}

const ImageViewer: FC<ImageViewerProps> = ({ imageSources }) => {
  //JS to switch slides and replace text in bar//
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [viewState, setViewState] = useState<{ showModal: boolean; data: unknown }>({
    showModal: false,
    data: {},
  });
  const onSaveImage = (src: string) => {
    if (src.length > 0)
      setSlides([
        ...slides,
        {
          id: `slide-${slides.length + 1}`,
          display: 'hidden',
          src: src,
          description: '',
        },
      ]);

    setSlideIndex(slides.length + 1);
    setViewState({ ...viewState, showModal: false });
  };

  const onClose = () => {
    setViewState({ ...viewState, showModal: false });
  };

  //   const showSlides = useCallback(
  //     (sIndex: number) => {
  //       let i;
  //       const slides =
  //       const dots = document.getElementsByClassName('description');
  //       const captionText = document.getElementById('caption');
  //       if (sIndex > slides.length) {
  //         setSlideIndex(1);
  //       }
  //       if (sIndex < 1) {
  //         setSlideIndex(slides.length);
  //       }
  //       console.log('SLIDES', sIndex);

  //       for (i = 0; i < slides.length; i++) {
  //         (slides[i] as HTMLElement).style.display = 'none';
  //       }
  //       for (i = 0; i < dots.length; i++) {
  //         dots[i].className = dots[i].className.replace(' opacity-100', '');
  //       }
  //       (slides[slideIndex - 1] as HTMLElement).style.display = 'block';
  //       dots[slideIndex - 1].className += ' opacity-100';
  //       //(captionText as HTMLElement).innerHTML = (dots[slideIndex - 1] as any).alt;
  //       // eslint-disable-next-line react-hooks/exhaustive-deps
  //     },
  //     [slideIndex],
  //   );

  const plusSlides = (n: number) => {
    setSlideIndex(slideIndex + n);
  };

  const onCTA: EventArgs['onCTA'] = (eventType, data) => {
    switch (eventType) {
      case EventTypes.NEW:
        setViewState({ ...viewState, showModal: true, data: '' });
        break;
      case EventTypes.DELETE:
        const argDelete = data as number;
        setSlides(slides.filter((_, i) => i !== argDelete - 1));
        setSlideIndex(slides.length - 1);

        break;
      case EventTypes.EDIT:
        console.log('EDIT', slides, slideIndex);
        setViewState({ ...viewState, showModal: true, data: slides[slideIndex - 1].src });
        break;
      case EventTypes.CANCEL:
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (imageSources && imageSources.length > 0) {
      setSlides(
        (imageSources || []).map((imgSrc, i) => {
          return {
            id: `slide-${i}`,
            display: i === 0 ? 'block' : 'hidden',
            src: imgSrc.url,
            description: 'description',
          };
        }),
      );
      setSlideIndex(1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSources]);

  useEffect(
    () => {
      console.log('SLIDES', slideIndex);
      if (slideIndex > slides.length) {
        setSlideIndex(1);

        return;
      }
      if (slideIndex < 1) {
        setSlideIndex(slides.length);
        return;
      }

      setSlides(
        slides.map((slide, i) => {
          return {
            ...slide,
            display: i === slideIndex - 1 ? 'block' : 'hidden',
            dotClassName: i === slideIndex - 1 ? 'opacity-100' : '',
          };
        }),
      );
      //(captionText as HTMLElement).innerHTML = (dots[slideIndex - 1] as any).alt;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slideIndex],
  );

  return (
    <>
      <div className=" w-full flex">
        {(!slides || slides.length === 0) && (
          <section className=" max-w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center p-5 w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div
                className="flex flex-col items-center justify-center pt-5 pb-6"
                onClick={() => onCTA(EventTypes.NEW)}
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Open image editor</span>
                </p>
              </div>
            </label>
          </section>
        )}
        {slides && slides.length > 0 && (
          <section className=" max-w-full relative">
            <h2 className="text-4xl text-center tracking-wide font-extrabold font-serif leading-loose mb-2">
              Slideshow Gallery
            </h2>
            <div className="shadow-2xl relative">
              {/* <!-- large image on slides --> */}
              {slides.map((imgSrc, i) => {
                return (
                  <div key={i} className={classNames(imgSrc.display)}>
                    <div className={`w-full aspect-h-1 h-full`}>
                      <img
                        className={classNames(`h-[${IMAGE_HEIGHT}px] w-full`)}
                        style={{
                          objectFit: 'contain',
                        }}
                        src={`${imgSrc.src}`}
                        alt={imgSrc.description}
                      />
                    </div>
                    {/* <DeleteModal onCTA={onCTA} data={{ ref: 'delete-modal', value: i }} /> */}
                  </div>
                );
              })}

              {/* <!-- butttons --> */}
              {slides.length > 1 && (
                <>
                  <a
                    className={classNames(
                      `absolute left-0 inset-y-0 flex items-center h-[${IMAGE_HEIGHT}px] px-4 text-white hover:text-gray-800 cursor-pointer text-3xl font-extrabold`,
                    )}
                    onClick={() => plusSlides(-1)}
                  >
                    ❮
                  </a>
                  <a
                    className={classNames(
                      `absolute right-0 inset-y-0 flex items-center h-[${IMAGE_HEIGHT}px] px-4 text-white hover:text-gray-800 cursor-pointer text-3xl font-extrabold`,
                    )}
                    onClick={() => plusSlides(1)}
                  >
                    ❯
                  </a>
                </>
              )}

              {/* <!-- image description --> */}
              {/* <div className="text-center text-white font-light tracking-wider bg-gray-800 py-2">
          <p id="caption"></p>
        </div> */}
              <div className="text-center text-white font-light tracking-wider bg-gray-800 py-2">
                <ul className="flex divide-x divide-solid text-sm items-center justify-center">
                  <li className="underline cursor-pointer px-2" onClick={() => onCTA(EventTypes.DELETE, slideIndex)}>
                    <span>delete </span>
                  </li>

                  <li className="underline cursor-pointer px-2" onClick={() => onCTA(EventTypes.EDIT)}>
                    <span>edit </span>
                  </li>
                </ul>
              </div>

              {/* <!-- smaller images under description --> */}
              <div className="flex">
                <div
                  onClick={() => onCTA(EventTypes.NEW)}
                  className=" bg-orange flex justify-center items-center description w-[50px] h-[35px] opacity-50 hover:opacity-100 cursor-pointer "
                >
                  <span className="text-sm">New</span>
                </div>
                <div className="flex w-full flex-1 justify-center">
                  {slides &&
                    slides.length > 0 &&
                    slides.map((imageSource, imgIndex) => {
                      return (
                        <div key={`${imageSource.id}-dot`} onClick={() => setSlideIndex(imgIndex + 1)}>
                          <img
                            className={classNames(
                              'h-[35px] opacity-50 hover:opacity-100 cursor-pointer',
                              imageSource.dotClassName ?? '',
                            )}
                            src={imageSource.src}
                            alt={imageSource.description}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {viewState.showModal && (
        <MiscModal>
          <div className="w-full h-[calc(100vh-30vh)] flex border border-red border-1">
            {/* <ImageUploader
              imageHeight={IMAGE_HEIGHT}
              onSaveImage={onSaveImage}
              imageData={viewState.data as string}
              onClose={onClose}
            /> */}
            <ImageComp imageData={viewState.data as string} onClose={onClose} onSaveImage={onSaveImage} />
          </div>
        </MiscModal>
      )}
    </>
  );
};

export default ImageViewer;

interface DeleteModalProps {
  onCTA: EventArgs['onCTA'];
  data: unknown;
}
const DeleteModal: FC<DeleteModalProps> = ({ onCTA, data }) => {
  return (
    <div
      id="deleteModal"
      tabIndex={-1}
      aria-hidden="true"
      className="absolute overflow-y-auto overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto top-[calc(50%-100px)]">
        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <button
            type="button"
            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="deleteModal"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <svg
            className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => onCTA(EventTypes.CANCEL, data)}
              data-modal-toggle="deleteModal"
              type="button"
              className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
            <button
              onClick={() => onCTA(EventTypes.DELETE, data)}
              type="submit"
              className="py-2 px-3 bg-vine text-sm font-medium text-center  rounded-lg  text-white focus:outline-none  "
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
