import type { FC } from 'react';
import { useRef, useState } from "react";
import { Button, Col, message, Row } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import ProCard from '@ant-design/pro-card';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import type { ReidsCacheItem } from "./data";
import { clearCacheAll, clearCacheKey, clearCacheName, getCacheValue, listCacheKey, listCacheName } from "./service";


const nameFormatter = (cacheName: string) => {
  return cacheName.replace(":", "");
}
const keyFormatter = (cacheKey: string, cacheName: string) => {
  return cacheKey.replace(cacheName, "");
}

const CacheList: FC = () => {
  const [currentCacheNameState, setCurrentCacheNameState] = useState<string>('');
  const tableActionRefCacheNames = useRef<ActionType>();
  const tableActionRefCacheKeys = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const columnsCacheNames: ProColumns<ReidsCacheItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: '缓存名称',
      dataIndex: 'cacheName',
      render: (dom, entity) => {
        return nameFormatter(entity.cacheName as string);
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      key: 'option',
      render: (dom, entity) => {
        return (
          <Button type='link' size='small' key='delete' icon={<DeleteOutlined />}
                  onClick={async () => {
                    await clearCacheName(entity.cacheName as string);
                    await tableActionRefCacheKeys.current?.reload();
                    message.success(`清理缓存名称[${entity.cacheName}]成功`);
                  }}
          />
        )
      },
    },
  ]

  const columnsCacheKeys: ProColumns<ReidsCacheItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      valueType: 'index',
    },
    {
      title: '缓存键名',
      dataIndex: 'cacheKey',
      width: 150,
      render: (dom, entity) => (
        <span style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {keyFormatter(entity.cacheKey as string, entity.cacheName as string)}
        </span>
      ),
    },
    {
      title: '操作',
      width: 50,
      key: 'option',
      render: (dom, entity) => {
        return (
          <Button type='link' size='small' key='delete' icon={<DeleteOutlined />}
                  onClick={async () => {
                    await clearCacheKey(entity.cacheKey as string);
                    await tableActionRefCacheKeys.current?.reload();
                    message.success(`清理缓存键名[${entity.cacheKey}]成功`);
                  }}
          />
        )
      },
    },
  ]

  return (
    <PageContainer>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <ProCard title='缓存列表' headerBordered={true} size='small' bordered
                   extra={
                     /*刷新缓存列表按钮*/
                     <Button type='text' size='small' icon={<SyncOutlined />}
                             onClick={async () => {
                               await tableActionRefCacheNames.current?.reload();
                               message.success('刷新缓存列表成功');
                             }}
                     />
                   }>
            <ProTable<ReidsCacheItem>
              actionRef={tableActionRefCacheNames}
              bordered={true}
              columns={columnsCacheNames}
              dateFormatter="string"
              defaultSize={"small"}
              pagination={false}
              request={listCacheName}
              rowKey="cacheName"
              search={false}
              options={false}
              onRow={record => {
                return {
                  onClick: async () => {
                    setCurrentCacheNameState(record.cacheName as string);
                  },
                };
              }}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard title='键名列表' headerBordered={true} size='small' bordered
                   extra={
                     <Button type='text' size='small' icon={<SyncOutlined />}
                             onClick={async () => {
                               await tableActionRefCacheKeys.current?.reload();
                               message.success('刷新键名列表成功');
                             }}
                     />
                   }>
            <ProTable<ReidsCacheItem>
              actionRef={tableActionRefCacheKeys}
              bordered={true}
              columns={columnsCacheKeys}
              dateFormatter="string"
              defaultSize={"small"}
              pagination={false}
              params={{ cacheName: currentCacheNameState }}
              request={async (params) => {
                if ((params.cacheName ?? '') === '') {
                  return {};
                }
                return await listCacheKey(params.cacheName);
              }}
              rowKey="cacheKey"
              search={false}
              options={false}
              onRow={record => {
                return {
                  onClick: async () => {
                    const result = await getCacheValue(record.cacheName as string, record.cacheKey as string);
                    formRef.current?.setFieldsValue(result);
                  },
                };
              }}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard title='缓存内容' headerBordered={true} size='small' bordered
                   extra={
                     <Button type='text' size='small' icon={<SyncOutlined />}
                             onClick={async () => {
                               await clearCacheAll();
                               message.success('清理全部缓存成功');
                             }}>
                       清理全部
                     </Button>
                   }>
            <ProForm<ReidsCacheItem>
              formRef={formRef}
              submitter={false}
            >
              <ProFormText width="xl" name="cacheName" label="缓存名称" disabled={true} />
              <ProFormText width="xl" name="cacheKey" label="缓存键名" disabled={true} />
              <ProFormTextArea width="xl" name="cacheValue" label="缓存内容" fieldProps={{ autoSize: { minRows: 10, maxRows: 10 } }} disabled={true} />
            </ProForm>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CacheList;
