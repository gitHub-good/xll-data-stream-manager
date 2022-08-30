import { useEffect, useState } from "react";
import type { FC, Key } from "react";
import { Button, message, Tree } from "antd";
import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-form";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { DataNode } from "rc-tree/lib/interface";

import { dataFormat } from "@/utils";
import type { RoleItem } from "../data";
import { dataScope, deptTreeSelect, getRole } from "../service";

// 数据范围选项
const dataScopeOptions = [
  {
    value: "1",
    label: "全部数据权限"
  },
  {
    value: "2",
    label: "自定数据权限"
  },
  {
    value: "3",
    label: "本部门数据权限"
  },
  {
    value: "4",
    label: "本部门及以下数据权限"
  },
  {
    value: "5",
    label: "仅本人数据权限"
  }
];

// 表单提交按钮处理
const handleSubmit = async (value: RoleItem) => {
  try {
    if (!value.roleId) {
      message.error('无id信息，无法修改。');
      return false;
    }
    await dataScope(value);
    message.success('修改成功');
  } catch (e) {
    return false;
  }
  return true;
};

const DeptDataScope: FC<{ roleId: Key }> = (props) => {
  // 对话框是否显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 角色信息数据
  const [roleItemState, setRoleItemState] = useState<RoleItem>({});
  // 当前采用那种数据范围选项
  const [dataScopeState, setDataScopeState] = useState<string>();
  // 部门Tree数据
  const [deptTreeDataState, setDeptTreeDataState] = useState<DataNode[]>([]);
  // (受控)展开指定的树节点
  const [deptTreeExpandedKeysState, setDeptTreeExpandedKeysState] = useState<Key[]>([]);
  // (受控)选中复选框的树节点
  const [deptTreeCheckedKeysState, setDeptTreeCheckedKeysState] = useState<Key[]>([]);
  // (受控)半选中复选框的树节点
  const [deptTreeHalfCheckedKeysState, setDeptTreeHalfCheckedKeysState] = useState<Key[]>([]);

  useEffect(() => {
    // 表单对话框开启、关闭时执行
    if (modalVisibleState) {
      (async () => {
        // 根据角色ID查询部门树结构以及checkedKeys
        const _roleDeptTreeResult = await deptTreeSelect(props.roleId);
        // 转换部门树组件的treeData数据
        const _deptTreeData = dataFormat.treeDataFormat(_roleDeptTreeResult.depts);
        // 所有含子节点的父节点，用于树组件所有父节点展开
        const _deptTreeExpandedKeys = dataFormat.treeToList(_deptTreeData)
          // 获取所有key
          .map(values => values.key)
          // 获取key的父节点key
          .map((value) => dataFormat.getParentKey(value, _deptTreeData) as Key)
          // 过滤掉undefined、null值，并去重
          .filter((item, i, self) => item !== null && typeof item !== 'undefined' && self.indexOf(item) === i);
        // 部门Tree数据
        setDeptTreeDataState(_deptTreeData);
        // (受控)展开指定的树节点
        setDeptTreeExpandedKeysState(_deptTreeExpandedKeys);
        // (受控)选中复选框的树节点
        setDeptTreeCheckedKeysState(_roleDeptTreeResult.checkedKeys);
        // (受控)选中复选框的树节点
        setDeptTreeHalfCheckedKeysState(_roleDeptTreeResult.halfCheckedKeys);
      })();
    } else {
      setRoleItemState({});
      setDataScopeState(undefined);
      setDeptTreeDataState([]);
      setDeptTreeExpandedKeysState([]);
      setDeptTreeCheckedKeysState([]);
      setDeptTreeHalfCheckedKeysState([]);
    }
  }, [modalVisibleState, props.roleId]);

  // 数据范围选择器,选中 option，或 input 的 value 变化时，调用此函数
  const onChangeDataScopeSelect = (value: string) => {
    setDataScopeState(value);
  }

  return (
    <ModalForm<RoleItem>
      onVisibleChange={(visible) => {
        setModalVisibleState(visible);
      }}
      autoFocusFirstInput
      trigger={
        <Button icon={<CheckCircleOutlined />} size="small" type="text">
          数据权限
        </Button>
      }
      modalProps={
        {
          centered: false,
          destroyOnClose: true,
          keyboard: false,
          maskClosable: false,
        }
      }
      title="分配数据权限"
      width={500}
      onFinish={async (values) => {
        if (values.dataScope === '2') {
          values.deptIds = deptTreeCheckedKeysState;
          values.deptHalfCheckedIds = deptTreeHalfCheckedKeysState;
        } else {
          values.deptIds = [];
          values.deptHalfCheckedIds = [];
        }
        return await handleSubmit({ ...roleItemState, ...values, });
      }}
      request={async () => {
        const roleItem = await getRole(props.roleId);
        setRoleItemState(roleItem);
        setDataScopeState(roleItem.dataScope);
        return roleItem;
      }}
      name={'dataScopeForm'}
    >
      {modalVisibleState && (
        <>
          <ProFormText width="md" name="roleName" label="角色名称" disabled={true} />
          <ProFormText width="md" name="roleKey" label="权限字符" disabled={true} />
          <ProFormSelect width="sm" name="dataScope" label="权限范围" placeholder="请选择权限范围" rules={[{ required: true, message: "权限范围不能为空" },]}
                         fieldProps={{ options: dataScopeOptions, onChange: onChangeDataScopeSelect }} />
          {(dataScopeState === '2') && (
            <>
              <Tree
                checkable={true}// 节点前添加 Checkbox 复选框
                checkedKeys={deptTreeCheckedKeysState}// (受控)选中复选框的树节点(注意：父子节点有关联，如果传入父节点 key，则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。)
                checkStrictly={false}// checkable 状态下节点选择完全受控(父子节点选中状态不再关联)
                expandedKeys={deptTreeExpandedKeysState}// (受控)展开指定的树节点
                height={200}
                // 点击复选框触发
                onCheck={
                  (checked, info) => {
                    setDeptTreeCheckedKeysState(checked as Key[]);
                    setDeptTreeHalfCheckedKeysState(info.halfCheckedKeys as Key[]);
                  }
                }
                // 展开/收起节点时触发
                onExpand={(expandedKeys) => {
                  setDeptTreeExpandedKeysState(expandedKeys);
                }}
                treeData={deptTreeDataState}
              />
            </>
          )}
        </>
      )}
    </ModalForm>
  );
}

export default DeptDataScope;
