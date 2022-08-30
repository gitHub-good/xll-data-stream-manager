import type { FC } from 'react';
import { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Table } from "antd";
import type { ColumnsType } from 'antd/lib/table';
import type { ServerInfo } from "./data";
import { getServer } from "./service";
import type { SysFile } from "./data";

const Server: FC = () => {
  const [{ cpu = {}, mem = {}, jvm = {}, sys = {}, sysFiles = [] }, setServerInfoState] = useState<ServerInfo>({});

  /** 刷新 */
  const handleRefresh = async () => {
    const serverInfo = await getServer();
    setServerInfoState(serverInfo);
    message.success('获取服务器信息成功');
  };

  useEffect(() => {
    (async () => {
      await handleRefresh();
    })()
  }, []);

  const columns: ColumnsType<SysFile> = [
    {
      title: '盘符路径',
      dataIndex: 'dirName',
    },
    {
      title: '文件系统',
      dataIndex: 'sysTypeName',
    },
    {
      title: '盘符类型',
      dataIndex: 'typeName',
    },
    {
      title: '总大小',
      dataIndex: 'total',
    },
    {
      title: '可用大小',
      dataIndex: 'free',
    },
    {
      title: '已用大小',
      dataIndex: 'used',
    },
    {
      title: '已用百分比',
      dataIndex: 'usage',
      render: value => value + '%'
    },
  ]
  return (
    <PageContainer header={{ title: undefined }}>
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <ProCard title='CPU' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            <ProDescriptions column={2}>
              <ProDescriptions.Item valueType="text" label="核心数">
                {cpu.cpuNum}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="用户使用率">
                {cpu.used}%
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="当前空闲率">
                {cpu.free}%
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="系统使用率">
                {cpu.sys}%
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title='内存/JVM' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            <ProDescriptions column={2}>
              <ProDescriptions.Item valueType="text" label="总内存">
                {mem.total}G/{jvm.total}M
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="已用内存">
                {mem.used}G/{jvm.used}M
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="剩余内存">
                {mem.free}G/{jvm.free}M
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="使用率">
                {mem.usage}%/{jvm.usage}%
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </Col>
        <Col span={24}>
          <ProCard title='服务器信息' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            <ProDescriptions column={2}>
              <ProDescriptions.Item valueType="text" label="服务器名称">
                {sys.computerName}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="操作系统">
                {sys.osName}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="服务器IP">
                {sys.computerIp}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="系统架构">
                {sys.osArch}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </Col>
        <Col span={24}>
          <ProCard title='Java虚拟机信息' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            <ProDescriptions column={2}>
              <ProDescriptions.Item valueType="text" label="Java名称">
                {jvm.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="Java版本">
                {jvm.version}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="启动时间">
                {jvm.startTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" label="运行时长">
                {jvm.runTime}
              </ProDescriptions.Item>
              <ProDescriptions.Item span={2} valueType="text" label="安装路径">
                {jvm.home}
              </ProDescriptions.Item>
              <ProDescriptions.Item span={2} valueType="text" label="项目路径">
                {sys.userDir}
              </ProDescriptions.Item>
              <ProDescriptions.Item span={2} valueType="text" label="运行参数">
                {jvm.inputArgs}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </Col>
        <Col span={24}>
          <ProCard title='磁盘状态' headerBordered={true} size='small' hoverable bordered
                   extra={
                     <Button onClick={handleRefresh} type='text' size='small'>
                       <SyncOutlined />
                     </Button>
                   }>
            <Table columns={columns} dataSource={sysFiles} size={"small"} rowKey='dirName' pagination={false} />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Server;
