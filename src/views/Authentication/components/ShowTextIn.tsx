/** @jsxImportSource @emotion/react */
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ShowTextInProps {
  translationKey?: string;
  initValue: number;
  onEnd?: () => void;
}

const ShowTextIn: FC<ShowTextInProps> = ({ translationKey, initValue, onEnd }) => {
  const { t } = useTranslation();
  const [counter, setCounter] = useState(initValue);

  useEffect(() => {
    if (counter === 0 && onEnd) onEnd();
    if (counter > -1) setTimeout(() => setCounter(counter - 1), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);
  const resencCodeText = translationKey && t(translationKey, { seconds: `${counter}s` });
  return <span css={{ mx: 5 }}>{resencCodeText}</span>;
};

export default ShowTextIn;
