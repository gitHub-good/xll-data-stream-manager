import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useRef, useState } from "react";
import { Button } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import type { ProFormInstance } from "@ant-design/pro-form";
import { ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-form";
import { ModalForm } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";
import { addConfig, getConfig, updateConfig } from "../service";
import type { ConfigItem } from "../data";

const ConfigEditor: FC<{
  configId?: Key;
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
  // 表单项初始化信息
  const [configItemState, setConfigItemState] = useState<ConfigItem>();

  // 表单引用
  const formRef = useRef<ProFormInstance>();

  // 表单提交处理方法
  const submitForm = async (value: ConfigItem) => {
    try {
      if (props.configId) {
        await updateConfig(value);
      } else {
        await addConfig(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<ConfigItem>
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
      width={500}
      onFinish={async (values) => {
        const _values = { ...configItemState, ...values, };
        return await submitForm(_values);
      }}
      request={async () => {
        let configItem: ConfigItem = { configType: "Y" };
        if (props.configId) {
          configItem = await getConfig(props.configId);
        }
        setConfigItemState(configItem);
        return configItem;
      }}
      formRef={formRef}
      name={'editorForm'}
    >
      {(modalVisibleState) && (
        <>
          <ProFormText width="lg" name="configName" label="参数名称" placeholder="请输入参数名称"
                       rules={[{ required: true, message: "参数名称不能为空" },]}
          />
          <ProFormText width="lg" name="configKey" label="参数键名" placeholder="请输入参数键名"
                       rules={[{ required: true, message: "参数键名不能为空" },]}
          />
          <ProFormText width="lg" name="configValue" label="参数键值" placeholder="请输入参数键值"
                       rules={[{ required: true, message: "参数键值不能为空" },]}
          />
          <ProFormRadio.Group width="lg" name="configType" label="系统内置" fieldProps={{ options: props?.dicts?.sys_yes_no || [] }} />
          <ProFormTextArea width="lg" name="remark" label="备注" placeholder="请输入备注" fieldProps={{ allowClear: true, showCount: true }} />
        </>
      )}
    </ModalForm>
  );
}

export default ConfigEditor;
