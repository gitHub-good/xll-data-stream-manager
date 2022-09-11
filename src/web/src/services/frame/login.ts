// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 登录方法
 * @param data
 */
export async function login(data: FrameApi.LoginParams) {
  return request<FrameApi.LoginResult>('/login', {
    method: 'POST',
    data,
  });
}

/**
 * 获取用户详细信息
 */
export async function getInfo() {
  return request<FrameApi.UserInfo>('/getInfo', {
    method: 'GET',
  });
}

/**
 * 退出登录接口
 */
export async function logout() {
  return request<FrameApi.BaseRestResult>('/logout', {
    method: 'POST',
  });
}

/**
 * 获取验证码
 */
export async function getCodeImg() {
  return request<FrameApi.CaptchaImage>('/captchaImage', {
    method: 'GET',
  });
}
