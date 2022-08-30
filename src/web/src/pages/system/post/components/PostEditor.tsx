import type { FC, Key, MutableRefObject, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import type { ButtonType } from "antd/lib/button/button";
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-form";
import type { ActionType } from "@ant-design/pro-table";

import { addPost, getPost, updatePost } from "../service";
import type { PostItem } from "../data";

const PostEditor: FC<{
  postId?: Key;
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
  // 岗位信息
  const [postItemState, setPostItemState] = useState<PostItem>({});

  useEffect(() => {
    if (!modalVisibleState) {
      setPostItemState({});
    }
  }, [modalVisibleState]);

  // 表单提交处理方法
  const submitForm = async (value: PostItem) => {
    try {
      if (props.postId) {
        if (!value.postId) {
          message.error('无id信息，无法修改。');
          return false;
        }
        await updatePost(value);
      } else {
        await addPost(value);
      }
    } catch (e) {
      return false;
    }
    props.tableActionRef?.current?.reload?.();
    return true;
  };

  return (
    <ModalForm<PostItem>
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
        return await submitForm({ ...postItemState, ...values, });
      }}
      request={async () => {
        let postItem: PostItem = { postSort: 0, status: '0' };
        if (props.postId) {
          postItem = await getPost(props.postId);
        }
        setPostItemState(postItem);
        return postItem;
      }}
      name={'editorForm'}
      grid={true}
    >
      {(modalVisibleState) && (
        <>
          <ProFormText width="md" name="postName" label="岗位名称" placeholder="请输入岗位名称" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "岗位名称不能为空" },]}
          />
          <ProFormText width="md" name="postCode" label="岗位编码" placeholder="请输入岗位编码" colProps={{ span: 12 }}
                       rules={[{ required: true, message: "岗位编码不能为空" },]}
          />
          <ProFormDigit width="md" name="postSort" label="岗位顺序" placeholder="请输入岗位顺序" colProps={{ span: 12 }}
                        fieldProps={{ precision: 0 }}
                        rules={[{ required: true, message: "岗位顺序不能为空" },]}
          />
          <ProFormRadio.Group width="md" name="status" label="岗位状态" fieldProps={{ options: props?.dicts?.sys_normal_disable || [] }} colProps={{ span: 12 }} />
          <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入备注" fieldProps={{ allowClear: true, showCount: true }} colProps={{ span: 12 }} />
        </>
      )}
    </ModalForm>
  );
}

export default PostEditor;
