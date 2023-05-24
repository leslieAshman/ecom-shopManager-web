import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import { PChart } from '../../../../components/Charts';
import { HistoricMarketPriceItem } from '../../../../types/productType';
import moment from 'moment';
import { toChartXYPoint } from '../../../../utils';

interface LiveExPerformanceChartProps {
  classNameContainer?: string;
  chartData: HistoricMarketPriceItem[];
}

const chartConfig: Highcharts.Options = {
  chart: {
    renderTo: 'container',
    plotBackgroundColor: undefined,
    plotBackgroundImage: undefined,
    plotBorderWidth: 0,
    plotShadow: false,
    backgroundColor: 'transparent',
  },
  title: {
    text: '',
  },

  legend: {
    enabled: false,
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 120,
    y: 0,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },

  yAxis: {
    title: {
      text: '',
    },
    labels: {
      enabled: false,
    },
  },

  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'datetime',
    labels: {
      formatter: function () {
        //  const label = this.axis.defaultLabelFormatter.call(this);
        return `${moment(this.value).year()}`;
      },
    },
  },

  series: [
    {
      type: 'line',
      opacity: 1,
      lineWidth: 1,
      marker: {
        radius: 1,
      },
      color: '#1D4854',
      data: [],
    },
  ],
};
export default function LiveExPerformanceChart({ classNameContainer, chartData }: LiveExPerformanceChartProps) {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({ ...chartConfig });

  useEffect(() => {
    let minDate = moment();
    const performanceData = toChartXYPoint(chartData, 'date', 'marketPrice', false).map((point) => {
      const dateObj = moment(point.x);
      minDate = moment.min([dateObj, minDate]);
      return { ...point, x: dateObj.toDate().getTime() } as { x: number; y: number };
    });

    setChartOptions({
      ...chartOptions,
      plotOptions: {
        series: {
          pointStart: minDate.year(),
        },
      },
      xAxis: {
        ...chartConfig.xAxis,
        units: [['year', [1]]],
      },
      series: [
        {
          ...chartOptions?.series![0],
          data: performanceData,
          pointStart: minDate.year(),
        } as Highcharts.SeriesOptionsType,
      ],
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return (
    <div className={`flex flex-col ${classNameContainer || ''}`.trim()}>
      <PChart config={chartOptions} />
    </div>
  );
}
