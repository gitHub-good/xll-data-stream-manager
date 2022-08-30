import type { FC, Key, ReactText, MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { Button, message, Popconfirm, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import ProTable from "@ant-design/pro-table";
import { DeleteOutlined, ExportOutlined, EyeOutlined } from "@ant-design/icons";
import { dict, download, modal } from "@/utils";
import type { JobLogItem } from "./data";
import { cleanJobLog, delJobLog, listJobLog } from "./service";
import JobLogDetail from "./JobLogDetail";

/** 删除 */
const handleDelete = (jobLogIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除调度日志编号为"' + jobLogIds + '"的数据项？'
    , async () => {
      try {
        await delJobLog(jobLogIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
};

/** 导出 */
const handleExport = async (params: JobLogItem) => {
  await download.commonDownload(
    '/monitor/jobLog/export',
    params,
    `jobLog_${new Date().getTime()}.xlsx`
  );
};

/** 清空按钮操作 */
const handleClean = async (tableActionRef: MutableRefObject<ActionType | undefined>) => {
  await cleanJobLog();
  tableActionRef?.current?.reload?.();
  message.success('清空成功');
};

const JobLogTable: FC<{ jobName: string; jobGroup: string }> = (props) => {
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
    tableFormRef?.current?.setFieldsValue({ jobName: props.jobName, jobGroup: props.jobGroup });
    tableFormRef?.current?.submit();
    (async () => {
      const _dicts = await dict.getDicts(['sys_common_status', 'sys_job_group']);
      setDicts(_dicts);
    })();
  }, [props.jobGroup, props.jobName]);

  // 表格获取信息列表
  const getList = (params: JobLogItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listJobLog(params, sort, filter);
  };

  const columns: ProColumns<JobLogItem>[] = [
    {
      title: '日志编号',
      dataIndex: 'jobLogId',
      width: 25,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      width: 25,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_common_status || [] },
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_common_status, entity.status as string)
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
      title: '日志信息',
      dataIndex: 'jobMessage',
      width: 150,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            params: {
              beginTime: value?.[0],
              endTime: value?.[1],
            },
          };
        },
      },
    },
    {
      title: '操作',
      width: 70,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => [
        <Access accessible={access['monitor:job:query']} key="jobLogDetail">
          <JobLogDetail jobLogItem={entity} icon={<EyeOutlined />} disabled={false} type="link" content="详细" title="调度日志详细" dicts={dicts} />
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
    <ProTable<JobLogItem>
      actionRef={tableActionRef}
      formRef={tableFormRef}
      bordered={true}
      columns={columns}
      columnsState={{
        persistenceKey: 'system-jobLog-table-columns-state',
        persistenceType: 'localStorage',
      }}
      dateFormatter="string"
      form={{ name: 'searchFormJobLog' }}
      headerTitle="调度日志信息"
      defaultSize={"small"}
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      request={getList}
      manualRequest={true}
      rowKey="jobLogId"
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
      scroll={{ x: 2600, y: 450 }}
      toolBarRender={() => [
        <Access accessible={access['monitor:job:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                  onClick={() => {
                    handleDelete(ids, tableActionRef);
                  }}>
            删除
          </Button>
        </Access>,
        <Access accessible={access['monitor:job:remove']} key="delete">
          <Popconfirm
            title="请确认操作"
            onConfirm={async () => {
              await handleClean(tableActionRef);
            }}
          >
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger>
              清空
            </Button>
          </Popconfirm>
        </Access>,
        <Access accessible={access['monitor:job:export']} key="export">
          <Popconfirm
            title="请确认操作"
            onConfirm={async () => {
              await handleExport({ ...tableFormRef?.current?.getFieldsFormatValue?.() });
            }}
          >
            <Button icon={<ExportOutlined />} size="small" type="primary">
              导出
            </Button>
          </Popconfirm>
        </Access>,
      ]}
    />
  );
}

export default JobLogTable;
