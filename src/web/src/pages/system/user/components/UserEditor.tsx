import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import {
  DrawerForm, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect , ActionType
} from '@ant-design/pro-components';
import type { DefaultOptionType, RawValueType } from "rc-tree-select/lib/TreeSelect";

import { dataFormat } from "@/utils";
import type { UserItem } from "../data";
import { addUser, getUser, updateUser } from "../service";
import { getConfigKey } from "../../config/service";

const UserEditor: FC<{
  userId?: Key;
  type?: ButtonType;
  disabled?: boolean;
  content: string;
  icon?: ReactNode;
  title?: ReactNode;
  dicts?: Record<string, { label: string, value: string }[]>;
  deptTreeSelectData?: DefaultOptionType[];
  tableActionRef: MutableRefObject<ActionType | undefined>
}> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 用户信息
  const [userItemState, setUserItemState] = useState<UserItem>({});
  // 岗位选项
  const [postOptions, setPostOptions] = useState<{ value: RawValueType; label: ReactNode; }[]>([]);
  // 角色选项
  const [roleOptions, setRoleOptions] = useState<{ value: RawValueType; label: ReactNode; }[]>([]);

  useEffect(() => {
    if (!modalVisibleState) {
      setUserItemState({});
      setPostOptions([]);
      setRoleOptions([]);
    }
  }, [modalVisibleState]);

  const submitForm = async (value: UserItem) => {
    try {
      if (props.userId) {
        if (!value.userId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateUser(value);
      } else {
        await addUser(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  }

  return (
    <DrawerForm<UserItem>
      onVisibleChange={(visible) => {
        setModalVisibleState(visible);
      }}
      autoFocusFirstInput
      trigger={
        <Button icon={props.icon} size="small" type={props.type ? props.type : 'default'} disabled={props.disabled}>
          {props.content}
        </Button>
      }
      title={props.title}
      width={900}
      onFinish={async (values) => {
        return await submitForm({ ...userItemState, ...values });
      }}
      request={async () => {
        const _userInfo = await getUser(props.userId ? props.userId : '');
        if (props.userId) {
          _userInfo.data.postIds = _userInfo?.postIds;
          _userInfo.data.roleIds = _userInfo?.roleIds;
        } else {
          const _initPassword = await getConfigKey("sys.user.initPassword");
          _userInfo.data = { password: _initPassword as string, status: '0' };
        }
        setPostOptions(dataFormat.optionsDataFormat(_userInfo.posts, 'postName', 'postId'));
        setRoleOptions(dataFormat.optionsDataFormat(_userInfo.roles, 'roleName', 'roleId'));
        setUserItemState(_userInfo.data);
        return _userInfo.data;
      }}
      name={'editorForm'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormText width="md" name="nickName" label="用户昵称" placeholder="请输入用户昵称" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "用户昵称不能为空" },]}
          />
          <ProFormTreeSelect width="md" name="deptId" label="归属部门" placeholder="请选择归属部门" colProps={{ span: 12 }}
                             rules={[{ required: true, message: "归属部门不能为空" },]}
                             request={async () => {
                               return props.deptTreeSelectData as DefaultOptionType[];
                             }}
          />
          <ProFormText width="md" name="phonenumber" label="手机号码" placeholder="请输入手机号码" colProps={{ span: 12 }}
                       rules={[{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码" },]}
          />
          <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱" colProps={{ span: 12 }}
                       rules={[{ type: 'email', message: "请输入正确的邮箱地址" },]}
          />
          {props.userId === undefined && (
            <>
              <ProFormText width="md" name="userName" label="用户名称" placeholder="请输入用户名称" colProps={{ span: 12 }}
                           rules={[
                             { required: true, message: "用户名称不能为空" },
                             { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间' },
                           ]}
              />
              <ProFormText.Password width="md" name="password" label="用户密码" placeholder="请输入用户密码" tooltip="密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符" colProps={{ span: 12 }}
                                    rules={[
                                      { required: true, message: '密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符' },
                                      { pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}/, message: '密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符' },
                                    ]}
              />
            </>
          )}
          <ProFormSelect width="md" name="sex" label="用户性别" placeholder="请选择" fieldProps={{ options: props?.dicts?.sys_user_sex || [] }} colProps={{ span: 12 }}
                         rules={[{ required: true, message: "岗位不能为空" },]}
          />
          <ProFormRadio.Group width="md" name="status" label="状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} colProps={{ span: 12 }} />
          <ProFormSelect width="md" name="postIds" label="岗位" placeholder="请选择" fieldProps={{ mode: 'multiple', options: postOptions }} colProps={{ span: 12 }}
                         rules={[{ required: true, message: "岗位不能为空" },]}
          />
          <ProFormSelect width="md" name="roleIds" label="角色" placeholder="请选择" fieldProps={{ mode: 'multiple', options: roleOptions }} colProps={{ span: 12 }}
                         rules={[{ required: true, message: "角色不能为空" },]}
          />
          <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入内容" colProps={{ span: 12 }} />
        </>
      )}
    </DrawerForm>
  );
}

export default UserEditor;
