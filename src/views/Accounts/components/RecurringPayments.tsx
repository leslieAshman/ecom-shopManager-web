import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RadioButton from '../../../components/RadioButton';
import { buildDisplayText, formatter, uniqueItems } from '../../../utils';
import { GET_PAYMENT_CARDS } from '../graphql/getPaymentCards';
import { useExecuteQuery } from '../../hooks/useExecuteQuery';
import {
  ModelKeys,
  OpenSlideoutFnType,
  PaymentCard,
  PaymentSubscription,
  SlideOutPanelViews,
  TopupSlideoutViewType,
} from '../types';
import { AppContext } from '../../../context/ContextProvider';
import { GET_PAYMENT_SUBSCRIPTIONS } from '../graphql/getPaymentSubscriptions';
import Loading from '../../../components/Loading/loading';

enum DisplayTextKeys {
  PAGE_TITLE = 'page-title',
  EDIT = 'common:edit',
  CANCEL = 'common:cancel',
}

function getByValue(map: Map<string, string>, searchValue: string) {
  for (const [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
}

interface ConvertedSubscription {
  title: string;
  description: string;
  data: PaymentSubscription;
}

interface RecurringPaymentsProps {
  openSlideout: OpenSlideoutFnType;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RecurringPayments: FC<RecurringPaymentsProps> = ({ openSlideout }) => {
  const { t } = useTranslation();
  const {
    state: {
      settings: { currency },
      miscellaneous: { frequencyIntervalMap },
    },
  } = useContext(AppContext);
  const displayText = useMemo(
    () => buildDisplayText(Object.values(DisplayTextKeys), 'account:recurringPayments', t),
    [t],
  );
  const containerRef = useRef<HTMLDivElement | null>();
  const [selectedCard, setSelectedCard] = useState('');
  const { results: cardResults, loading: loadingCards } = useExecuteQuery('customerCards', GET_PAYMENT_CARDS, {
    variables: {
      currency,
    },
  });

  const { results: paymentSubscriptions, loading: loadingSubscription } = useExecuteQuery(
    'recurringPayments',
    GET_PAYMENT_SUBSCRIPTIONS,
  );
  const subscriptions: ConvertedSubscription[] = useMemo(
    () =>
      ((paymentSubscriptions || []) as PaymentSubscription[]).map((x) => {
        return {
          title: x.portfolioName,
          description: `${t('account:recurringPayments.subscription_details', {
            amount: formatter.format(x.amount),
            frequency: x.frequency,
          })}`,
          data: { ...x },
        };
      }),
    [paymentSubscriptions, t],
  );

  const cards = useMemo(() => uniqueItems((cardResults || []) as PaymentCard[], 'id'), [cardResults]);

  const onAction = (action: 'EDIT' | 'CANCEL', subscription: ConvertedSubscription) => {
    switch (action) {
      case 'EDIT':
        const { portfolioId, amount, frequency } = subscription.data;
        const frequencyType = getByValue(frequencyIntervalMap as Map<string, string>, frequency);
        const model = {
          [ModelKeys.AMOUNT]: amount,
          [ModelKeys.PORTFOLIO_ID]: `${portfolioId}`,
          [ModelKeys.IS_RECURRING]: true,
          [ModelKeys.FREQUENCY_TYPE]: frequencyType,
        };
        openSlideout(SlideOutPanelViews.TOP_UP, {
          initialModel: model,
          initialView: TopupSlideoutViewType.RECURRING_PAYMENTS,
        });
        break;

      default:
        alert(`implement ${action} subscription`);
        break;
    }
  };

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cards && cards.length === 1) setSelectedCard(cards[0].id);
  }, [cards]);

  return (
    <div
      className="flex flex-col w-full h-full px-5  divide-y-gray-200 overflow-hidden gap-5 overflow-y-auto"
      ref={(r) => (containerRef.current = r)}
    >
      <div className="text-base font-medium py-5 ">{displayText[DisplayTextKeys.PAGE_TITLE]}</div>
      {/* {loading && (
        <div className="w-full flex items-center justify-center min-h-[200px]">
          <Loading />
        </div>
      )} */}

      <>
        <div className="w-full  min-h-[120px] flex space-x-2 gap-3">
          {loadingCards && (
            <div className="flex w-full h-full items-center justify-center">
              <Loading />
            </div>
          )}
          {!loadingCards &&
            cards.length > 0 &&
            cards.map((card, index) => {
              const { last4: number, expMonth, expYear, id, brand } = card;
              const isSelected = selectedCard === id;
              return (
                <div
                  onClick={() => setSelectedCard(id)}
                  key={`card-${index}`}
                  className="flex flex-col p-3 cursor-pointer rounded-md border h-[128px] w-full sm:w-[221px]  border-gray-200 bg-gray-200"
                >
                  <div className="flex">
                    <div className="flex-1">{`${brand}`.toUpperCase()}</div>
                    <RadioButton id={`${id}`} name="payment-cards" isChecked={isSelected} />
                  </div>
                  <div className=" w-full text-sm my-3">{`**** **** **** ${number}`}</div>
                  <div className="text-xs">{`${expMonth}/${expYear}`}</div>
                </div>
              );
            })}
        </div>
        {!loadingSubscription && (
          <div className="flex-1 w-full space-y-2">
            {subscriptions.length > 0 &&
              subscriptions.map((scription, index) => {
                const { title, description } = scription;
                return (
                  <div
                    key={`subscription-${index}`}
                    className="flex flex-row w-full p-3 border space-y-2 items-center border-gray-200 "
                  >
                    <div className="flex flex-col flex-1 mr-2">
                      <div className="text-14">{title}</div>
                      <div className="text-sm">{description}</div>
                    </div>

                    <div className="text-sm flex divide-x divide-x-gray-300 justify-end items-center">
                      {(['CANCEL', 'EDIT'] as const).map((action) => (
                        <span
                          key={action}
                          title={displayText[DisplayTextKeys[action]]}
                          onClick={() => onAction(action, scription)}
                          className="cursor-pointer underline px-2"
                        >
                          {displayText[DisplayTextKeys[action]]}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </>
    </div>
  );
};

export default RecurringPayments;
