import { FC, useMemo, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import './filterDatePicker.css';
import { capitalizeFirstLetter, getRange } from '../../utils';
import { ChevronLeft, ChevronRight } from '../../assets/icons';

const startYear = 1990;

export enum DateType {
  START = 'start',
  END = 'end',
}
export interface DateFilters {
  [DateType.START]: Date | null;
  [DateType.END]: Date | null;
}

interface DateFilterProp {
  model: DateFilters;
  onModelUpdate: (update: DateFilters) => void;
  options: {
    title?: string;
    startTitle: string;
    endTitle: string;
    datePlaceHolderText: string;
  };
}

const DateFilter: FC<DateFilterProp> = ({ options, model, onModelUpdate }) => {
  const fromCalenderRef = useRef<DatePicker<never, undefined> | null>(null);
  const toCalenderRef = useRef<DatePicker<never, undefined> | null>(null);
  const openDatepicker = (type: DateType) => {
    if (type === DateType.START) fromCalenderRef.current?.setOpen(true);
    if (type === DateType.END) toCalenderRef.current?.setOpen(true);
  };

  const { title, startTitle, endTitle, datePlaceHolderText } = options;
  const dateConfig = useMemo(
    () => [
      {
        type: DateType.START,
        title: `${capitalizeFirstLetter(startTitle)}`,
        ref: fromCalenderRef,
      },
      {
        type: DateType.END,
        title: `${capitalizeFirstLetter(endTitle)}`,
        ref: toCalenderRef,
      },
    ],
    [startTitle, endTitle],
  );

  const months = useMemo(() => moment.months(), []);
  const years: number[] = useMemo(
    () => getRange(moment().year() - startYear + 1).map((x: number) => startYear + x),
    [],
  );

  return (
    <div>
      {title && (
        <div className="flex px-3 pb-1">
          <span className="text-sm text-gray-700 mb-1">{title}</span>
        </div>
      )}

      <div
        date-rangepicker=""
        className="flex flex-nowrap bg-gray-100 p-5 items-center justify-center divide-solid divide-x"
      >
        {dateConfig.map((x) => (
          <div
            key={`${x.type}`}
            className="relative text-center flex-1 flex  flex-col justify-center items-center"
            onClick={() => openDatepicker(x.type)}
          >
            <span className="text-xs">{x.title}</span>
            <span>
              {!model[x.type]
                ? `${capitalizeFirstLetter(datePlaceHolderText)}`
                : moment(model[x.type]).format('DD MMM YYYY')}
            </span>
          </div>
        ))}
      </div>
      <div className="p-5">
        <DatePicker
          dayClassName={(date: Date) =>
            moment(date).isBetween(moment(model[DateType.START]), moment(model[DateType.END])) ||
            moment(date).isSame(moment(model[DateType.START])) ||
            moment(date).isSame(moment(model[DateType.END]))
              ? 'bg-vine text-white'
              : ''
          }
          weekDayClassName={() => 'hidden'}
          calendarClassName="!border-none rounded-none w-full"
          onChange={(dates) => {
            const [start, end] = dates;
            onModelUpdate({ [DateType.START]: start, [DateType.END]: end });
          }}
          startDate={model[DateType.START]}
          endDate={model[DateType.END]}
          calendarStartDay={6}
          selectsRange
          inline
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex pb-3 justify-center items-center">
              <button className="flex-1 text-base" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                <div className="flex justify-center items-center">
                  <ChevronLeft />
                </div>
              </button>

              <select
                className="mr-5 text-base outline-none"
                value={months.find((x) => x === moment(date).format('MMMM'))}
                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                className="text-base outline-none"
                value={moment(date).year()}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button className="flex-1 text-base" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                <div className="flex  justify-center items-center">
                  <ChevronRight />
                </div>
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DateFilter;
