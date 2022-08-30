import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dict, modal } from "@/utils";
import type { NoticeItem } from "./data";
import { delNotice, listNotice } from "./service";

/** 删除 */
const handleDelete = (noticeIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除公告编号为"' + noticeIds + '"的数据项？'
    , async () => {
      try {
        await delNotice(noticeIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

const Notice: FC = () => {
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
      const _dicts = await dict.getDicts(['sys_notice_status', 'sys_notice_type']);
      setDicts(_dicts);
    })();
  }, []);

  // 表格获取信息列表
  const getList = (params: NoticeItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listNotice(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<NoticeItem>[] = [
    {
      title: '序号',
      dataIndex: 'noticeId',
      width: 25,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '公告标题',
      dataIndex: 'noticeTitle',
      width: 200,
      sorter: true,
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      width: 50,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_notice_type || [] },
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_notice_type, entity.noticeType as string)
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 25,
      hideInSearch: true,
      sorter: true,
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_notice_status, entity.status as string)
        );
      },
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      width: 50,
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
        <Access accessible={access['system:notice:edit']} key="update">
          <Button icon={<EditOutlined />} size="small" type="link">
            修改
          </Button>
        </Access>,
        <Access accessible={access['system:notice:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete([entity.noticeId as Key], tableActionRef);
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
      <ProTable<NoticeItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-notice-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="公告信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="noticeId"
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
          <Access accessible={access['system:notice:add']} key="add">
            <Button icon={<PlusOutlined />} size="small" type="primary" disabled={false}>
              新增
            </Button>
          </Access>,
          <Access accessible={access['system:notice:edit']} key="update">
            <Button icon={<EditOutlined />} size="small" type="primary" disabled={ids.length !== 1}>
              修改
            </Button>
          </Access>,
          <Access accessible={access['system:notice:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>
              删除
            </Button>
          </Access>,
        ]}
      />
    </PageContainer>
  );
};

export default Notice;
