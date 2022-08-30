import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { TableDropdown } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, ExportOutlined, EyeOutlined, PlayCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Switch, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dict, download, modal } from "@/utils";
import type { JobItem } from "./data";
import { changeJobStatus, delJob, listJob, runJob } from "./service";
import { JobEditor, JobDetail, JobLog } from './components';

/** 删除 */
const handleDelete = (jobIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除定时任务编号为"' + jobIds + '"的数据项？'
    , async () => {
      try {
        await delJob(jobIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

/** 立即执行一次 */
const handleRun = (entity: JobItem) => {
  const _modal = modal.confirm(
    '确认要立即执行一次"' + entity.jobName + '"任务吗？'
    , async () => {
      try {
        await runJob(entity.jobId as Key, entity.jobGroup as string);
        message.success('执行成功');
      } catch (e) {
        _modal.destroy();
      }
    }
  );
}

/** 修改任务状态 */
const handleStatusChange = (checked: boolean, entity: JobItem, tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const text = entity.status === "0" ? "停用" : "启用";
  const _status = entity.status === "0" ? "1" : "0";
  const _modal = modal.confirm(
    '确认要"' + text + '""' + entity.jobName + '"任务吗？',
    async () => {
      try {
        await changeJobStatus(entity.jobId as Key, _status);
        message.success(text + '成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    },
  );
}

/** 导出 */
const handleExport = async (tableFormRef: MutableRefObject<ProFormInstance | undefined>) => {
  await download.commonDownload(
    '/monitor/job/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `job_${new Date().getTime()}.xlsx`
  );
}

const Job: FC = () => {
  // 获取权限相关信息
  const access = useAccess();
  // 字典State
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
  // 表格多选框State
  const [ids, setIds] = useState<Key[]>([]);
  // Table action 的引用，便于自定义触发
  const tableActionRef = useRef<ActionType>();
  // Table Form 的引用，便于自定义触发
  const tableFormRef = useRef<ProFormInstance>();

  useEffect(() => {
    (async () => {
      const _dicts = await dict.getDicts(['sys_job_group', 'sys_job_status']);
      setDicts(_dicts);
    })();
  }, []);

  // 表格获取信息列表
  const getList = (params: JobItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listJob(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<JobItem>[] = [
    {
      title: '任务编号',
      dataIndex: 'jobId',
      width: 25,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 25,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_job_status || [] },
      render: (dom, entity) => {
        return (
          <Switch checked={entity.status === '0'} onChange={
            (checked: boolean) => {
              handleStatusChange(checked, entity, tableActionRef);
            }
          } />
        );
      },
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      width: 50,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_job_group || [] },
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_job_group, entity.jobGroup as string)
        );
      },
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      width: 100,
      sorter: true,
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      width: 150,
      sorter: true,
    },
    {
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '修改者',
      dataIndex: 'updateBy',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      width: 70,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => [
        <Access accessible={access['monitor:job:edit']} key="update">
          <JobEditor jobId={entity.jobId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改任务" dicts={dicts}
                     tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['monitor:job:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete([entity.jobId as Key], tableActionRef);
                    }
                  }>删除</Button>
        </Access>,
        <Access accessible={access['monitor:job:changeStatus'] || access['monitor:job:query']} key="more">
          <TableDropdown
            menus={(() => {
              const _menus = [];
              if (access['monitor:job:changeStatus']) {
                _menus.push({
                  key: 'run',
                  name: (
                    <Button icon={<PlayCircleOutlined />} size="small" type="link"
                            onClick={
                              () => {
                                handleRun(entity);
                              }
                            }>执行一次</Button>
                  ),
                });
              }
              if (access['monitor:job:query']) {
                _menus.push({
                  key: 'jobDetail',
                  name: (
                    <JobDetail jobId={entity.jobId} icon={<EyeOutlined />} disabled={false} type="link" content="任务详细" title="任务详细" dicts={dicts} />
                  ),
                });
              }
              if (access['monitor:job:query']) {
                _menus.push({
                  key: 'jobLog',
                  name: (
                    <JobLog jobId={entity.jobId as Key} dicts={dicts} />
                  ),
                });
              }
              return _menus;
            })()}
          >
            <Button type="link" size="small"><DoubleRightOutlined />更多</Button>
          </TableDropdown>
        </Access>,
      ],
    }
  ];

  // 选择功能的配置
  const tableRowSelection = {
    onChange: (selectedRowKeys: Key[]) => {
      setIds(selectedRowKeys);
    },
  };

  return (
    <PageContainer>
      <ProTable<JobItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-job-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="定时任务信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="jobId"
        rowSelection={{
          type: 'checkbox',
          columnWidth: '30px',
          fixed: true,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          ...tableRowSelection,
        }}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 2600 }}
        toolBarRender={() => [
          <Access accessible={access['monitor:job:add']} key="add">
            <JobEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加任务" dicts={dicts}
                       tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['monitor:job:edit']} key="update">
            <JobEditor jobId={ids[0]} icon={<EditOutlined />} disabled={ids.length !== 1} type="primary" content="修改" title="修改任务" dicts={dicts}
                       tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['monitor:job:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>
              删除
            </Button>
          </Access>,
          <Access accessible={access['monitor:job:export']} key="export">
            <Popconfirm
              title="请确认操作"
              onConfirm={async () => {
                await handleExport(tableFormRef);
              }}
            >
              <Button icon={<ExportOutlined />} size="small" type="primary">
                导出
              </Button>
            </Popconfirm>
          </Access>,
        ]}
      />
    </PageContainer>
  );
};

export default Job;
