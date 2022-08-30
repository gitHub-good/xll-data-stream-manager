import type { FC, Key, ReactText, MutableRefObject } from "react";
import { useState } from "react";
import { Button, message, Table } from 'antd';
import type { SortOrder } from "antd/lib/table/interface";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { CloseCircleOutlined } from "@ant-design/icons";
import { dict, modal } from "@/utils";
import { allocatedUserList, authUserCancel, authUserCancelAll } from "../service";
import type { UserItem } from "../../user/data";

const AssignUserAllocatedTable: FC<{
  roleId: Key;
  allocatedTableActionRef: MutableRefObject<ActionType | undefined>;
  refreshAllTables: () => void;
  dicts: Record<string, { label: string, value: string }[]>;
}> = (props) => {

  const [ids, setIds] = useState<Key[]>([]);

  // 单用户取消
  const handleAuthUserCancel = async (entity: UserItem) => {
    const _modal = modal.confirm(
      '确认要取消该用户"' + entity.userName + '"角色吗？'
      , async () => {
        try {
          await authUserCancel({ userId: entity.userId as Key, roleId: props.roleId });
          props.refreshAllTables();
          message.success('取消授权成功');
        } catch (e) {
          _modal.destroy();
        }
        props.refreshAllTables();
      }
    );
  }

  // 多用户取消
  const handleAuthUsersCancel = async () => {
    const _modal = modal.confirm(
      '是否取消选中用户授权数据项？'
      , async () => {
        try {
          await authUserCancelAll({ userIds: ids, roleId: props.roleId });
          props.refreshAllTables();
          message.success('取消授权成功');
        } catch (e) {
          _modal.destroy();
        }
        props.refreshAllTables();
      }
    );
  }

  // 获取用户信息列表
  const getList = (params: { roleId?: Key; userName?: string; phonenumber?: string; } & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    params.roleId = props.roleId;
    return allocatedUserList(params, sort, filter);
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: '用户名称',
      dataIndex: 'userName',
      width: 50,
      sorter: true,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 50,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '手机',
      dataIndex: 'phonenumber',
      width: 50,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 25,
      hideInSearch: true,
      sorter: true,
      render: (dom, entity) => {
        return dict.selectDictLabel(props.dicts.sys_normal_disable, entity.status as string);
      },
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
      width: 50,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) =>
        [
          <Button key="handleAuthUserCancel" icon={<CloseCircleOutlined />} size="small" type="link" danger onClick={async () => {
            await handleAuthUserCancel(entity);
          }}>
            取消
          </Button>,
        ],
    },
  ];

  // 选择功能的配置
  const tableRowSelection = {
    onChange: (selectedRowKeys: Key[]) => {
      setIds(selectedRowKeys);
    },
  };

  return (
    <ProTable<UserItem>
      actionRef={props.allocatedTableActionRef}
      bordered={true}
      columns={columns}
      columnsState={{
        persistenceKey: 'system-role-user-allocated-table-columns-state',
        persistenceType: 'localStorage',
      }}
      dateFormatter="string"
      form={{ name: 'allocatedTableForm' }}
      headerTitle="已授权用户"
      defaultSize={"small"}
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
        showQuickJumper: true,
        showSizeChanger: true,
      }}
      request={getList}
      rowKey="userId"
      rowSelection={{
        type: 'checkbox',
        columnWidth: '30px',
        fixed: true,
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        ...tableRowSelection,
      }}
      search={{
        filterType: 'light',
      }}
      scroll={{ x: 1000 }}
      toolBarRender={() => [
        <Button key="authUsersCancel" icon={<CloseCircleOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                onClick={handleAuthUsersCancel}>
          批量取消
        </Button>,
      ]}
      options={false}
    />
  );
};

export default AssignUserAllocatedTable;
