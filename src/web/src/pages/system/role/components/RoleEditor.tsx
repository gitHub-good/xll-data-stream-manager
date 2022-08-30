import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message, Tree } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ModalForm, ProFormDigit, ProFormGroup, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";
import type { DataNode } from "rc-tree/lib/interface";

import { dataFormat } from "@/utils";
import { addRole, getRole, updateRole } from "../service";
import { roleMenuTreeselect, treeselect as menuTreeselect } from "../../menu/service";
import type { RoleItem } from "../data";

const RoleEditor: FC<{
  roleId?: Key;
  type?: ButtonType;
  disabled?: boolean;
  content: string;
  icon?: ReactNode;
  title?: ReactNode;
  dicts?: Record<string, { label: string, value: string }[]>;
  tableActionRef: MutableRefObject<ActionType | undefined>
}> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 角色信息
  const [roleItemState, setRoleItemState] = useState<RoleItem>({});
  // Tree数据
  const [menuTreeDataState, setMenuTreeDataState] = useState<DataNode[]>([]);
  // (受控)选中复选框的树节点
  const [menuTreeCheckedKeysState, setMenuTreeCheckedKeysState] = useState<Key[]>([]);
  // (受控)半选中复选框的树节点
  const [menuTreeHalfCheckedKeysState, setMenuTreeHalfCheckedKeysState] = useState<Key[]>([]);

  useEffect(() => {
    // 表单对话框开启、关闭时执行
    if (modalVisibleState) {
      (async () => {
        if (props.roleId) {
          // 根据角色ID查询菜单树结构以及checkedKeys
          const _roleMenuTreeResult = await roleMenuTreeselect(props.roleId);
          // 转换树组件的treeData数据
          const _menuTreeData = dataFormat.treeDataFormat(_roleMenuTreeResult.menus);
          setMenuTreeDataState(_menuTreeData);
          setMenuTreeCheckedKeysState(_roleMenuTreeResult.checkedKeys);
          setMenuTreeHalfCheckedKeysState(_roleMenuTreeResult.halfCheckedKeys);
        } else {
          const _menuTreeResult = await menuTreeselect();
          const _menuTreeData = dataFormat.treeDataFormat(_menuTreeResult.data);
          setMenuTreeDataState(_menuTreeData);
        }
      })();
    } else {
      setRoleItemState({});
      setMenuTreeDataState([]);
      setMenuTreeCheckedKeysState([]);
      setMenuTreeHalfCheckedKeysState([]);
    }
  }, [modalVisibleState, props.roleId]);

  const submitForm = async (value: RoleItem) => {
    try {
      if (props.roleId) {
        if (!value.roleId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateRole(value);
      } else {
        await addRole(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<RoleItem>
      onVisibleChange={(visible) => {
        setModalVisibleState(visible);
      }}
      autoFocusFirstInput
      trigger={
        <Button icon={props.icon} size="small" type={props.type ? props.type : 'default'} disabled={props.disabled}>
          {props.content}
        </Button>
      }
      modalProps={
        {
          centered: true,
          destroyOnClose: true,
          keyboard: false,
          maskClosable: false,
        }
      }
      title={props.title}
      width={900}
      onFinish={async (values) => {
        values.menuIds = menuTreeCheckedKeysState;
        values.menuHalfCheckedIds = menuTreeHalfCheckedKeysState;
        return await submitForm({ ...roleItemState, ...values, });
      }}
      request={async () => {
        let roleItem: RoleItem = { roleSort: 0, status: '0' };
        if (props.roleId) {
          roleItem = await getRole(props.roleId);
        }
        setRoleItemState(roleItem);
        return roleItem;
      }}
      name={'editorForm'}
    >
      {(modalVisibleState) && (
        <>
          <ProFormGroup>
            <ProFormText width="md" name="roleName" label="角色名称" placeholder="请输入角色名称"
                         rules={[{ required: true, message: "角色名称不能为空" },]}
            />
            <ProFormText width="md" name="roleKey" label="权限字符" placeholder="请输入权限字符" tooltip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                         rules={[{ required: true, message: "权限字符不能为空" },]}
            />
          </ProFormGroup>
          <ProFormGroup>
            <ProFormDigit width="md" name="roleSort" label="角色顺序" placeholder="请输入权限字符" min={0} fieldProps={{ precision: 0 }}
                          rules={[{ required: true, message: "角色顺序不能为空" },]}
            />
            <ProFormRadio.Group width="md" name="status" label="状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} />
          </ProFormGroup>
          <Tree
            checkable={true}// 节点前添加 Checkbox 复选框
            checkedKeys={menuTreeCheckedKeysState}// (受控)选中复选框的树节点(注意：父子节点有关联，如果传入父节点 key，则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。)
            checkStrictly={false}// checkable 状态下节点选择完全受控(父子节点选中状态不再关联)
            height={200}
            // 点击复选框触发
            onCheck={
              (checked, info) => {
                setMenuTreeCheckedKeysState(checked as Key[]);
                setMenuTreeHalfCheckedKeysState(info.halfCheckedKeys as Key[]);
              }
            }
            treeData={menuTreeDataState}
          />
          <ProFormGroup>
            <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入内容" />
          </ProFormGroup>
        </>
      )}
    </ModalForm>
  );
}

export default RoleEditor;
