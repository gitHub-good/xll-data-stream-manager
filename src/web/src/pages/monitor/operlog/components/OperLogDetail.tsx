import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Button } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import ProDescriptions from "@ant-design/pro-descriptions";
import { ModalForm } from "@ant-design/pro-form";
import { dict } from "@/utils";
import type { OperLogItem } from "../data";

const OperLogDetail: FC<{
  operLogItem: OperLogItem;
  type?: ButtonType;
  disabled?: boolean;
  content: string;
  icon?: ReactNode;
  title?: ReactNode;
  dicts: Record<string, { label: string, value: string }[]>;
}> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);

  return (
    <ModalForm<OperLogItem>
      onVisibleChange={(visible) => {
        setModalVisibleState(visible);
      }}
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
      submitter={{
        searchConfig: {
          resetText: '关闭',
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
      name={'infoForm'}
    >
      {(modalVisibleState) && (
        <>
          <ProDescriptions column={2}>
            <ProDescriptions.Item valueType="text" label="操作模块">
              {props.operLogItem.title}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="请求地址">
              {props.operLogItem.operUrl}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="登录信息">
              {props.operLogItem.operName}/{props.operLogItem.operIp}/{props.operLogItem.operLocation}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="请求方式">
              {props.operLogItem.requestMethod}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" label="操作方法">
              {props.operLogItem.method}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="jsonCode" label="请求参数">
              {props.operLogItem.operParam}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="jsonCode" label="返回参数">
              {props.operLogItem.jsonResult}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="操作状态">
              {dict.selectDictLabel(props.dicts.sys_common_status, props.operLogItem.status as string)}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="操作时间">
              {props.operLogItem.operTime}
            </ProDescriptions.Item>
            {(props.operLogItem.status == '1') && (
              <ProDescriptions.Item span={2} valueType="text" label="异常信息">
                {props.operLogItem.errorMsg}
              </ProDescriptions.Item>)}
          </ProDescriptions>
        </>
      )}
    </ModalForm>
  );
}

export default OperLogDetail;
