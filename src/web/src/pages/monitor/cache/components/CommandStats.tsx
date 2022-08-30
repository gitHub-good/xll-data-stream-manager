import type { FC } from 'react';
import { Pie, G2 } from '@ant-design/charts';
import type { PieConfig } from '@ant-design/charts';
import type { RedisCommandStatsItem } from "../data";

const CommandStats: FC<{ data: RedisCommandStatsItem[]; }> = (props) => {
  const G = G2.getEngine('canvas');
  const config: PieConfig = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'name',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 40,
      formatter: (data, mappingData) => {
        const group = new G.Group({});
        group.addShape({
          type: 'circle',
          attrs: {
            x: 0,
            y: 0,
            width: 40,
            height: 50,
            r: 5,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: 'text',
          attrs: {
            x: 10,
            y: 8,
            text: `${data.name}`,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: 'text',
          attrs: {
            x: 0,
            y: 25,
            text: `${data.value}次 ${(data.percent * 100).toFixed(2)}%`,
            fill: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 700,
          },
        });
        return group;
      },
    },
    tooltip: {
      fields: ['name', 'value'],
      formatter: (datum) => {
        return { name: datum.name, value: datum.value + '次' };
      },
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return (<Pie {...config} />);
};

export default CommandStats;
