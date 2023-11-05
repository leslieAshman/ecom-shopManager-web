import React, { useState, useRef, FC, useEffect } from 'react';

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';
import 'react-image-crop/dist/ReactCrop.css';

const inputClassName = 'rounded text-sm text-right w-12  text-gray-900 bg-gray-50 border border-s-gray-300';

const SETTINGS = {
  MAX_HEIGHT: 400,
  MAX_WIDTH: 400,
  MIN_HEIGHT: 200,
  MIN_WIDTH: 200,
};

enum AspectRatioEnum {
  LAND_SCAPE = 16 / 9,
  PORTRAIT = 4 / 3,
}

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

interface ImageCompProps {
  canDownload?: boolean;
  onSaveImage?: (image: string) => void;
  onClose?: () => void;
  imageData?: string;
}

const ImageComp: FC<ImageCompProps> = ({ onSaveImage, onClose, imageData, canDownload = false }) => {
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(AspectRatioEnum.PORTRAIT);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      setSelectedFile(e.target.files[0].name);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
    const ctx: any = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    if (onSaveImage) {
      const base64Image: string = previewCanvas.toDataURL('image/jpeg');
      onSaveImage(base64Image);
    }

    if (!canDownload) return;

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await (offscreen as any)?.convertToBlob({
      type: 'image/png',
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    hiddenAnchorRef.current!.href = blobUrlRef.current;
    hiddenAnchorRef.current!.click();
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(AspectRatioEnum.PORTRAIT);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, AspectRatioEnum.PORTRAIT);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  useEffect(() => {
    if (imageData && imageData !== imgSrc) setImgSrc(imageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  return (
    <div className="w-full flex-col border">
      <div className="items-center justify-around flex w-full border-b border-b-gray-300">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col mx-2 items-center justify-center  cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <svg
            className="w-8 h-8  text-gray-500 dark:text-gray-400"
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
          <input id="dropzone-file" className="hidden" type="file" accept="image/*" onChange={onSelectFile} />
        </label>
        {/* <input type="file" accept="image/*" onChange={onSelectFile} /> */}
        <div>
          <label htmlFor="scale-input" className="mr-1 text-sm font-medium text-gray-900">
            Scale:{' '}
          </label>
          <input
            className={inputClassName}
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input" className="mr-1 text-sm font-medium text-gray-900">
            Rotate:{' '}
          </label>
          <input
            id="rotate-input"
            className={inputClassName}
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-1 text-sm font-medium text-gray-900">Aspect Ratio: </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={aspect !== undefined}
              onClick={handleToggleAspectClick}
              value=""
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none "
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex justify-center w-full py-2">
        <span className="text-gray-400 text-sm">{selectedFile}</span>
      </div>
      <div className="flex w-full mt-3">
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minWidth={SETTINGS.MIN_WIDTH}
            minHeight={SETTINGS.MIN_HEIGHT}
            maxHeight={SETTINGS.MAX_HEIGHT}
            maxWidth={SETTINGS.MAX_WIDTH}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              className={`h-[${SETTINGS.MAX_HEIGHT}px]`}
              src={imgSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        {!!completedCrop && (
          <>
            <div className="mx-3 flex flex-col  items-center  h-full">
              <canvas
                ref={previewCanvasRef}
                style={{
                  background: '#fff',
                  border: '1px solid #EDEDED',
                  objectFit: 'contain',
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
              <button
                onClick={onDownloadCropClick}
                className="flex justify-center bg-gray-700 mt-3 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded items-center"
              >
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>{canDownload ? 'Download' : 'Save'}</span>
              </button>
              <div>
                {/* <button className={btnClassName} onClick={onDownloadCropClick}>Download Crop</button> */}
                <a
                  href="#hidden"
                  ref={hiddenAnchorRef}
                  download
                  style={{
                    position: 'absolute',
                    top: '-200vh',
                    visibility: 'hidden',
                  }}
                >
                  Hidden download
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageComp;
