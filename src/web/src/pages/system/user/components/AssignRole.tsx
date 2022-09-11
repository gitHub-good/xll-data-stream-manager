import { useState } from "react";
import type { FC, Key } from "react";
import { Button, message, Table } from "antd";
import {
  DrawerForm, ProFormGroup, ProFormText, ProTable, ProColumns
} from '@ant-design/pro-components';
import type { RoleItem } from "@/pages/system/role/data";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { UserItem } from "../data";
import { getAuthRole, updateAuthRole } from "../service";

const AssignRole: FC<{ userId: Key }> = (props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [user, setUser] = useState<UserItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // 获取用户和角色信息
  const getAuthRoleInfo = async (): Promise<{ success: boolean, data: RoleItem[] }> => {
    const result = await getAuthRole(props.userId);
    setUser(result.user);
    setSelectedRowKeys(result.user.roles?.map(value => value.roleId as Key) as Key[]);
    return { success: true, data: result.roles };
  }

  // 表单提交按钮处理
  const handleSubmit = async () => {
    try {
      await updateAuthRole({ userId: props.userId, roleIds: selectedRowKeys });
      message.success('授权成功');
    } catch (e) {
      return false;
    }
    return true;
  }

  // 表格列的配置描述
  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      width: 50,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 50,
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      width: 50,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 50,
    },
  ]

  // 选择功能的配置
  const tableRowSelection = {
    onChange: (_selectedRowKeys: Key[]) => {
      setSelectedRowKeys(_selectedRowKeys);
    },
  };

  return (
    <DrawerForm<{
      nickName: string;
      userName: string;
    }>
      onVisibleChange={(visible) => {
        setModalVisible(visible);
      }}
      autoFocusFirstInput
      trigger={
        <Button icon={<CheckCircleOutlined />} size="small" type="text">
          分配角色
        </Button>
      }
      title="用户分配角色"
      width={900}
      onFinish={async () => {
        return await handleSubmit();
      }}
    >
      {modalVisible && (
        <>
          <ProFormGroup label="基本信息">
            <ProFormText width="md" name="nickName" label="用户昵称" disabled={true} fieldProps={{ value: user?.nickName }} />
            <ProFormText width="md" name="userName" label="登录账号" disabled={true} fieldProps={{ value: user?.userName }} />
          </ProFormGroup>
          <ProTable<RoleItem>
            columns={columns}
            search={false}
            dateFormatter="string"
            headerTitle="角色信息"
            defaultSize={"small"}
            rowKey="roleId"
            rowSelection={{
              type: 'checkbox',
              columnWidth: '30px',
              fixed: true,
              selectedRowKeys,
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              ...tableRowSelection,
            }}
            pagination={false}
            request={getAuthRoleInfo}
            scroll={{ x: 900, y: 200 }}
          />
        </>
      )}
    </DrawerForm>
  );
}

export default AssignRole;
