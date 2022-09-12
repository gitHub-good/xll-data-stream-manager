import type { FC, Key, MutableRefObject, ReactText } from "react";
import {useRef, useState } from "react";
// import { useAccess } from "umi";
import {
  PageContainer, ProColumns, ActionType, ProTable, ProFormInstance
} from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { modal } from "@/utils";
import type { FlowItem } from "./data";
import { delFlow, listFlow } from "./service";
import { FlowEditor } from "./components";

/** 删除 */
const handleDelete = (noticeIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除公告编号为"' + noticeIds + '"的数据项？'
    , async () => {
      try {
        await delFlow(noticeIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

const LineFlow: FC = () => {
  // 获取权限相关信息
  // const access = useAccess();
  // 字典State
  // const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
  // 表格多选框State
  const [ids, setIds] = useState<Key[]>([]);
  // Table action 的引用，便于自定义触发
  const tableActionRef = useRef<ActionType>();
  // Table Form 的引用，便于自定义触发
  const tableFormRef = useRef<ProFormInstance>();

  // useEffect(() => {
  //   (async () => {
  //     const _dicts = await dict.getDicts(['sys_notice_status', 'sys_notice_type']);
  //     setDicts(_dicts);
  //   })();
  // }, []);

  // 表格获取信息列表
  const getList = (params: FlowItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listFlow(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<FlowItem>[] = [
    {
      title: '序号',
      dataIndex: 'flowId',
      width: 50,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '流程编号',
      dataIndex: 'flowCode',
      width: 100,
      sorter: true,
    },
    {
      title: '流程名称',
      dataIndex: 'flowName',
      width: 100,
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
        <Button icon={<EditOutlined />} size="small" type="link">
          修改
        </Button>,
        <Button icon={<DeleteOutlined />} size="small" type="link"
                onClick={
                  () => {
                    handleDelete([entity.flowId as Key], tableActionRef);
                  }
                }>
          删除
        </Button>,
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
      <ProTable<FlowItem>
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
        headerTitle="编排信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="flowId"
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

          <FlowEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加流程"
                      tableActionRef={tableActionRef} />,
          <Button icon={<EditOutlined />} size="small" type="primary" disabled={ids.length !== 1}>
            修改
          </Button>,
          <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                  onClick={() => {
                    handleDelete(ids, tableActionRef);
                  }}>
            删除
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default LineFlow;
