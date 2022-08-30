import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText, ProFormTreeSelect } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";

import { dataFormat } from "@/utils";
import { addMenu, getMenu, listMenu, updateMenu } from "../service";
import type { MenuItem } from "../data";

const MenuEditor: FC<{
  menuId?: Key;
  parentId?: Key;
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
  // 菜单信息状态
  const [menuItemState, setMenuItemState] = useState<MenuItem>({});
  // 菜单类型状态
  const [menuTypeState, setMenuTypeState] = useState<string>('M');

  useEffect(() => {
    if (!modalVisibleState) {
      setMenuItemState({});
      setMenuTypeState('M');
    }
  }, [modalVisibleState]);

  // 表单提交处理方法
  const submitForm = async (value: MenuItem) => {
    try {
      if (props.menuId) {
        if (!value.menuId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateMenu(value);
      } else {
        await addMenu(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<MenuItem>
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
      width={800}
      onFinish={async (values) => {
        const _values = { ...menuItemState, ...values, };
        if (_values.menuType === 'M') {
          _values.perms = '';
        }
        return await submitForm(_values);
      }}
      request={async () => {
        let menuItem: MenuItem = { parentId: props.parentId ? props.parentId : 0, menuType: 'M', status: '0' };
        if (props.menuId) {
          menuItem = await getMenu(props.menuId);
        }
        setMenuItemState(menuItem);
        setMenuTypeState(menuItem.menuType as string);
        return menuItem;
      }}
      name={'editorForm'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormTreeSelect width="md" name="parentId" label="上级菜单" placeholder="选择上级菜单" colProps={{ span: 24 }}
                             request={async () => {
                               const menuList = await listMenu({}, {}, {});
                               const _menuTreeOptions = [];
                               const menu = { menuId: 0, menuName: '主类目', children: [{}] };
                               menu.children = dataFormat.listToTree(menuList.data, "menuId");
                               _menuTreeOptions.push(menu);
                               return dataFormat.treeSelectDataFormat(_menuTreeOptions, 'menuName', 'menuId');
                             }}
                             rules={[{ required: true, message: "上级菜单不能为空" },]}
          />
          <ProFormRadio.Group width="md" name="menuType" label="菜单类型" colProps={{ span: 24 }}
                              options={[{
                                label: '目录',
                                value: 'M',
                              },
                                {
                                  label: '菜单',
                                  value: 'C',
                                },
                                {
                                  label: '按钮',
                                  value: 'F',
                                },]}
                              fieldProps={{
                                onChange: (e) => {
                                  setMenuTypeState(e.target.value);
                                }
                              }}
          />
          <ProFormText width="md" name="menuName" label="菜单名称" placeholder="请输入菜单名称" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "菜单名称不能为空" },]}
          />
          <ProFormDigit width="md" name="orderNum" label="显示排序" placeholder="请输入显示排序" colProps={{ span: 12 }}
                        fieldProps={{ precision: 0 }}
                        rules={[{ required: true, message: "显示排序不能为空" },]}
          />
          {(menuTypeState !== 'M') && (
            <ProFormText width="md" name="perms" label="权限标识" placeholder="请输入权限标识" colProps={{ span: 24 }}
                         tooltip="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                         rules={[{ required: true, message: "权限标识不能为空" },]}
            />
          )}
          <ProFormRadio.Group width="md" name="status" label="菜单状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} colProps={{ span: 12 }} />
        </>
      )}
    </ModalForm>
  );
}

export default MenuEditor;
