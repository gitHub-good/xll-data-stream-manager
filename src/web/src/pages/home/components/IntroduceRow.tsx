import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';

import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import type { DataItem } from '../data.d';
import Trend from './Trend';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: DataItem[] }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="总销售额"
        action={
          <Tooltip title="含税金额">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={`￥${numeral(9876543210.99).divide(10000).format('0,0.00')}万`}
        footer={<Field label="本月销售额" value={`￥${numeral(1234567890.99).divide(10000).format('0,0.00')}万`} />}
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          月同比
          <span className={styles.trendText}>13%</span>
        </Trend>
        <Trend flag="down">
          月环比
          <span className={styles.trendText}>10%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="药品销售部"
        action={
          <Tooltip title="含税金额">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={`￥${numeral(987654321.99).divide(10000).format('0,0.00')}万`}
        footer={<Field label="本月销售额" value={`￥${numeral(123456789.99).divide(10000).format('0,0.00')}万`} />}
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          月同比
          <span className={styles.trendText}>14%</span>
        </Trend>
        <Trend flag="down">
          月环比
          <span className={styles.trendText}>15%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="器械销售部"
        action={
          <Tooltip title="含税金额">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={`￥${numeral(87654321.99).divide(10000).format('0,0.00')}万`}
        footer={<Field label="本月销售额" value={`￥${numeral(23456789.99).divide(10000).format('0,0.00')}万`} />}
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          月同比
          <span className={styles.trendText}>11%</span>
        </Trend>
        <Trend flag="down">
          月环比
          <span className={styles.trendText}>12%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="商务分销部"
        action={
          <Tooltip title="含税金额">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={`￥${numeral(7654321.99).divide(10000).format('0,0.00')}万`}
        footer={<Field label="本月销售额" value={`￥${numeral(3456789.99).divide(10000).format('0,0.00')}万`} />}
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          月同比
          <span className={styles.trendText}>9%</span>
        </Trend>
        <Trend flag="down">
          月环比
          <span className={styles.trendText}>8%</span>
        </Trend>
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
