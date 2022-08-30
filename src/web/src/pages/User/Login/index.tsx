import { LockOutlined, MailOutlined, MobileOutlined, SecurityScanOutlined, UserOutlined, } from '@ant-design/icons';
import { Alert, Form, Image, Input, message, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';

import styles from './index.less';
import { getCodeImg, login } from "@/services/ruoyi/login";
import { auth, jsencrypt } from "@/utils";
import Cookies from 'js-cookie';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<RuoYiApi.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  /** 图片验证码接口state */
  const [captchaImage, setCaptchaImage] = useState<RuoYiApi.CaptchaImage>({ captchaEnabled: true, imgUrl: 'error' });

  /** 获取图片验证码接口数据 */
  const getCaptchaImage = async () => {
    try {
      const _captcha = await getCodeImg();
      _captcha.imgUrl = 'data:image/gif;base64,' + _captcha.img;
      _captcha.captchaEnabled = _captcha.captchaEnabled === undefined ? true : _captcha.captchaEnabled;
      setCaptchaImage(_captcha);
    } catch (e) {
      setCaptchaImage({ captchaEnabled: true, imgUrl: 'error' });
      message.error('请点击验证码图片，重新获取验证码图片。');
    }
  }

  useEffect(() => {
    (async () => {
      if (type === 'account') {
        await getCaptchaImage();
      }
    })();
  }, [type]);

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo?.user,
        roles: userInfo?.roles,
        permissions: userInfo?.permissions,
      }));
    }
  };

  // 登录按钮处理方法
  const handleSubmit = async (values: RuoYiApi.LoginParams) => {
    if (type === 'account') {
      // 账户密码登录
      try {
        // 将uudi添加到登录参数对象中
        values.uuid = captchaImage.uuid;
        // 发起登录请求
        const msg = await login({ ...values, type });
        // 登录方式存入登录结果
        msg.type = type;
        // 将token存入Cookies
        if (msg.token) {
          auth.setToken(msg.token);
        }
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        if (values.rememberMe) {
          Cookies.set("username", values.username as string, { expires: 30, });
          Cookies.set("password", jsencrypt.encrypt(values.password as string) as string, { expires: 30 });
          Cookies.set('rememberMe', (values.rememberMe as boolean).toString(), { expires: 30 });
        } else {
          Cookies.remove("username");
          Cookies.remove("password");
          Cookies.remove('rememberMe');
        }
        // 获取当前用户信息并写入全局初始数据
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        // const { query } = history.location;
        // const { redirect } = query as { redirect: string };
        // history.push(redirect || '/');
        history.push('/');
      } catch (error) {
        // 如果失败去设置用户错误信息
        setUserLoginState({ msg: (error as Error).message, type: type });
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: '登录失败，请重试！',
        });
        message.error(defaultLoginFailureMessage);
        await getCaptchaImage();
      }
    } else if (type === 'mobile') {
      // 手机号登录
      message.info('目前不支持手机号登录，请选择账户密码登录。');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="数据管理平台"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          request={async () => {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get('rememberMe');
            return {
              username: username ? username : undefined,
              password: password ? jsencrypt.decrypt(password) : undefined,
              rememberMe: rememberMe ? Boolean(rememberMe).valueOf() : false,
            };
          }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
          //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
          //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values as RuoYiApi.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
          </Tabs>

          {(userLoginState.code !== 200) && (userLoginState.type === 'account') && (type === 'account') && (<LoginMessage content={userLoginState.msg as string} />)}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              {captchaImage.captchaEnabled && (
                <>
                  <Form.Item>
                    <Form.Item
                      name="code"
                      noStyle={true}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.login.captchaImageCode.required"
                              defaultMessage="验证码是必填项！"
                            />
                          ),
                        },
                      ]}>
                      <Input className={styles.loginCodeInput} size='large'
                             prefix={<SecurityScanOutlined className={styles.prefixIcon} />}
                             placeholder={intl.formatMessage({
                               id: 'pages.login.captchaImageCode.placeholder',
                               defaultMessage: '验证码',
                             })}
                      />
                    </Form.Item>
                    <div className={styles.loginCode}>
                      <Image className={styles.loginCodeImg} src={captchaImage.imgUrl} onClick={getCaptchaImage}
                             preview={false}
                             fallback="data:image/png;base64,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"
                      />
                    </div>
                  </Form.Item>
                </>
              )}
            </>
          )}

          {(userLoginState.code !== 200) && (userLoginState.type === 'mobile') && (type === 'mobile') && (<LoginMessage content={userLoginState.msg as string} />)}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                phoneName='mobile'
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (mobile) => {
                  message.info(`目前不支持手机号登录，请选择账户密码登录。[${mobile}]`);
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="rememberMe">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="记住密码" />
            </ProFormCheckbox>
            {/*<a*/}
            {/*  style={{*/}
            {/*    float: 'right',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />*/}
            {/*</a>*/}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
