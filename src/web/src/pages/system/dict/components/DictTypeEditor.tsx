import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ModalForm, ProFormGroup, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";

import { addType, getType, updateType } from "../service";
import type { DictTypeItem } from "../data";

const DictTypeEditor: FC<{
  dictId?: Key;
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
  // 字典类型信息状态
  const [dictTypeItemState, setDictTypeItemState] = useState<DictTypeItem>({});

  useEffect(() => {
    if (!modalVisibleState) {
      setDictTypeItemState({});
    }
  }, [modalVisibleState]);

  // 表单提交处理方法
  const submitForm = async (value: DictTypeItem) => {
    try {
      if (props.dictId) {
        if (!value.dictId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateType(value);
      } else {
        await addType(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<DictTypeItem>
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
        return await submitForm({ ...dictTypeItemState, ...values, });
      }}
      request={async () => {
        let dictTypeItem: DictTypeItem = { status: '0' };
        if (props.dictId) {
          dictTypeItem = await getType(props.dictId);
        }
        setDictTypeItemState(dictTypeItem);
        return dictTypeItem;
      }}
      name={'editorFormDictType'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormGroup>
            <ProFormText width="md" name="dictName" label="字典名称" placeholder="请输入字典名称" colProps={{ span: 12 }}
                         rules={[{ required: true, message: "字典名称不能为空" },]}
            />
            <ProFormText width="md" name="dictType" label="字典类型" placeholder="请输入字典类型" colProps={{ span: 12 }}
                         rules={[{ required: true, message: "字典类型不能为空" },]}
            />
          </ProFormGroup>
          <ProFormGroup>
            <ProFormRadio.Group width="md" name="status" label="字典状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} colProps={{ span: 24 }} />
          </ProFormGroup>
          <ProFormGroup>
            <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入备注" fieldProps={{ allowClear: true, showCount: true }} colProps={{ span: 12 }} />
          </ProFormGroup>
        </>
      )}
    </ModalForm>
  );
}

export default DictTypeEditor;
