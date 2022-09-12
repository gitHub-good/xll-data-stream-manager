import type { FC, Key, MutableRefObject, ReactNode } from "react";
import {  useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import {
  DrawerForm, ProFormText, ActionType
} from '@ant-design/pro-components';
import { addFlow, updateFlow, getFlow } from "../service";
import type { FlowItem } from "../data";

const FlowEditor: FC<{
  flowId?: Key;
  flowCode?: string;
  flowName?: string;
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

  // useEffect(() => {
  //   if (!modalVisibleState) {
  //     setDeptItemState({});
  //   }
  // }, [modalVisibleState]);

  // 表单提交处理方法
  const submitForm = async (value: FlowItem) => {
    try {
      if (props.flowId) {
        if (!value.flowId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updateFlow(value);
      } else {
        debugger
        await addFlow(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <DrawerForm<FlowItem>
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
      width={800}
      onFinish={async (values) => {
        return await submitForm({...values, });
      }}
      request={async () => {
        let deptItem: FlowItem = { flowId: props.flowId ? props.flowId : 0};
        if (props.flowId) {
          deptItem = await getFlow(props.flowId);
        }
        return deptItem;
      }}
      name={'editorForm'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormText width="md" name="flowCode" label="流程编码" placeholder="请输入流程编码" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "流程编码不能为空" },]}
          />
          <ProFormText width="md" name="flowName" label="流程名称" placeholder="请输入流程名称" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "流程名称不能为空" },]}
          />
        </>
      )}
    </DrawerForm>
  );
}

export default FlowEditor;
