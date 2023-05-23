import { ApolloError } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WarningIcon } from '../../assets/icons';
import { logError } from '../../components/LogError';
import { MessageProductTemplateProp } from '../../components/ProductTemplates/components/MessageTemplate';
import { ExecuteResponse, ViewStateType } from '../../components/ProductTemplates/types';
import { capitalizeFirstLetter } from '../../utils';
import { MutationResponse } from './useExecuteMutation';

type MessageType = Pick<MessageProductTemplateProp, 'title' | 'subTitle' | 'onClick' | 'buttonText'>;

export interface ProcessorType {
  id: ViewStateType;
  error: ApolloError | undefined;
  loading: boolean;
  data: unknown;
  isFlush: boolean;
  onSuccess: (response: unknown, request?: unknown) => void;
  onError: (error: ApolloError | undefined) => void;
  onFlush?: () => void;
}

// export interface ExecutorMutationProps {
//   executor: <T>(request: T) => Promise<FetchResult<string, Record<string, unknown>, Record<string, unknown>>>;
//   error: ApolloError | undefined;
//   loading: boolean;
//   data: ExecuteResponse;
// }

export interface UseExecutorProps {
  mutation: MutationResponse;
  viewRef: ViewStateType;
  onStatusChange: (viewState: ViewStateType, message?: MessageType) => void;
  onClose: () => void;
  processorConfig?: Partial<ProcessorType>;
}

const useExecutor = ({ mutation, viewRef, onStatusChange, onClose, processorConfig }: UseExecutorProps) => {
  const { t } = useTranslation();
  const [processor, setProcessor] = useState<ProcessorType | null>(null);
  const { executor, error, loading, data } = mutation;

  const processRequest = <T,>(eventData: T) => {
    onStatusChange(ViewStateType.LOADING);
    executor({ ...eventData } as Record<string, unknown>);
    setProcessor({
      id: viewRef,
      loading,
      error,
      data,
      isFlush: false,

      onError: (err: ApolloError | undefined) => {
        onStatusChange(ViewStateType.SOMETHING_WENT_WRONG);
        logError(err || { request: eventData, errorMessage: 'response null or undefined' });
      },
      ...(processorConfig || {}),
      onSuccess: processorConfig?.onSuccess
        ? (response: unknown) => processorConfig?.onSuccess!(response, eventData)
        : (response: unknown) => {
            const result = response as ExecuteResponse;
            const key = Object.keys(result)[0] as keyof ExecuteResponse;
            if (result[key]!.isSuccess) onStatusChange(ViewStateType.THANK_YOU);
            else {
              onStatusChange(ViewStateType.MESSAGE, {
                title: () => (
                  <div className="flex items-center gap-3">
                    <WarningIcon />
                    <span className="text-20 font-medium ">{t('common:somethingWentWrong.title')}</span>
                  </div>
                ),
                subTitle: () => (
                  <div className="text-14 mt-2">{t`product:wineDetails.investMore.fail_send-request`}</div>
                ),
                onClick: () => {
                  if (onClose) onClose();
                },
                buttonText: capitalizeFirstLetter(t`common:done`),
              });
              logError(result);
            }
          },
    });
  };
  const flushProcessor = () => {
    const { loading: processing, error: err, onError, onSuccess, data: response } = processor!;
    if (processing) return;
    if (err) onError(err);
    else if (!response) {
      if (err) onError(undefined);
    } else {
      onSuccess(response);
    }
    setProcessor(null);
  };

  useEffect(() => {
    if (processor?.isFlush) {
      flushProcessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processor]);

  useEffect(() => {
    if (processor && processor.id === viewRef)
      setProcessor((x) => ({
        ...x!,
        loading,
        error,
        data,
        isFlush: !loading,
      }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading, data]);

  return processRequest;
};

export default useExecutor;
