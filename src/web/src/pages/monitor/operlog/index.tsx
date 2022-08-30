import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, ExportOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dict, download, modal } from "@/utils";
import type { OperLogItem } from "./data";
import { delOperlog, listOperlog, cleanOperlog } from "./service";
import { OperLogDetail } from './components'

/** 删除 */
const handleDelete = (operIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除日志编号为"' + operIds + '"的数据项？'
    , async () => {
      try {
        await delOperlog(operIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

/** 导出 */
const handleExport = async (tableFormRef: MutableRefObject<ProFormInstance | undefined>) => {
  await download.commonDownload(
    '/monitor/operlog/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `operlog_${new Date().getTime()}.xlsx`
  );
}

/** 清空按钮操作 */
const handleClean = async (tableActionRef: MutableRefObject<ActionType | undefined>) => {
  await cleanOperlog();
  tableActionRef?.current?.reload?.();
  message.success('清空成功');
};

const OperLog: FC = () => {
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
      const _dicts = await dict.getDicts(['sys_oper_type', 'sys_common_status']);
      setDicts(_dicts);
    })();
  }, []);

  // 表格获取信息列表
  const getList = (params: OperLogItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listOperlog(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<OperLogItem>[] = [
    {
      title: '日志编号',
      dataIndex: 'operId',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '系统模块',
      dataIndex: 'title',
      width: 100,
      sorter: true,
    },
    {
      title: '操作类型',
      dataIndex: 'businessType',
      width: 100,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_oper_type || [] },
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_oper_type, entity.businessType as string)
        );
      },
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
      width: 100,
      sorter: true,
    },
    {
      title: '操作地址',
      dataIndex: 'operIp',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作地点',
      dataIndex: 'operLocation',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      width: 50,
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
      title: '操作日期',
      dataIndex: 'operTime',
      width: 110,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '操作日期',
      dataIndex: 'operTime',
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
      width: 100,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => [
        <Access accessible={access['monitor:operlog:query']} key="info">
          <OperLogDetail operLogItem={entity} icon={<EyeOutlined />} disabled={false} type="link" content="详细" title="操作日志详细" dicts={dicts} />
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
      <ProTable<OperLogItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-operlog-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="操作日志信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="operId"
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
        scroll={{ x: 2500 }}
        toolBarRender={() => [
          <Access accessible={access['monitor:operlog:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>
              删除
            </Button>
          </Access>,
          <Access accessible={access['monitor:operlog:remove']} key="refresh">
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
          <Access accessible={access['monitor:operlog:export']} key="export">
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

export default OperLog;
