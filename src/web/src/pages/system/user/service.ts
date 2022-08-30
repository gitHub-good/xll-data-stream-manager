// @ts-ignore
/* eslint-disable */
import React, { Key } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { UserEditorInfo, UserList, UserItem, UserRoleInfo, UserProfile } from "./data";
import { TreeDeptItem } from "../dept/data";

/**
 * 查询用户列表
 * @param params params中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
 * @param sort
 * @param filter
 */
export async function listUser(params: UserItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>,) {
  const _params: UserItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
    pageNum?: number;
    orderByColumn?: string;
    isAsc?: string;
  } = {
    ...params,
    pageNum: params.current,
    pageSize: params.pageSize,
  }
  const sortColumnNames = Object.keys(sort);
  if (sortColumnNames.length > 0) {
    _params.orderByColumn = sortColumnNames[0].replace('dept,', 'd.');
    _params.isAsc = sort[sortColumnNames[0]] === 'ascend' ? 'asc' : 'desc';
  }
  delete _params.current;
  const msg = await request<UserList>('/system/user/list', {
    method: 'GET',
    params: _params,
  });
  return {
    data: msg.rows,
    success: msg.code === 200,
    total: msg.total,
  };
}

/**
 * 查询用户详细
 * @param userId
 */
export async function getUser(userId: Key) {
  return request<UserEditorInfo>('/system/user/' + userId, {
    method: 'GET'
  })
}

/**
 * 新增用户
 * @param data
 */
export async function addUser(data: UserItem) {
  return request<RuoYiApi.BaseRestResult>('/system/user', {
    method: 'POST',
    data: data
  })
}

/**
 * 修改用户
 * @param data
 */
export async function updateUser(data: UserItem) {
  return request<RuoYiApi.BaseRestResult>('/system/user', {
    method: 'PUT',
    data: data
  })
}

/**
 * 删除用户
 * @param userIds
 */
export async function delUser(userIds: Key[]) {
  return request<RuoYiApi.BaseRestResult>('/system/user/' + userIds, {
    method: 'DELETE',
  });
}

/**
 * 用户密码重置
 * @param userId
 * @param password
 */
export async function resetUserPwd(userId: Key, password: string) {
  const data = {
    userId,
    password,
  };
  return request<RuoYiApi.BaseRestResult>('/system/user/resetPwd', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 用户状态修改
 * @param userId
 * @param status
 */
export async function changeUserStatus(userId: Key, status: string) {
  const data = {
    userId,
    status
  };
  return request<RuoYiApi.BaseRestResult>('/system/user/changeStatus', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 查询用户个人信息
 */
export async function getUserProfile() {
  const result = await request<UserProfile>('/system/user/profile', {
    method: 'GET',
  });
  return { data: result };
}

/**
 * 修改用户个人信息
 * @param data
 */
export async function updateUserProfile(data: UserItem) {
  return request<RuoYiApi.BaseRestResult>('/system/user/profile', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 用户密码重置
 * @param oldPassword
 * @param newPassword
 */
export async function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword
  };
  return request<RuoYiApi.BaseRestResult>('/system/user/profile/updatePwd', {
    method: 'PUT',
    params: data,
  });
}

/**
 * 用户头像上传
 * @param file
 */
export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatarfile', file);
  const result = await request<{ imgUrl: string }>('/system/user/profile/avatar', {
    method: 'POST',
    requestType: 'form',
    data: formData,
  });
  return result.imgUrl;
}

/**
 * 查询授权角色
 * @param userId
 */
export async function getAuthRole(userId: Key) {
  return request<UserRoleInfo>('/system/user/authRole/' + userId, {
    method: 'GET'
  })
}

/**
 * 保存授权角色
 * @param data
 */
export async function updateAuthRole(data: { userId: Key, roleIds: Key[] }) {
  return request<RuoYiApi.BaseRestResult>('/system/user/authRole', {
    method: 'PUT',
    params: data
  })
}

/**
 * 导入用户
 * @param file
 * @param updateSupport
 */
export async function importUserFile(file: File, updateSupport: boolean) {
  const formData = new FormData();
  formData.append('file', file);
  return request<RuoYiApi.BaseRestResult>('/system/user/importData', {
    method: 'POST',
    requestType: 'form',
    params: { updateSupport },
    data: formData,
  });
}

/**
 * 查询部门下拉树结构
 */
export async function deptTreeSelect() {
  return request<{ data: TreeDeptItem[] }>('/system/user/deptTree', {
    method: 'GET',
  });
}
