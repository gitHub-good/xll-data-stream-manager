import type { FC, Key } from "react";
import { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { MonitorOutlined } from "@ant-design/icons";
import type { JobItem } from "../../data";
import { getJob } from "../../service";
import JobLogTable from "./JobLogTable";

const JobLog: FC<{
  jobId?: Key;
  dicts: Record<string, { label: string, value: string }[]>;
}> = (props) => {
  // 表单对话框显示标识
  const [modalVisibleState, setModalVisibleState] = useState<boolean>(false);
  // 任务信息状态
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
    <>
      <Button icon={<MonitorOutlined />} type="link" size='small' onClick={() => setModalVisibleState(true)}>
        调度日志
      </Button>
      <Modal
        title='调度日志'
        centered={false}
        destroyOnClose={true}
        keyboard={false}
        maskClosable={false}
        visible={modalVisibleState}
        onOk={() => setModalVisibleState(false)}
        onCancel={() => setModalVisibleState(false)}
        width={'100%'}
        footer={
          <Button type="default" size='small' onClick={() => setModalVisibleState(false)}>
            关闭
          </Button>
        }
      >
        {(modalVisibleState && jobItemState) && (
          <JobLogTable jobName={jobItemState.jobName as string} jobGroup={jobItemState.jobGroup as string} />
        )}
      </Modal>
    </>
  );
}

export default JobLog;
