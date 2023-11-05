import { FC, useRef, useState } from 'react';
import ReactCrop, { Crop, ReactCropProps } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImgProps {
  imageToCrop: string;
  croppedImage?: (base64Image: string) => void;
}
type CroppedImage = Pick<ReactCropProps, 'maxHeight' | 'maxWidth'> & Crop;

const CropperImg: FC<ImgProps> = ({ imageToCrop, croppedImage }) => {
  const [crop, setCrop] = useState<CroppedImage>({
    maxHeight: 800,
    maxWidth: 400,
    width: 0,
    height: 0,
    unit: 'px',
    x: 0,
    y: 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef(null);

  const cropImageNow = () => {
    const image = imageRef.current;
    if (!image) return;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx: any = canvas.getContext('2d');

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

    const base64Image = canvas.toDataURL('image/jpeg');
    croppedImage?.(base64Image);
  };

  return (
    <div>
      <div className="border border-red-800 w-96 h-96">
        {' '}
        {imageToCrop && <img ref={imageRef} src={imageToCrop} alt="Selected" className="" />}
      </div>
      <div>
        {imageToCrop && (
          <div>
            <ReactCrop maxHeight={400} maxWidth={400} crop={crop as Crop} className="" onChange={setCrop}>
              <img height={400} alt="image_alt" width={400} src={imageToCrop} className="" />
            </ReactCrop>
            <br />
            <button className="border-2 px-8 py-2 border-blue-800 bg-black text-white" onClick={cropImageNow}>
              Crop Image
            </button>
            <br />
            <br />
          </div>
        )}
      </div>
    </div>
  );
};

export default CropperImg;
