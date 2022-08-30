import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, ExportOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dict, download, modal } from "@/utils";
import type { LoginInfoItem } from "./data";
import { delLoginInfo, listLoginInfo, cleanLoginInfo, unlockLogininfor } from "./service";

/** 删除 */
const handleDelete = (infoIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除访问编号为"' + infoIds + '"的数据项？'
    , async () => {
      try {
        await delLoginInfo(infoIds);
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
const handleExport = async (tableFormRef: MutableRefObject<ProFormInstance | undefined>) => {
  await download.commonDownload(
    '/monitor/logininfor/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `logininfo_${new Date().getTime()}.xlsx`
  );
};

/** 清空按钮操作 */
const handleClean = async (tableActionRef: MutableRefObject<ActionType | undefined>) => {
  await cleanLoginInfo();
  tableActionRef?.current?.reload?.();
  message.success('清空成功');
};

/** 解锁按钮操作 */
const handleUnlock = async (userName: string, tableActionRef: MutableRefObject<ActionType | undefined>) => {
  await unlockLogininfor(userName);
  tableActionRef?.current?.reload?.();
  message.success('解锁成功');
};

const LoginInfor: FC = () => {
  // 获取权限相关信息
  const access = useAccess();
  // 字典State
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
  // 表格多选框State
  const [ids, setIds] = useState<Key[]>([]);
  const [selectedRowsState, setSelectedRowsState] = useState<LoginInfoItem[]>([]);
  // Table action 的引用，便于自定义触发
  const tableActionRef = useRef<ActionType>();
  // Table Form 的引用，便于自定义触发
  const tableFormRef = useRef<ProFormInstance>();

  useEffect(() => {
    (async () => {
      const _dicts = await dict.getDicts(['sys_common_status']);
      setDicts(_dicts);
    })();
  }, []);

  // 表格获取信息列表
  const getList = (params: LoginInfoItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listLoginInfo(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<LoginInfoItem>[] = [
    {
      title: '访问编号',
      dataIndex: 'infoId',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      width: 100,
      sorter: true,
    },
    {
      title: '登录地址',
      dataIndex: 'ipaddr',
      width: 100,
      sorter: true,
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '登录状态',
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
      title: '操作信息',
      dataIndex: 'msg',
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '登录日期',
      dataIndex: 'loginTime',
      width: 110,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '登录日期',
      dataIndex: 'loginTime',
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
  ];

  // 选择功能的配置
  const tableRowSelection = {
    onChange: (selectedRowKeys: Key[], selectedRows: LoginInfoItem[]) => {
      setIds(selectedRowKeys);
      setSelectedRowsState(selectedRows);
    },
  };

  return (
    <PageContainer>
      <ProTable<LoginInfoItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-logininfo-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="登录日志信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="infoId"
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
        scroll={{ x: 1600 }}
        toolBarRender={() => [
          <Access accessible={access['monitor:logininfor:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>
              删除
            </Button>
          </Access>,
          <Access accessible={access['monitor:logininfor:remove']} key="refresh">
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
          <Access accessible={access['monitor:logininfor:unlock']} key="unlock">
            <Popconfirm
              title="请确认操作"
              onConfirm={async () => {
                await handleUnlock(selectedRowsState[0].userName as string, tableActionRef);
              }}
              disabled={selectedRowsState.length !== 1}
            >
              <Button icon={<UnlockOutlined />} size="small" type="primary" disabled={selectedRowsState.length !== 1}>
                解锁
              </Button>
            </Popconfirm>
          </Access>,
          <Access accessible={access['monitor:logininfor:export']} key="export">
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

export default LoginInfor;
