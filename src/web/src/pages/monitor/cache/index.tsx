import type { FC } from 'react';
import { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { getCache } from "./service";
import type { RedisCache } from "./data";
import CommandStats from "./components/CommandStats";
import MemoryInfo from "@/pages/monitor/cache/components/MemoryInfo";

const Cache: FC = () => {
  const [redisCacheState, setRedisCacheState] = useState<RedisCache>();

  /** 刷新 */
  const handleRefresh = async () => {
    const redisCache = await getCache();
    setRedisCacheState(redisCache);
    message.success('获取Redis缓存服务信息成功');
  };

  useEffect(() => {
    (async () => {
      await handleRefresh();
    })()
  }, []);

  return (
    <PageContainer header={{ title: undefined }}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <ProCard title='基本信息' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            <ProDescriptions column={4}>
              <ProDescriptions.Item valueType="text" label="Redis版本">
                {redisCacheState?.info?.redis_version}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="运行模式">
                {redisCacheState?.info?.redis_mode === "standalone" ? "单机" : "集群"}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="端口">
                {redisCacheState?.info?.tcp_port}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="客户端数">
                {redisCacheState?.info?.connected_clients}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="运行时间(天)">
                {redisCacheState?.info?.uptime_in_days}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="使用内存">
                {redisCacheState?.info?.used_memory_human}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="使用CPU">
                {parseFloat(redisCacheState?.info?.used_cpu_user_children as string).toFixed(2)}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="内存配置">
                {redisCacheState?.info?.maxmemory_human}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="AOF是否开启">
                {redisCacheState?.info?.aof_enabled === "0" ? "否" : "是"}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="RDB是否成功">
                {redisCacheState?.info?.rdb_last_bgsave_status}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="Key数量">
                {redisCacheState?.dbSize}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="网络入口/出口">
                {redisCacheState?.info?.instantaneous_input_kbps}kps/{redisCacheState?.info?.instantaneous_output_kbps}kps
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title='命令统计' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            {(redisCacheState) && (<CommandStats data={redisCacheState?.commandStats as []} />)}
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title='内存信息' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            {(redisCacheState) && (
              <MemoryInfo
                value={parseFloat(redisCacheState?.info?.used_memory_human ?? '0')}
                valueStr={redisCacheState?.info?.used_memory_human ?? '0'}
                maxValue={1000}
              />
            )}
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Cache;
