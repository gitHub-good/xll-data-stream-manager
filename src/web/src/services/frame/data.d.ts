// @ts-ignore
/* eslint-disable */

declare namespace FrameApi {
  /**后端基本接口 */
  interface BaseRestResult {
    code?: number;
    msg?: string;
  }

  /** 图片验证码接口规范 */
  interface CaptchaImage extends BaseRestResult {
    img?: string;
    uuid?: string;
    captchaEnabled?: boolean;
    imgUrl?: string;
  }

  interface LoginParams {
    username?: string;
    password?: string;
    rememberMe?: boolean;
    code?: string;
    uuid?: string;
    type?: string;
  }

  interface LoginResult extends BaseRestResult {
    token?: string;
    type?: string;
  }

  interface UserInfo extends BaseRestResult {
    user?: CurrentUser;
    roles?: Roles;
    permissions?: Permissions;
  }

  interface CurrentUser {
    admin?: boolean;
    userId?: string | number;
    userName?: string;
    nickName?: string;
    avatar?: string;
    sex?: string;
    email?: string;
    phonenumber?: string;
    deptId?: string | number;
    dept?: {
      deptId?: string | number;
      deptName?: string;
    };
    roles?: Array<{
      admin?: boolean;
      roleId?: string | number;
      roleKey?: string;
      roleName?: string;
    }>;
    loginDate?: string;
    loginIp?: string;
    remark?: string;
  }

  type Roles = Array<stirng>;

  type Permissions = Array<stirng>;
}
