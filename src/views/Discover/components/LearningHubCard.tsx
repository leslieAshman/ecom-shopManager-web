import { FC } from 'react';
import { Button } from '../../../components';
import ImageCard from '../../../components/ProductTemplates/components/ImageCard';
import { LearningHubType } from '../type';
import { useTranslation } from 'react-i18next';

interface LearningHubCardProp {
  onItemSelect?: (id: string) => void;
  id: string;
  item: LearningHubType;
}

const LearningHubCard: FC<LearningHubCardProp> = ({ onItemSelect, id, item }) => {
  const { t } = useTranslation();
  const onSelectItem = () => {
    if (onItemSelect) onItemSelect(id);
  };
  const { title, mainImage } = item;
  const image = <img className="min-w-full shrink-0 object-cover  min-h-full" alt={title} src={mainImage} />;

  return (
    <ImageCard key={id} id={id} image={image} onClick={() => onSelectItem()}>
      <div className="flex-1 w-full overflow-hidden ">
        <div className="relative space-y-[4px] flex flex-col border-none ">
          <div className="text-16 mb-2">{title}</div>
          {/* <div className="text-14 h-[80px] line-clamp-3" dangerouslySetInnerHTML={{ __html: description }} /> */}
        </div>
      </div>
      <div className="text-sm flex w-full mt-5">
        <Button isLink={true} className="mr-3 flex w-full flex-1 text-14 items-end justify-end">
          <span> {t('discover:texts.read-more')}</span>
        </Button>
      </div>
    </ImageCard>
  );
};

export default LearningHubCard;
