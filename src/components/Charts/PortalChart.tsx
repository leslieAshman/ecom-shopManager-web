import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import DataPointTooltip from './DataPointTooltip';
import { formatter } from '../../utils';
import { AppContext } from '../../context/ContextProvider';

export function formatChartDate(d: Date, locale = 'en-GB'): string {
  const month = Intl.DateTimeFormat(locale, { month: 'long' }).format(d);
  const year = Intl.DateTimeFormat(locale, { year: '2-digit' }).format(d);
  return `${month} '${year}`;
}

export interface ChartSeries {
  name: string;
  type?: Highcharts.SeriesOptionsType['type'];
  color?: string;
  data: {
    x: number | string;
    y: number;
  }[];
  [key: string]: unknown;
}
export const getSeries = (seriesIn: ChartSeries[]): Highcharts.SeriesOptionsType[] => {
  return (seriesIn || []).map((x: ChartSeries) => ({
    ...x,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: (x.type || 'line') as any,
    color: x.color || undefined,
  }));
};

interface PortalChartProps {
  series?: ChartSeries[];
  config?: Highcharts.Options;
  header?: () => ReactNode;
  footer?: () => ReactNode;
}

export default function PortalChart({ series, footer, header, config }: PortalChartProps): JSX.Element {
  const chartRef = useRef<Highcharts.Chart | null>(null);
  const {
    state: {
      settings: { language },
    },
  } = useContext(AppContext);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: 'line',
      backgroundColor: '#F2F2F2',
    },
    accessibility: {
      enabled: false,
    },

    legend: {
      enabled: true,
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 0,
      y: 0,
      floating: true,
      borderWidth: 0,
      backgroundColor: '#FFFFFF',
    },
    credits: {
      enabled: false,
    },

    tooltip: {
      useHTML: true,
      borderColor: 'none',
      borderRadius: 8,
      backgroundColor: '#fff',
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        return renderToString(
          <DataPointTooltip
            x={formatChartDate(new Date(this.x as string), language)}
            y={`${formatter.format(this.y as number)}`}
          />,
        );
      },
    },
    series: series ? getSeries(series) : [],
    ...(config || {}),
  });

  const afterChartCreated = (chart: Highcharts.Chart) => {
    chartRef.current = chart || null;
  };

  useEffect(() => {
    setChartOptions({
      ...chartOptions,
      tooltip: { ...chartOptions.tooltip, ...(config || { tooltip: {} }).tooltip },
      legend: { ...chartOptions.legend, ...(config || { legend: {} }).legend },
      chart: { ...chartOptions.chart, ...(config || { chart: {} }).chart },
      series: series ? getSeries(series) : [],
      ...(config || {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, config]);

  return (
    <div className="flex flex-col">
      {header && header()}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} callback={afterChartCreated} />
      {footer && footer()}
    </div>
  );
}
