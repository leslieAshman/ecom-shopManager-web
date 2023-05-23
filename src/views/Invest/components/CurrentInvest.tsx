import { FC, useLayoutEffect, useMemo, useState } from 'react';
import { useGetInvestOffers } from '../hooks/useGetInvestOffers';
import InvestPromotion, { InvestOfferProps } from './InvestPromotion';
import moment from 'moment';
import { InvestOffer } from '../types';
import { sortItems } from '../../../utils';

interface CurrentInvestProps {
  onItemSelect: InvestOfferProps['onItemSelect'];
  refetchTimestamp: number;
}

const CurrentInvest: FC<CurrentInvestProps> = ({ onItemSelect, refetchTimestamp }) => {
  const { offers, loading, refetch } = useGetInvestOffers('current');
  const [timestamp, setTimestamp] = useState(refetchTimestamp);
  useLayoutEffect(() => {
    if (timestamp !== refetchTimestamp) {
      refetch();
      setTimestamp(refetchTimestamp);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchTimestamp]);

  const currentOffers = useMemo(() => {
    return sortItems(
      offers.map((x: InvestOffer) => ({
        ...x,
        date: moment(x.expiryDate).toDate().getTime(),
      })),
      true,
      'date',
    );
  }, [offers]);

  return <InvestPromotion offers={currentOffers} onItemSelect={onItemSelect} loading={loading} />;
};

export default CurrentInvest;
