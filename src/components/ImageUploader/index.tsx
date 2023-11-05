import React, { FC, useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { Crop } from 'react-image-crop';

const [MAX_WIDTH, MAX_HEIGHT] = [400, 400];
interface ImageUploaderProps {
  onSaveImage?: (image: string) => void;
  onClose?: () => void;
  imageData?: string;
  imageWidth?: number;
  imageHeight?: number;
}
const ImageUploader: FC<ImageUploaderProps> = ({
  onSaveImage,
  onClose,
  imageData,
  imageWidth = MAX_WIDTH,
  imageHeight = MAX_HEIGHT,
}) => {
  //useState
  const [imageSrc, setImageSrc] = useState<string>('');
  const [rotateValue, setRotateValue] = useState<number>(0);
  // const [saveImage, setSaveImage] = useState<string>("");
  const [output, setOutput] = useState<undefined | string>(undefined);
  const [rotateOutput, setRotateOutput] = useState<undefined | string>();
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 400,
    height: 200,
    x: 0,
    y: 0,
  });

  //useRef
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef(null);
  const uploadBtnRef = useRef<HTMLInputElement>(null);

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImg = e.target.files?.[0];

    if (selectedImg) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        if (evt.target) {
          const dataUrl = evt.target.result as string;
          setImageSrc(dataUrl);
        }
      };
      reader.readAsDataURL(selectedImg);
    }
  };

  const rotateCanvas = (canvas: HTMLCanvasElement, rotateValueIn: number) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const { width, height } = canvas;
      ctx.save();
      ctx.translate(crop.width / 2, crop.height / 2);
      ctx.rotate((Math.PI / 180) * rotateValueIn);
      ctx.drawImage(canvas, -width / 2, -height / 2);
    }
  };

  const cropImage = (canvas: HTMLCanvasElement, image: HTMLImageElement | null) => {
    if (!image) return; //if image is falsy the function wont run any further, if image is not available
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
    }
  };

  const getBase64Image = (img: HTMLImageElement | null) => {
    const canvas = document.createElement('canvas');
    if (!img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
    //dataURL.replace(/^data:image\/?[A-z]*;base64,/);
  };

  const handleSaveImage = () => {
    if (imageSrc) {
      const canvas = document.createElement('canvas');
      const image = imageRef.current;
      console.log('IMAGE', image);
      const base64 = getBase64Image(image);
      console.log('IMAGE', base64);
      cropImage(canvas, image);
      rotateCanvas(canvas, rotateValue);
      const base64Image: string = canvas.toDataURL('image/jpeg');
      setOutput(base64Image);
      onSaveImage?.(base64Image);
    }

    setRotateValue(0);
  };

  const onChooseImage = () => {
    uploadBtnRef.current?.click();
  };

  useEffect(() => {
    if (imageData && imageData !== imageSrc) setImageSrc(imageData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]);

  return (
    <div className="flex flex-col p-5 items-center flex-1  w-full h-full">
      <input
        hidden
        className="font-semibold "
        type="file"
        id="imgFile"
        accept="image/*"
        onChange={handleFileChange}
        ref={uploadBtnRef}
      />

      <div
        className={`relative w-[${imageWidth}px] h-[${imageHeight}px] bg-gray-100 overflow-hidden rounded-md  border border-red max-w-sm transition-all duration-300 cursor-pointer `}
      >
        {imageSrc && (
          <div>
            <ReactCrop
              maxHeight={imageHeight}
              maxWidth={imageWidth}
              crop={crop}
              className=""
              onChange={handleCropChange}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Selected"
                className=""
                height={imageHeight}
                width={imageWidth}
                style={{ transform: `rotate(${rotateValue}deg)` }}
              />
            </ReactCrop>
          </div>
        )}
        <div className="h-[250px] w-[250px]">
          {output && (
            <img ref={canvasRef} src={output} style={{ width: '100%', height: '100%' }} className="object-cover" />
          )}
        </div>
      </div>

      {/* <div className=" ">
          <div>
            <p className="font-medium text-lg mb-4 ">Saved Image:</p>
            <img src={output} />
          </div>
        </div> */}

      <div className="border border-red-700 space-x-2 py-4">
        <button
          className="px-8 py-2 font-medium rounded-3xl outline-4 hover:bg-gray-700 bg-blue-700 text-white"
          onClick={onChooseImage}
        >
          upload
        </button>
        <button
          className="px-8 py-2 font-medium rounded-3xl outline-4 hover:bg-gray-700 bg-blue-700 text-white"
          onClick={() => setRotateValue(rotateValue + 90)}
        >
          Rotate Right
        </button>
        <button
          className="px-8 py-2 font-medium rounded-3xl outline-4 hover:bg-gray-700 bg-blue-700 text-white"
          onClick={() => setRotateValue(rotateValue - 90)}
        >
          Rotate Left
        </button>
        <button
          className=" px-8 py-2 font-medium rounded-3xl outline-4 hover:bg-gray-700 bg-blue-700 text-white"
          onClick={() => handleSaveImage()}
        >
          Save Image
        </button>

        <button
          className=" px-8 py-2 font-medium rounded-3xl outline-4 hover:bg-gray-700 bg-blue-700 text-white"
          onClick={() => onClose?.()}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
