import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useRef, useState } from "react";
import { Button } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ProFormRadio, ProFormSelect, ProFormText } from "@ant-design/pro-form";
import type { ProFormInstance } from "@ant-design/pro-form";
import { ModalForm } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";
import { addJob, getJob, updateJob } from "../service";
import type { JobItem } from "../data";

const JobEditor: FC<{
  jobId?: Key;
  type?: ButtonType;
  disabled?: boolean;
  content: string;
  icon?: ReactNode;
  title?: ReactNode;
  dicts?: Record<string, { label: string, value: string }[]>;
  tableActionRef: MutableRefObject<ActionType | undefined>;
}> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 表单项初始化信息
  const [jobItemState, setJobItemState] = useState<JobItem>();

  // 表单引用
  const formRef = useRef<ProFormInstance>();

  // 表单提交处理方法
  const submitForm = async (value: JobItem) => {
    try {
      if (props.jobId) {
        await updateJob(value);
      } else {
        await addJob(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<JobItem>
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
        const _values = { ...jobItemState, ...values, };
        return await submitForm(_values);
      }}
      request={async () => {
        let jobItem: JobItem = { misfirePolicy: "1", concurrent: '1', status: '0' };
        if (props.jobId) {
          jobItem = await getJob(props.jobId);
        }
        setJobItemState(jobItem);
        return jobItem;
      }}
      formRef={formRef}
      name={'editorForm'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormText width="md" name="jobName" label="任务名称" placeholder="请输入任务名称" colProps={{ span: 12, }}
                       rules={[{ required: true, message: "任务名称不能为空" },]}
          />
          <ProFormSelect width="md" name="jobGroup" label="任务分组" placeholder="请选择任务分组" colProps={{ span: 12, }}
                         fieldProps={{ options: props?.dicts?.sys_job_group || [] }}
                         rules={[{ required: true, message: "任务分组不能为空" },]}
          />
          <ProFormText width="xl" name="invokeTarget" label="调用方法" placeholder="请输入调用方法" colProps={{ span: 24, }}
                       tooltip={
                         <div slot="content">
                           {`Bean调用示例：ryTask.ryParams('ry')`}
                           <br />{`Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')`}
                           <br />{`参数说明：支持字符串，布尔类型，长整型，浮点型，整型`}
                         </div>
                       }
                       rules={[{ required: true, message: "调用方法不能为空" },]}
          />
          <ProFormText width="xl" name="cronExpression" label="cron表达式" placeholder="请输入cron表达式" colProps={{ span: 24, }}
                       rules={[{ required: true, message: "cron表达式不能为空" },]}
          />
          <ProFormRadio.Group width="xl" name="misfirePolicy" label="执行策略" radioType="button" colProps={{ span: 24, }}
                              options={[
                                {
                                  label: '立即执行',
                                  value: '1',
                                },
                                {
                                  label: '执行一次',
                                  value: '2',
                                },
                                {
                                  label: '放弃执行',
                                  value: '3',
                                },
                              ]}
          />
          <ProFormRadio.Group width="sm" name="concurrent" label="是否并发" radioType="button" colProps={{ span: 12, }}
                              options={[
                                {
                                  label: '允许',
                                  value: '0',
                                },
                                {
                                  label: '禁止',
                                  value: '1',
                                },
                              ]}
          />
          <ProFormRadio.Group width="sm" name="status" label="状态" colProps={{ span: 12, }}
                              options={props?.dicts?.sys_job_status || []} />
        </>
      )}
    </ModalForm>
  );
};

export default JobEditor;
