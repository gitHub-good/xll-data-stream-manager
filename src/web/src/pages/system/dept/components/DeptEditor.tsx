import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText, ProFormTreeSelect } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";
import { dataFormat } from "@/utils";
import { addDept, getDept, listDept, listDeptExcludeChild, updateDept } from "../service";
import type { DeptItem } from "../data";

const DeptEditor: FC<{
  deptId?: Key;
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
  const [deptItemState, setDeptItemState] = useState<DeptItem>({});

  useEffect(() => {
    if (!modalVisibleState) {
      setDeptItemState({});
    }
  }, [modalVisibleState]);

  // 表单提交处理方法
  const submitForm = async (value: DeptItem) => {
    try {
      if (props.deptId) {
        if (!value.deptId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateDept(value);
      } else {
        await addDept(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<DeptItem>
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
        return await submitForm({ ...deptItemState, ...values, });
      }}
      request={async () => {
        let deptItem: DeptItem = { parentId: props.parentId ? props.parentId : 0, status: '0' };
        if (props.deptId) {
          deptItem = await getDept(props.deptId);
        }
        setDeptItemState(deptItem);
        return deptItem;
      }}
      name={'editorForm'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          {(deptItemState?.parentId !== 0) && (
            <ProFormTreeSelect width="md" name="parentId" label="上级部门" placeholder="选择上级部门" allowClear={true} colProps={{ span: 24 }}
                               request={async () => {
                                 const deptList = props.deptId ? (await listDeptExcludeChild(props.deptId)).data : (await listDept({}, {}, {})).data;
                                 const _deptTreeOptions = dataFormat.listToTree(deptList, "deptId");
                                 return dataFormat.treeSelectDataFormat(_deptTreeOptions, 'deptName', 'deptId');
                               }}
                               rules={[{ required: true, message: "上级部门不能为空" },]}
            />
          )}
          <ProFormText width="md" name="deptName" label="部门名称" placeholder="请输入部门名称" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "部门名称不能为空" },]}
          />
          <ProFormDigit width="md" name="orderNum" label="显示排序" placeholder="请输入显示排序" colProps={{ span: 12 }}
                        fieldProps={{ precision: 0 }}
                        rules={[{ required: true, message: "显示排序不能为空" },]}
          />
          <ProFormText width="md" name="leader" label="负责人" placeholder="请输入负责人" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "负责人不能为空" },]}
          />
          <ProFormText width="md" name="phone" label="手机号码" placeholder="请输入手机号码" colProps={{ span: 12 }}
                       rules={[{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码" },]}
          />
          <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱" colProps={{ span: 12 }}
                       rules={[{ type: 'email', message: "请输入正确的邮箱地址" },]}
          />
          <ProFormRadio.Group width="md" name="status" label="部门状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} />
        </>
      )}
    </ModalForm>
  );
}

export default DeptEditor;
