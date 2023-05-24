import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import { PChart } from '../../../../components/Charts';

interface MarketDataChartProps {
  classNameContainer?: string;
  data: number[];
}
export default function MarketDataChart({ classNameContainer, data }: MarketDataChartProps) {
  const [chartOptions, setChartConfig] = useState<Highcharts.Options>({
    chart: {
      renderTo: 'container',
      plotBackgroundColor: undefined,
      plotBackgroundImage: undefined,
      plotBorderWidth: 0,
      plotShadow: false,
      backgroundColor: 'transparent',
      width: 70,
      height: 70,
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
      tickColor: '#fff',
      tickWidth: 0.1,
      gridLineColor: 'transparent',
    },

    tooltip: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },

    xAxis: {
      tickColor: 'transparent',
      tickWidth: 0.1,
      labels: {
        enabled: false,
      },
    },
  });

  useEffect(() => {
    setChartConfig({
      ...chartOptions,
      series: [
        {
          type: 'line',
          opacity: 1,
          lineWidth: 1,
          marker: {
            radius: 1,
          },
          color: '#1D4854',
          data,
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className={`flex flex-col ${classNameContainer || ''}`.trim()}>
      <PChart config={chartOptions} />
    </div>
  );
}
