import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Upload } from 'antd';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { request, useModel, useRequest } from 'umi';
import ImgCrop from 'antd-img-crop';

import styles from './BaseView.less';
import { getUserProfile, updateUserProfile } from "../../service";
import type { UserItem, UserProfile } from "../../data";
import { dict } from "@/utils";

// 头像组件
const AvatarView: FC<{ avatar: string; run: () => Promise<UserProfile>; }> = ({ avatar, run }) => {
  const { refresh } = useModel('@@initialState');
  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <ImgCrop rotate shape='round'>
        <Upload showUploadList={false} maxCount={1}
                beforeUpload={
                  async (file) => {
                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJpgOrPng) {
                      message.error('只能上传 JPG/PNG 文件！');
                    }
                    console.debug('file', file);
                    const isLt1M = file.size / 1024 / 1024 <= 1;
                    if (!isLt1M) {
                      message.error('图像大小必须小于 1MB！');
                    }
                    return isJpgOrPng && isLt1M;
                  }
                }
                customRequest={async (options) => {
                  const formData = new FormData();
                  formData.append('avatarfile', options.file);
                  await request<{ imgUrl: string } & RuoYiApi.BaseRestResult>('/system/user/profile/avatar', {
                    method: 'POST',
                    requestType: 'form',
                    data: formData,
                  });
                  await refresh();
                  await run();
                }}
        >
          <div className={styles.button_view}>
            <Button icon={<UploadOutlined />}>
              更换头像
            </Button>
          </div>
        </Upload>
      </ImgCrop>
    </>
  )
};

const BaseView: FC = () => {
  const { refresh } = useModel('@@initialState');
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});

  useEffect(() => {
    (async () => {
      const _dicts = await dict.getDicts(['sys_user_sex']);
      setDicts(_dicts);
    })();
  }, []);

  const { data: userInfo, loading, run } = useRequest(() => {
    return getUserProfile();
  });

  const getAvatarURL = () => {
    if (userInfo) {
      if (userInfo.data.avatar) {
        return REACT_APP_BASE_API + userInfo.data.avatar;
      }
      return require('@/assets/images/avatar.png');
    }
    return '';
  };

  const handleFinish = async (data: UserItem) => {
    const _data = { ...userInfo?.data, ...data };
    await updateUserProfile(_data);
    await refresh();
    await run();
    message.success('更新基本信息成功');
  };

  return (
    <div className={styles.baseView}>
      {(!loading) && (
        <>
          <div className={styles.left}>
            <ProForm<UserItem>
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
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
              initialValues={{
                ...userInfo?.data,
              }}
            >
              <ProFormText width="md" label="用户名称" readonly>{userInfo?.data?.userName}</ProFormText>
              <ProFormText width="md" label="所属部门" readonly>{userInfo?.data?.dept?.deptName} / {userInfo?.postGroup}</ProFormText>
              <ProFormText width="md" label="所属角色" readonly>{userInfo?.roleGroup}</ProFormText>
              <ProFormText width="md" label="创建日期" readonly>{userInfo?.data?.createTime}</ProFormText>
              <ProFormText width="md" name="nickName" label="用户昵称"
                           rules={[
                             { required: true, message: '请输入您的昵称!' },
                             { max: 15, message: '长度不能超过15个字符' },
                           ]}
              />
              <ProFormText width="md" name="phonenumber" label="手机号码" placeholder="请输入手机号码"
                           rules={[
                             { required: true, message: '请输入您的手机号码!' },
                             { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码" },
                           ]}
              />
              <ProFormText width="md" name="email" label="邮箱" placeholder="请输入邮箱"
                           rules={[
                             { required: true, message: '请输入您的邮箱!' },
                             { type: 'email', message: "请输入正确的邮箱地址" },
                             { max: 50, message: '长度不能超过50个字符' },
                           ]}
              />
              <ProFormRadio.Group width="md" name="sex" label="性别" fieldProps={{ options: dicts.sys_user_sex || [] }} />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} run={run} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
