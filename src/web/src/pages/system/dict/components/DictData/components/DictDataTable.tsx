import type { FC, Key, ReactText, MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { Button, message, Popconfirm, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import ProTable from "@ant-design/pro-table";
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";

import { dict, download, modal } from "@/utils";
import { delData, listData } from "../service";
import type { DictDataItem } from "../data";
import DictDataEditor from "./DictDataEditor";

/** 删除 */
const handleDelete = (dictCodes: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除字典编码为"' + dictCodes + '"的数据项？'
    , async () => {
      try {
        await delData(dictCodes);
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
const handleExport = async (params: DictDataItem) => {
  await download.commonDownload(
    '/system/dict/data/export',
    params,
    `data_${new Date().getTime()}.xlsx`
  );
};

const DictDataTable: FC<{ dictType: string }> = (props) => {
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
  const getList = (params: DictDataItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    params.dictType = props.dictType;
    return listData(params, sort, filter);
  };

  const columns: ProColumns<DictDataItem>[] = [
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      width: 50,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      width: 70,
      sorter: true,
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      width: 70,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '字典排序',
      dataIndex: 'dictSort',
      width: 70,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 30,
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
      title: '操作',
      width: 100,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => [
        <Access accessible={access['system:dict:edit']} key="update">
          <DictDataEditor dictCode={entity.dictCode} dictType={entity.dictType} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改字典数据" dicts={dicts}
                          tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:dict:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete([entity.dictCode as Key], tableActionRef);
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
    <ProTable<DictDataItem>
      actionRef={tableActionRef}
      formRef={tableFormRef}
      bordered={true}
      columns={columns}
      columnsState={{
        persistenceKey: 'system-dict-data-table-columns-state',
        persistenceType: 'localStorage',
      }}
      dateFormatter="string"
      form={{ name: 'searchFormDictData' }}
      headerTitle="字典数据信息"
      defaultSize={"small"}
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      request={getList}
      rowKey="dictCode"
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
        <Access accessible={access['system:dict:add']} key="add">
          <DictDataEditor dictType={props.dictType} icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加字典数据" dicts={dicts}
                          tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:dict:edit']} key="update">
          <DictDataEditor dictCode={ids[0]} dictType={props.dictType} icon={<EditOutlined />} disabled={ids.length !== 1} type="primary" content="修改" title="修改字典数据" dicts={dicts}
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
              await handleExport({ ...tableFormRef?.current?.getFieldsFormatValue?.(), ...{ dictType: props.dictType } });
            }}
          >
            <Button icon={<ExportOutlined />} size="small" type="primary">
              导出
            </Button>
          </Popconfirm>
        </Access>,
      ]}
    />
  )
}

export default DictDataTable;
