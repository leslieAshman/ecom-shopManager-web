import Button from 'components/Button';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildDisplayText, classNames } from 'utils';

export enum StepperEventType {
  CANCEL = 'cancel',
  BACK = 'back',
  SAVE = 'save',
}

enum DisplayTextKeys {
  CANCEL = 'common:cancel',
  BACK = 'common:back',
  SAVE = 'common:save',
}

interface Step {
  id: string;
  title: string;
  html: ReactNode;
  isCompleted: boolean;
  icon: ReactNode;
  isDisabled?: boolean;
  desc?: string;
  ordinal?: number;
}

interface StepProps {
  steps: Step[];
  currentIndex?: number;
  onCTA?: (stepEventType: StepperEventType) => void;
  containerClassName?: string;
}
const Stepper: FC<StepProps> = ({ steps, onCTA, containerClassName, currentIndex = 0 }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const displayText = useMemo(() => buildDisplayText(Object.values(DisplayTextKeys), 'common:', t), [t]);
  const source = useMemo(() => {
    const xSteps = steps.map((x, index) => ({ ...x, ordinal: index }));
    const firstNotComplete = xSteps.find((x) => !x.isCompleted);
    setCurrentStep(firstNotComplete ?? xSteps[xSteps.length - 1]);
    return xSteps;
  }, [steps]);

  const onGoBack = useCallback(() => {
    const prevStep = source.find(
      (x) => currentStep?.ordinal && currentStep?.ordinal > 0 && x.ordinal === currentStep?.ordinal - 1,
    );
    if (prevStep) {
      setCurrentStep(prevStep);
      if (onCTA) onCTA(StepperEventType.BACK);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    if (currentIndex !== currentStep?.ordinal) {
      const newCurrentStep = source.find((x) => x.ordinal === currentIndex);
      if (newCurrentStep) setCurrentStep(newCurrentStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <section className={classNames('text-gray-600 body-font w-full', containerClassName ?? '')}>
      <div className="container sm:pt-10 pb-10 mx-auto flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="mt-10 sm:flex  hidden flex-col md:pr-10 md:py-6 mr-10 ">
            {source &&
              source.length > 0 &&
              source.map((step, index) => {
                return index < steps.length - 1 ? (
                  <div key={`${step.id}`} className="flex relative pb-12">
                    <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                      <div
                        className={`h-full  w-1 ${step.isCompleted ? 'bg-green' : 'bg-gray-200'} pointer-events-none`}
                      ></div>
                    </div>

                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 ${
                        step.isCompleted ? 'bg-green' : 'bg-white'
                      } inline-flex items-center justify-center text-white relative z-10`}
                    >
                      {!!step.icon && step.icon}
                    </div>

                    <div
                      className={`flex-grow pl-4 flex items-center ${
                        currentStep?.ordinal && index > currentStep?.ordinal && step.isCompleted
                          ? 'text-gray-600'
                          : 'text-black'
                      }`}
                    >
                      <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">{`${step.title}`}</h2>
                      {step.desc && step.desc.length > 0 && <p className="leading-relaxed">{`${step.desc}`}</p>}
                    </div>
                  </div>
                ) : (
                  <div key={`${step.id}`} className="flex relative">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10"></div>
                    <div className="flex-grow pl-4">
                      <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">{`${step.title}`}</h2>
                      {step.desc && step.desc.length > 0 && <p className="leading-relaxed">{`${step.desc}`}</p>}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex-1 object-cover object-center rounded-lg md:mt-0 mt-12">
            <h3 className="text-xl mb-5">{currentStep?.title}</h3>
            <div className=" bg-gray-50  overflow-y-auto  border border-gray-100 ">
              {currentStep && currentStep.html}
            </div>
            <div className=" w-full mt-5 flex flex-row justify-between">
              <Button
                className="text-14 border"
                onClick={() => {
                  if (onCTA) onCTA(StepperEventType.CANCEL);
                }}
              >
                <span> {displayText[DisplayTextKeys.CANCEL]}</span>
              </Button>

              <div className="space-x-5 flex flex-row">
                <Button className="text-14 btn-outline" onClick={onGoBack}>
                  {displayText[DisplayTextKeys.BACK]}
                </Button>

                <Button
                  className="btn-primary"
                  onClick={() => {
                    if (onCTA) onCTA(StepperEventType.SAVE);
                  }}
                  type="submit"
                  props={{
                    name: 'login',
                  }}
                >
                  {displayText[DisplayTextKeys.SAVE]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stepper;
