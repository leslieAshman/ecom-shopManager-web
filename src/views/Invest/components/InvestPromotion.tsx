import { FC, useCallback, useContext, useMemo } from 'react';
import Loading from '../../../components/Loading/loading';
import ImageCard from '../../../components/ProductTemplates/components/ImageCard';
import Spacer from '../../../components/Spacer';
import { AppContext } from '../../../context/ContextProvider';
import { getRegions } from '../../../helpers';
import { capitalizeFirstLetter, toInternalId } from '../../../utils';
import useFadeInOnScroll from '../../hooks/useFadeInOnScroll';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { InvestOffer } from '../types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import SharedTemplate from '../../../components/ProductTemplates/components/MessageTemplate';
import noResultImage from '../../../assets/images/no_results_image.png';

enum NoResultsTextKeys {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
}
export interface InvestOfferProps {
  offers: InvestOffer[];
  onItemSelect: (offer: InvestOffer) => void;
  loading?: boolean;
}

const InvestPromotion: FC<InvestOfferProps> = ({ offers, onItemSelect, loading = false }) => {
  const { t } = useTranslation();
  const regions = useMemo(() => getRegions(t), [t]);
  const { formatter: currencyFormatter } = useContext(AppContext);
  const { isLoading, results, lastItemRef } = useInfiniteScroll(offers);
  const processIntersectionObserverEntry = useCallback((entry: IntersectionObserverEntry) => {
    entry.target.classList.toggle('flex', entry.isIntersecting);
  }, []);

  const { isItemVisible, fadeOnScrollClassName } = useFadeInOnScroll({ isLoading, processIntersectionObserverEntry });
  return (
    <div className="flex flex-wrap justify-center  h-full w-full gap-[15px] flex-1 overflow-x-hidden bg-gray-100 p-5 sm:p-7 overflow-y-auto">
      {loading && <Loading />}
      {!loading && results.length === 0 && (
        <div className="animate-[fade-in_5s_ease-out] w-full h-full">
          <SharedTemplate
            showButton={false}
            displayTextKeys={NoResultsTextKeys}
            translationKey="common:noResult"
            imageSrc={noResultImage}
            title={() => (
              <div className="flex items-center gap-3">
                <span className="text-20 font-medium ">{t('common:noResult.title')}</span>
              </div>
            )}
          />
        </div>
      )}
      {!loading &&
        results.length > 0 &&
        results.map((item, index) => {
          const {
            id,
            name: title,
            subtitle: subTitle,
            priceGbp: price,
            region,
            unitSize: unit,
            mainImage,
            expiryDate,
          } = item;

          let lastElemRefOption = { ref: isItemVisible };
          if (results.length === index + 1) {
            lastElemRefOption = { ref: lastItemRef };
          }
          const expDate = `${moment(expiryDate).format('YYYY-MM-DD')}`;
          const selectedRegion = regions.find((x) => x.id === toInternalId(region.toLowerCase()));
          const regionColor = selectedRegion?.color;
          const textColor = `text-${selectedRegion?.textColor || 'black'}`;
          const image = (
            <div className="w-[100px]">
              <img className="img h-full" alt={title} src={mainImage} />
            </div>
          );
          return (
            <ImageCard
              {...lastElemRefOption}
              key={`${id}`}
              id={`${id}`}
              image={image}
              onClick={() => onItemSelect(item)}
              className={` w-full sm:w-[300px] text-left ${fadeOnScrollClassName}`}
              imageClassName="w-full"
            >
              <>
                <div className="relative space-y-[4px] flex flex-col border-none w-full">
                  <div className="whitespace-nowrap truncate text-20 w-full sm:w-[300px] pr-5">{title}</div>
                  <p className="text-14 whitespace-nowrap truncate">{subTitle}</p>
                </div>
                <div className="relative space-y-[4px] flex flex-col border-none w-full">
                  <h1 className="text-md whitespace-nowrap truncate">
                    {currencyFormatter.format(Number(price), true)}
                  </h1>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-sm whitespace-nowrap truncate">{unit}</div>
                    <div className="text-sm whitespace-nowrap truncate">{expDate}</div>
                  </div>
                </div>

                <div
                  style={{ background: regionColor! }}
                  className={`flex  justify-center items-center border w-fit px-3 py-[2px] rounded-full h-auto mt-2`}
                >
                  <div className={`w-fit whitespace-nowrap text-center font-semibold text-sm ${textColor}`.trim()}>
                    {capitalizeFirstLetter(region)}
                  </div>
                </div>
              </>
            </ImageCard>
          );
        })}
      <Spacer h="100px" />
    </div>
  );
};

export default InvestPromotion;
