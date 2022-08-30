import type { FC, Key } from 'react';
import { Button, message } from 'antd';
import { ModalForm, ProFormText } from "@ant-design/pro-form";
import { KeyOutlined } from '@ant-design/icons';
import type { UserItem } from "../data";
import { resetUserPwd } from "../service";

/** 重置密码 */
const handleResetPwd = async (entity: UserItem, password: string) => {
  try {
    await resetUserPwd(entity.userId as Key, password);
    message.success(`修改成功，新密码是：${password}`);
  } catch (e) {
    return false;
  }
  return true;
}

const RestPassword: FC<UserItem> = (props) => {
  return (
    <ModalForm<{
      password: string;
    }>
      autoFocusFirstInput
      trigger={
        <Button icon={<KeyOutlined />} type="text" size='small'>
          重置密码
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
      title="重置密码"
      width={300}
      onFinish={async (values) => {
        return await handleResetPwd(props, values.password);
      }}
    >
      <ProFormText.Password
        width="md"
        name="password"
        label={`请输入"${props.userName}"的新密码`}
        tooltip="密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符"
        placeholder="请输入新密码"
        rules={[
          { required: true, message: '密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符' },
          { pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}/, message: '密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符' },
        ]}
      />
    </ModalForm>
  );
};

export default RestPassword;
