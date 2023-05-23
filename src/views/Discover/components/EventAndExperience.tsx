import moment from 'moment';
import { FC } from 'react';
import { LocationIcon } from '../../../assets/icons';
import ImageCard from '../../../components/ProductTemplates/components/ImageCard';
import { currencyFormatter } from '../../../utils';

import { EventAndExperienceType } from '../type';

const dateFormat = 'DD MMM YYYY';

interface EventAndExperienceProp {
  onItemSelect?: (id: string) => void;
  id: string;
  item: EventAndExperienceType;
}

const EventAndExperience: FC<EventAndExperienceProp> = ({ onItemSelect, id, item }) => {
  const onSelectItem = () => {
    if (onItemSelect) onItemSelect(id);
  };

  const { title, price, dateTime, priceCurrency, locationShort: location, mainImage } = item;
  const momentDate = moment(dateTime);
  const image = <img className="img" alt={title} src={mainImage} />;
  const imageClassName = '';
  return (
    <ImageCard
      key={id}
      id={id}
      isApplyDefaulImageClassname={false}
      imageClassName={imageClassName}
      image={image}
      onClick={() => onSelectItem()}
    >
      <div className="flex-1 w-full ">
        <div className="relative space-y-[4px] flex flex-col border-none ">
          <div className="text-20">{title}</div>
        </div>
        <div className="relative space-y-[4px] mt-3 flex flex-col border-none">
          <h1 className="text-20 whitespace-nowrap truncate">
            {currencyFormatter('en-GB', priceCurrency).format(price)}
          </h1>
          <div className="flex divide-x divide-x-gray-100">
            <div className="text-sm whitespace-nowrap truncate pr-2">{momentDate.format(dateFormat)}</div>
            <div className="text-sm whitespace-nowrap truncate pl-2">{momentDate.format('hh:mm A')}</div>
          </div>
        </div>
      </div>
      <div className="text-sm flex w-full ">
        <div className="mr-3 flex  flex-1 text-xs">
          <LocationIcon className="mr-1 " />
          {location}
        </div>
      </div>
    </ImageCard>
  );
};

export default EventAndExperience;
