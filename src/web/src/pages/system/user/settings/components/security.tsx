import type { FC } from 'react';
import { ProForm, ProFormText } from "@ant-design/pro-form";
import { Col, message, Row } from 'antd'
import { updateUserPwd } from "../../service";

const SecurityView: FC = () => {
  return (
    <>
      <ProForm<{ oldPassword: string; newPassword: string; confirmPassword: string; }>
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={
          async (formData) => {
            await updateUserPwd(formData.oldPassword, formData.newPassword);
            message.success('更新基本信息成功');
            return true;
          }
        }
        submitter={{
          searchConfig: {
            submitText: '更新密码',
          },
          render: (props, doms) => {
            return (
              <Row>
                <Col span={18} offset={6}>
                  {doms[1]}
                </Col>
              </Row>
            )
          },
        }}
      >
        <ProFormText.Password width="md" name="oldPassword" label="旧密码" placeholder="请输入旧密码"
                              rules={[{ required: true, message: '请输入旧密码!' }]}
        />
        <ProFormText.Password width="md" name="newPassword" label="新密码" placeholder="请输入新密码" tooltip="密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符"
                              rules={[
                                { required: true, message: '密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符' },
                                { pattern: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}/, message: '密码中必须包含大字母、小字母、数字、特殊字符，至少8个字符，最多20个字符' },
                                ({ getFieldValue }) => ({
                                  validator: (rule, value) => {
                                    if (!value || getFieldValue('oldPassword') !== value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('新密码不能与旧密码相同！'));
                                  },
                                }),
                              ]}
        />
        <ProFormText.Password width="md" name="confirmPassword" label="确认密码" placeholder="请输入确认密码"
                              dependencies={['newPassword']}
                              rules={[
                                { required: true, message: '请输入确认密码!' },
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('新密码两次输入不一致！'));
                                  },
                                }),
                              ]}
        />
      </ProForm>
    </>
  );
};

export default SecurityView;
