import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";

import { dict, download, modal } from "@/utils";
import type { DictTypeItem } from "./data";
import { delType, listType, refreshCache } from "./service";
import { DictData, DictTypeEditor } from "./components";

/** 删除 */
const handleDelete = (dictIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除字典编号为"' + dictIds + '"的数据项？'
    , async () => {
      try {
        await delType(dictIds);
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
    '/system/dict/type/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `type_${new Date().getTime()}.xlsx`
  );
};

/** 刷新缓存按钮操作 */
const handleRefreshCache = async () => {
  await refreshCache();
  message.success('刷新缓存成功');
};

const Dict: FC = () => {
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
      const _dicts = await dict.getDicts(['sys_normal_disable']);
      setDicts(_dicts);
    })();
  }, []);

  // 表格获取信息列表
  const getList = (params: DictTypeItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listType(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<DictTypeItem>[] = [
    {
      title: '字典编号',
      dataIndex: 'dictId',
      width: 50,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      width: 70,
      sorter: true,
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      width: 70,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 25,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_normal_disable || [] },
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_normal_disable, entity.status as string)
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 70,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 110,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
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
      width: 120,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => [
        <Access accessible={access['system:dict:edit']} key="data">
          <DictData dictId={entity.dictId as Key} />
        </Access>,
        <Access accessible={access['system:dict:edit']} key="update">
          <DictTypeEditor dictId={entity.dictId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改字典类型" dicts={dicts}
                          tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:dict:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete([entity.dictId as Key], tableActionRef);
                    }
                  }>删除</Button>
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
      <ProTable<DictTypeItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-dict-type-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchFormDictType' }}
        headerTitle="字典类型信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="dictId"
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
        scroll={{ x: 1400 }}
        toolBarRender={() => [
          <Access accessible={access['system:dict:add']} key="add">
            <DictTypeEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加字典类型" dicts={dicts}
                            tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:dict:edit']} key="update">
            <DictTypeEditor dictId={ids[0]} icon={<EditOutlined />} disabled={ids.length !== 1} type="primary" content="修改" title="修改字典类型" dicts={dicts}
                            tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:dict:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>
              删除
            </Button>
          </Access>,
          <Access accessible={access['system:dict:export']} key="export">
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
          <Access accessible={access['system:dict:remove']} key="refresh">
            <Popconfirm
              title="请确认操作"
              onConfirm={handleRefreshCache}
            >
              <Button icon={<SyncOutlined />} size="small" type="primary" danger>
                刷新缓存
              </Button>
            </Popconfirm>
          </Access>,
        ]}
      />
    </PageContainer>
  );
};

export default Dict;
