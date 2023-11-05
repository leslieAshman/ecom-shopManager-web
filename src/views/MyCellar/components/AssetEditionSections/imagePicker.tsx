import { Plus } from 'assets/icons';
import { Button } from 'components';
import ImageUploader from 'components/ImageUploader';
import { MiscModal } from 'components/Misc';
import React, { useState } from 'react';

const ImagePicker = () => {
  //   const isImgPresent = Boolean(
  //     informationModel.pic &&
  //       informationModel?.pic?.pic &&
  //       informationModel?.pic?.pic?.image &&
  //       informationModel?.pic?.pic?.image.length > 0,
  //   );
  const [images, setImages] = useState<string[]>([]);
  const [viewState, setViewState] = useState({
    showModal: false,
  });
  const onSaveImage = (src: string) => {
    if (src.length > 0) setImages([...images, src]);
    setViewState({ ...viewState, showModal: false });
  };
  const onNewImage = () => {
    setViewState({ ...viewState, showModal: true });
  };

  const onClose = () => {
    setViewState({ ...viewState, showModal: false });
  };

  console.log(images);

  return (
    <div>
      <div
        className=" w-full flex flex-1 mb-3 mr-2 space-x-3 flex-wrap "
        style={{
          height: '220px',
        }}
      >
        <div
          onClick={onNewImage}
          className="w-[220px] cursor-pointer h-full flex flex-col justify-center items-center overflow-hidden rounded-lg bg-gray-200 "
        >
          {/* <Button isLink={true} onClick={onNewImage} className="flex-1 flex items-center justify-end"> */}
          {/* <div className="text-base h-1/2 w-1/2 border border-3 border-red"> */}
          <Plus className="w-1/2" />
          <span className="text-sm"> Add Image</span>
        </div>

        {images &&
          images?.length > 0 &&
          images.map((savedImage, i) => {
            return (
              <div
                key={i}
                className="flex"
                style={{
                  maxWidth: '220px',
                  maxHeight: '200px',
                }}
              >
                <div className="w-[220px] h-full aspect-h-1 aspect-w-1  overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={savedImage}
                    alt={''}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
              </div>
            );
          })}

        {/* {isImgPresent && <small className="text-xs text-gray-600">Click on image to edit</small>} */}
      </div>
      {viewState.showModal && (
        <MiscModal>
          <div className="w-full h-[calc(100vh-30vh)] flex border border-red border-1">
            <ImageUploader onSaveImage={onSaveImage} onClose={onClose} />
          </div>
        </MiscModal>
      )}
    </div>
  );
};

export default ImagePicker;

{
  /* <div className="aspect-h-1 aspect-w-1 w-[100px] h-[50px] flex justify-center items-center overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
<img
  src={itemImage}
  alt={title}
  className="h-full w-full object-cover object-center group-hover:opacity-75"
/>
<Button isLink={true} onClick={onNewImage} className="flex-1 flex items-center justify-end">
  <Plus />
</Button>
</div> */
}
