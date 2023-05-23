import moment from 'moment';
import React, { FC, useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { ChevronLeft, ChevronRight } from '../../assets/icons';
import { getRange } from '../../utils';

enum DateType {
  START = 'start',
  END = 'end',
}

export type SingleDate = Date | null;
export type DateRange = [SingleDate, SingleDate];

interface DateFilters {
  [DateType.START]: Date | null;
  [DateType.END]: Date | null;
}

interface DateFieldProps {
  minYear?: number;
  isRange?: boolean;
  onChange?: (date: SingleDate | DateRange) => void;
  showMonthYearDropdown?: boolean;
  minDate?: Date;
  maxDate?: Date;
  props?: Record<string, unknown>;
}
const DateField: FC<DateFieldProps> = ({
  onChange,
  minDate,
  maxDate,
  minYear = 1960,
  isRange = false,
  showMonthYearDropdown = false,
  props = {},
}) => {
  const [dateFilters, setDateFilters] = useState<DateFilters>({
    [DateType.START]: null,
    [DateType.END]: null,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const years: number[] = useMemo(() => getRange(moment().year() - minYear).map((x: number) => minYear + x), []);
  const months = useMemo(() => moment.months(), []);

  const onSelected = (dates: SingleDate | DateRange) => {
    if (isRange) {
      const [start, end] = dates as DateRange;
      setDateFilters({ [DateType.START]: start, [DateType.END]: end });
    } else {
      setDateFilters({ [DateType.START]: dates as SingleDate, [DateType.END]: dates as SingleDate });
    }
    if (onChange) onChange(dates);
  };
  return (
    <div className="p-5">
      <ReactDatePicker
        dayClassName={(date: Date) =>
          moment(date).isBetween(moment(dateFilters[DateType.START]), moment(dateFilters[DateType.END])) ||
          moment(date).isSame(moment(dateFilters[DateType.START])) ||
          moment(date).isSame(moment(dateFilters[DateType.END]))
            ? 'bg-vine text-white'
            : ''
        }
        weekDayClassName={() => 'hidden'}
        calendarClassName="border-none rounded-none w-full"
        onChange={onSelected}
        minDate={minDate}
        maxDate={maxDate}
        startDate={dateFilters[DateType.START]}
        endDate={dateFilters[DateType.END]}
        calendarStartDay={6}
        selectsRange={isRange}
        inline
        renderCustomHeader={
          !showMonthYearDropdown
            ? undefined
            : ({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex pb-3 justify-center items-center">
                  <button className="flex-1 text-base " onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                    <ChevronLeft />
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

                  <button
                    className="flex-1 text-base flex justify-end"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  >
                    <ChevronRight />
                  </button>
                </div>
              )
        }
        {...props}
      />
    </div>
  );
};

export default DateField;
