// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**
 * 登录方法
 * @param data
 */
export async function login(data: RuoYiApi.LoginParams) {
  return request<RuoYiApi.LoginResult>('/login', {
    method: 'POST',
    data,
  });
}

/**
 * 获取用户详细信息
 */
export async function getInfo() {
  return request<RuoYiApi.UserInfo>('/getInfo', {
    method: 'GET',
  });
}

/**
 * 退出登录接口
 */
export async function logout() {
  return request<RuoYiApi.BaseRestResult>('/logout', {
    method: 'POST',
  });
}

/**
 * 获取验证码
 */
export async function getCodeImg() {
  return request<RuoYiApi.CaptchaImage>('/captchaImage', {
    method: 'GET',
  });
}
