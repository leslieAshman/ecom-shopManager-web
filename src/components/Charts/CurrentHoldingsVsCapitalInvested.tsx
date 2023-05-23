import { ReactNode, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import moment from 'moment';
import { PChart } from '.';
import { ChartSeries, getSeries } from './PortalChart';

const defaultChartOptions: Highcharts.Options = {
  chart: {
    backgroundColor: '#FCFCFC',
    plotBackgroundColor: '#FFFFFF',
    plotBorderWidth: 0.3,
    plotBorderColor: '#617F87',
    spacingTop: 20,
    marginTop: 16,
    // marginLeft: 50,
  },
  title: {
    text: '',
  },

  legend: {
    enabled: false,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'top',
    x: 0,
    y: 0,
    floating: true,
    borderWidth: 0,
    useHTML: true,
    symbolWidth: 0,
    labelFormatter: function () {
      const containerStyle = `display: flex;align-items: center; width:100%`;
      const iconStyle = `style="background: ${this.options.color}; 
      border-radius: 4px; width:37px; height:30px; margin-right:5px"`;
      const textStyle = `style="width:37px; height:30px font-family: 'GT Flexa';color: #000000;
      font-style: normal; width: 100%;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;"`;

      return `<div style="${containerStyle}">
        <div ${iconStyle}></div>
        <span ${textStyle}> ${this.name}</span>
      </div>`;
    },
  },

  xAxis: {
    tickColor: '#fff',
    tickWidth: 0.1,
    labels: {
      useHTML: true,
      formatter: function () {
        return '';
      },
    },
    ////Require!! business requirements to be redefined
    // plotLines: [
    //   {
    //     color: '#666666',
    //     width: 2,
    //     value: Date.UTC(2022, 7, 10),
    //     dashStyle: 'dash',
    //     label: {
    //       useHTML: true,
    //       align: 'center',
    //       verticalAlign: 'top',
    //       style: {
    //         backgroundColor: '#fff',
    //         border: '1px solid #666666',
    //         borderRadius: '1px',
    //         color: '#000',
    //         fontWeight: 'bold',
    //         padding: '5px',
    //       },

    //       formatter: function (): string {
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         return `${moment(new Date((this as any).options.value)).format('DD MMM YY')}`;
    //       },

    //       rotation: 0,
    //       x: -10,
    //       y: 10,
    //     },
    //   },
    // ],
    // accessibility: {
    //   rangeDescription: 'Range: 2010 to 2020',
    // },
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: '',
    },
    labels: {
      enabled: true,
    },
    // tickColor: '#fff',
    // tickWidth: 0.1,
    // gridLineColor: 'transparent',
  },
  credits: {
    enabled: false,
  },

  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
      pointStart: moment().year(),
      events: {
        legendItemClick: function () {
          return false;
        },
      },
    },
  },

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
      },
    ],
  },
};

export interface HoldingVsInvestedSeries {
  id: string;
  toolTipKey?: string;
  name: string;
  color?: string;
  data: {
    x: number;
    y: number;
  }[];
}
const getPChartSeries = (seriesIn: HoldingVsInvestedSeries[]) => {
  return getSeries(
    seriesIn.map(
      (x: HoldingVsInvestedSeries) =>
        ({
          type: 'line',
          opacity: 1,
          lineWidth: 2,
          marker: {
            radius: 1,
          },
          ...x,
          color: x.color || undefined,
        } as ChartSeries),
    ),
  );
};

interface HoldingVsInvestChartProps {
  header?: () => ReactNode;
  footer?: () => ReactNode;
  series: HoldingVsInvestedSeries[];
}

export default function CurrentHoldingsVsCapitalInvested({
  series,
  footer,
  header,
}: HoldingVsInvestChartProps): JSX.Element {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    ...defaultChartOptions,
    series: getPChartSeries(series),
  });

  useEffect(() => {
    const minTimestamp = Math.min(...series.map((x) => Math.min(...x.data.map((z) => z.x))));
    const minDate = moment(minTimestamp).year();
    setChartOptions({
      ...chartOptions,
      plotOptions: {
        ...chartOptions.plotOptions,
        series: {
          ...chartOptions.plotOptions?.series,
          pointStart: minDate,
        },
      },
      series: getPChartSeries(series),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series]);

  return (
    <div className="flex flex-col">
      <PChart config={chartOptions} header={header} footer={footer} />
    </div>
  );
}
