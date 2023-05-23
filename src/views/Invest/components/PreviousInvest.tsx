import { FC, useLayoutEffect, useMemo, useState } from 'react';
import { useGetInvestOffers } from '../hooks/useGetInvestOffers';

import InvestPromotion, { InvestOfferProps } from './InvestPromotion';
import { sortItems } from '../../../utils';
import { InvestOffer } from '../types';
import moment from 'moment';

interface PreviousInvestProps {
  onItemSelect: InvestOfferProps['onItemSelect'];
  refetchTimestamp: number;
}
const PreviousInvest: FC<PreviousInvestProps> = ({ onItemSelect, refetchTimestamp }) => {
  const { offers, loading, refetch } = useGetInvestOffers('previous');
  const [timestamp, setTimestamp] = useState(refetchTimestamp);
  useLayoutEffect(() => {
    if (timestamp !== refetchTimestamp) {
      refetch();
      setTimestamp(refetchTimestamp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchTimestamp]);

  const previousOffers = useMemo(() => {
    return sortItems(
      offers.map((x: InvestOffer) => ({
        ...x,
        date: moment(x.expiryDate).toDate().getTime(),
      })),
      false,
      'date',
    );
  }, [offers]);

  return <InvestPromotion offers={previousOffers} onItemSelect={onItemSelect} loading={loading} />;
};

export default PreviousInvest;
