import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Button } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import ProDescriptions from "@ant-design/pro-descriptions";
import { ModalForm } from "@ant-design/pro-form";
import { dict } from "@/utils";
import type { JobLogItem } from "./data";

const JobLogDetail: FC<{
  jobLogItem: JobLogItem;
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
    <ModalForm<JobLogItem>
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
            <ProDescriptions.Item valueType="text" label="日志序号">
              {props.jobLogItem.jobLogId}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="任务分组">
              {dict.selectDictLabel(props.dicts.sys_job_group, props.jobLogItem.jobGroup as string) + '[' + props.jobLogItem.jobGroup + ']'}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="任务名称">
              {props.jobLogItem.jobName}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="执行时间">
              {props.jobLogItem.createTime}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" label="调用方法">
              {props.jobLogItem.invokeTarget}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" label="日志信息">
              {props.jobLogItem.jobMessage}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" label="任务状态">
              {dict.selectDictLabel(props.dicts.sys_common_status, props.jobLogItem.status as string)}
            </ProDescriptions.Item>
            {(props.jobLogItem.status === '1') && (
              <ProDescriptions.Item span={2} valueType="text" label="异常信息">
                {props.jobLogItem.exceptionInfo}
              </ProDescriptions.Item>)}
          </ProDescriptions>
        </>
      )}
    </ModalForm>
  );
}

export default JobLogDetail;
