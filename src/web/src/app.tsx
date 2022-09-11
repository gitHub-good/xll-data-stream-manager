import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history, Link } from 'umi';
import type { RequestOptionsInit } from 'umi-request';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getInfo } from './services/frame/login';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { message } from "antd";
import { auth, http, sysCode } from "@/utils";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: FrameApi.CurrentUser;
  loading?: boolean;
  roles?: FrameApi.Roles;
  permissions?: FrameApi.Permissions;
  fetchUserInfo?: () => Promise<FrameApi.UserInfo | undefined>;
}> {
  // 获取当前用户信息方法
  const fetchUserInfo = async () => {
    if (auth.getToken()) {
      // 存在token，获取当前用户信息
      try {
        // 成功获取当前用户信息
        return await getInfo();
      } catch (error) {
        // 获取当前用户信息异常，移除token，重定向到loginPath
        message.error({
          content: '获取用户信息失败，请重新登录。'
        });
        auth.removeToken();
        history.push(loginPath);
      }
      return undefined;
    } else {
      // 不存在token，重定向到loginPath
      message.info({
        content: '未登录，请先登录。'
      });
      auth.removeToken();
      history.push(loginPath);
      return undefined;
    }
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const userInfo = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser: userInfo?.user,
      roles: userInfo?.roles,
      permissions: userInfo?.permissions,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.nickName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!auth.getToken() && location.pathname !== loginPath) {
        // 不存在token && 访问路径不是loginPath，重定向到loginPath
        message.error({
          content: '未登录，请先登录。'
        });
        auth.removeToken();
        history.push(loginPath);
      } else if (auth.getToken() && location.pathname === loginPath) {
        // 存在token && 访问路径是登录页面，重定向到'/'
        history.push('/');
      }
    },
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
        <Link to="/~docs" key="docs">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// 每次请求携带token https://pro.ant.design/zh-CN/docs/request#%E8%AF%B7%E6%B1%82%E5%89%8D%E6%8B%A6%E6%88%AArequestinterceptors
const authHeaderRequestInterceptor = (url: string, options: RequestOptionsInit) => {
  const authHeader = auth.getToken() ? { Authorization: 'Bearer ' + auth.getToken() } : undefined;
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

// 请求URL参数params对象转换
const getParamsRequestInterceptor = (url: string, options: RequestOptionsInit) => {
  if (typeof (options.params) !== 'undefined' && Object.keys(options.params).length > 0) {
    return {
      url: `${url}`,
      options: { ...options, params: http.transformUrlParams(options.params) },
    };
  }
  return {
    url,
    options,
  };
};

// 响应后Http状态拦截
const httpStatusResponseInterceptor = async (response: Response, options: RequestOptionsInit) => {
  const _response = response.clone();
  if (_response.status !== 200) {
    const error = new Error('系统接口未知异常');
    if (_response.statusText.toLocaleLowerCase() === "network error") {
      error.message = '后端接口连接异常';
    } else if (_response.statusText.toLocaleLowerCase().includes("timeout")) {
      error.message = '系统接口请求超时';
    } else if (_response.statusText.toLocaleLowerCase().includes("request failed with status code")) {
      error.message = `系统接口[${_response.statusText.substring(_response.statusText.length - 3)}]异常`;
    } else {
      error.message = `系统接口method[${options.method}]prefix[${options.prefix}]url[${options.url}][${_response.status}][${_response.statusText}]异常`;
    }
    error.name = 'ResponseError';
    throw error;
  }
  return response;
}

// 响应后Body状态拦截
const bodyStatusResponseInterceptor = async (response: Response, options: RequestOptionsInit) => {
  const _response = response.clone();
  // responseType为json的处理
  if (options.responseType === 'json') {
    const responseBody = await _response.json();
    // 未设置状态码则默认成功状态
    const code = responseBody.code || 200;
    // 获取错误信息
    const msg = sysCode.errorCode[code] || responseBody.msg || sysCode.errorCode.default;
    if (code === 200) {
      return response;
    } else if (code === 401) {
      const error = new Error('无效的会话，或者会话已过期，请重新登录。');
      error.name = 'RestResultError';
      auth.removeToken();
      history.push(loginPath);
      throw error;
    } else {
      const error = new Error(msg);
      error.name = 'RestResultError';
      throw error;
    }
  }
  // responseType为blob、arrayBuffer的处理
  if (options.responseType === 'blob' || options.responseType === 'arrayBuffer') {
    return response;
  }
  return response;
};

// https://pro.ant.design/zh-CN/docs/upgrade-v5#%E8%AF%B7%E6%B1%82
export const request: RequestConfig = {
  timeout: 0,
  requestInterceptors: [authHeaderRequestInterceptor, getParamsRequestInterceptor],
  responseInterceptors: [httpStatusResponseInterceptor, bodyStatusResponseInterceptor],
  middlewares: [],
  prefix: REACT_APP_BASE_API,
  responseType: 'json',
  // errorConfig: {},
  // errorHandler: () => {
  // },
};
