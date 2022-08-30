import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";

import { addData, getData, updateData } from "../service";
import type { DictDataItem } from "../data";

const DictDataEditor: FC<{
  dictCode?: Key;
  dictType?: string;
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
  // 字典数据信息状态
  const [dictDataItemState, setDictDataItemState] = useState<DictDataItem>({});

  useEffect(() => {
    if (!modalVisibleState) {
      setDictDataItemState({});
    }
  }, [modalVisibleState]);

  // 表单提交处理方法
  const submitForm = async (value: DictDataItem) => {
    try {
      if (props.dictCode) {
        if (!value.dictCode) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateData(value);
      } else {
        await addData(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<DictDataItem>
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
        return await submitForm({ ...dictDataItemState, ...values, });
      }}
      request={async () => {
        let dictDataItem: DictDataItem = { dictType: props.dictType, dictSort: 0, status: '0' };
        if (props.dictCode) {
          dictDataItem = await getData(props.dictCode);
        }
        setDictDataItemState(dictDataItem);
        return dictDataItem;
      }}
      name={'editorFormDictData'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormText width="md" name="dictType" label="字典类型" placeholder="请输入字典类型" disabled={true} colProps={{ span: 12 }}
                       rules={[{ required: true, message: "字典类型不能为空" },]}
          />
          <ProFormText width="md" name="dictLabel" label="数据标签" placeholder="请输入数据标签" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "数据标签不能为空" },]}
          />
          <ProFormText width="md" name="dictValue" label="数据键值" placeholder="请输入数据键值" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "数据键值不能为空" },]}
          />
          <ProFormText width="md" name="cssClass" label="样式属性" placeholder="请输入样式属性" colProps={{ span: 12 }} />
          <ProFormDigit width="md" name="dictSort" label="显示排序" placeholder="请输入显示排序" colProps={{ span: 12 }}
                        fieldProps={{ precision: 0 }}
                        rules={[{ required: true, message: "显示排序不能为空" },]}
          />
          <ProFormRadio.Group width="md" name="status" label="状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} colProps={{ span: 12 }} />
          <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入备注" fieldProps={{ allowClear: true, showCount: true }} colProps={{ span: 12 }} />
        </>
      )}
    </ModalForm>
  );
}

export default DictDataEditor;
