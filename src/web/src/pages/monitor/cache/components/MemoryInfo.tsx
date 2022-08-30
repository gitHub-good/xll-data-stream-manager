import type { FC } from 'react';
import { Gauge } from '@ant-design/charts';
import type { Datum, GaugeConfig } from '@ant-design/charts';

const MemoryInfo: FC<{ value: number; valueStr: string; maxValue: number }> = (props) => {
  const config: GaugeConfig = {
    percent: props.value / props.maxValue,
    type: 'meter',
    innerRadius: 0.75,
    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#30BF78', '#FAAD14', '#F4664A'],
    },
    axis: {
      label: {
        formatter: (v) => Number(v) * props.maxValue,
      },
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        formatter: (datum) => ((datum as Datum).percent * 100).toFixed(2) + '%/' + props.valueStr,
        style: {
          fontSize: '36px',
          lineHeight: '36px',
        },
      },
    },
  };
  return <Gauge {...config} />;
};

export default MemoryInfo;
