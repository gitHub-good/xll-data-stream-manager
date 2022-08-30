import type { FC, Key, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import ProDescriptions from "@ant-design/pro-descriptions";
import { ModalForm } from "@ant-design/pro-form";
import { dict } from "@/utils";
import type { JobItem } from "../data";
import { getJob } from "../service";

const JobDetail: FC<{
  jobId?: Key;
  type?: ButtonType;
  disabled?: boolean;
  content: string;
  icon?: ReactNode;
  title?: ReactNode;
  dicts: Record<string, { label: string, value: string }[]>;
}> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 展示信息
  const [jobItemState, setJobItemState] = useState<JobItem>();

  useEffect(() => {
    if (modalVisibleState) {
      (async function _() {
        if (props.jobId) {
          const _jobItem = await getJob(props.jobId);
          setJobItemState(_jobItem);
        } else {
          message.error({
            content: '未传入任务编号[jobId]'
          });
        }
      })();
    } else {
      setJobItemState(undefined);
    }
  }, [modalVisibleState, props.jobId]);

  return (
    <ModalForm<JobItem>
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
      {(modalVisibleState && jobItemState) && (
        <>
          <ProDescriptions column={2}>
            <ProDescriptions.Item valueType="text" label="任务编号">
              {jobItemState.jobId}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="任务名称">
              {jobItemState.jobName}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="任务分组">
              {dict.selectDictLabel(props.dicts.sys_job_group, jobItemState.jobGroup as string)}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="创建时间">
              {jobItemState.createTime}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="cron表达式">
              {jobItemState.cronExpression}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="下次执行时间">
              {jobItemState.nextValidTime}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" label="调用目标方法">
              {jobItemState.invokeTarget}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="任务状态">
              {dict.selectDictLabel(props.dicts.sys_job_status, jobItemState.status as string)}
            </ProDescriptions.Item>
            <ProDescriptions.Item valueType="text" label="是否并发">
              {jobItemState.concurrent === '0' ? '允许' : '禁止'}
            </ProDescriptions.Item>
            {(jobItemState.status == '1') && (
              <ProDescriptions.Item valueType="text" label="执行策略">
                {(() => {
                  switch (jobItemState.misfirePolicy) {
                    case '0':
                      return '默认策略';
                    case '1':
                      return '立即执行';
                    case '2':
                      return '执行一次';
                    case '3':
                      return '放弃执行';
                    default:
                      return '';
                  }
                })()
                }
              </ProDescriptions.Item>)}
          </ProDescriptions>
        </>
      )}
    </ModalForm>
  );
}

export default JobDetail;
