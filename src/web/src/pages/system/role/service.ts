// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { RoleList, RoleItem } from "./data";
import { UserList } from "../user/data";
import { TreeDeptItem } from "../dept/data";

/**
 * 查询角色列表
 * @param params params中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
 * @param sort
 * @param filter
 */
export async function listRole(params: RoleItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: RoleItem & {
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
  };
  const sortColumnNames = Object.keys(sort);
  if (sortColumnNames.length > 0) {
    _params.orderByColumn = sortColumnNames[0];
    _params.isAsc = sort[sortColumnNames[0]] === 'ascend' ? 'asc' : 'desc';
  }
  delete _params.current;
  const result = await request<RoleList>('/system/role/list', {
    method: 'GET',
    params: _params,
  });
  return {
    data: result.rows,
    success: result.code === 200,
    total: result.total,
  };
}

/**
 * 查询角色详细
 * @param roleId
 */
export async function getRole(roleId: Key) {
  const result = await request<{ data: RoleItem }>('/system/role/' + roleId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 新增角色
 * @param data
 */
export async function addRole(data: RoleItem) {
  return request<RuoYiApi.BaseRestResult>('/system/role', {
    method: 'POST',
    data: data
  })
}

/**
 * 修改角色
 * @param data
 */
export async function updateRole(data: RoleItem) {
  return request<RuoYiApi.BaseRestResult>('/system/role', {
    method: 'PUT',
    data: data
  })
}

/**
 * 角色数据权限
 * @param data
 */
export async function dataScope(data: RoleItem) {
  return request<RuoYiApi.BaseRestResult>('/system/role/dataScope', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 角色状态修改
 * @param roleId
 * @param status
 */
export async function changeRoleStatus(roleId: Key, status: string) {
  const data = {
    roleId,
    status
  };
  return request<RuoYiApi.BaseRestResult>('/system/role/changeStatus', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除角色
 * @param roleIds
 */
export async function delRole(roleIds: Key[]) {
  return request<RuoYiApi.BaseRestResult>('/system/role/' + roleIds, {
    method: 'DELETE',
  });
}

/**
 * 查询角色已授权用户列表
 * @param params
 * @param sort
 * @param filter
 */
export async function allocatedUserList(params: { roleId?: Key; userName?: string; phonenumber?: string; } & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: { roleId?: Key; userName?: string; phonenumber?: string; } & {
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
  };
  const sortColumnNames = Object.keys(sort);
  if (sortColumnNames.length > 0) {
    _params.orderByColumn = sortColumnNames[0];
    _params.isAsc = sort[sortColumnNames[0]] === 'ascend' ? 'asc' : 'desc';
  }
  delete _params.current;
  const result = await request<UserList>('/system/role/authUser/allocatedList', {
    method: 'GET',
    params: _params,
  });
  return {
    data: result.rows,
    success: result.code === 200,
    total: result.total,
  };
}

/**
 * 查询角色未授权用户列表
 * @param params
 * @param sort
 * @param filter
 */
export async function unallocatedUserList(params: { roleId?: Key; userName?: string; phonenumber?: string; } & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: { roleId?: Key; userName?: string; phonenumber?: string; } & {
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
  };
  const sortColumnNames = Object.keys(sort);
  if (sortColumnNames.length > 0) {
    _params.orderByColumn = sortColumnNames[0];
    _params.isAsc = sort[sortColumnNames[0]] === 'ascend' ? 'asc' : 'desc';
  }
  delete _params.current;
  const result = await request<UserList>('/system/role/authUser/unallocatedList', {
    method: 'GET',
    params: _params,
  });
  return {
    data: result.rows,
    success: result.code === 200,
    total: result.total,
  };
}

/**
 * 取消用户授权角色
 * @param data
 */
export async function authUserCancel(data: { userId: Key, roleId: Key }) {
  return request('/system/role/authUser/cancel', {
    method: 'PUT',
    data: data
  });
}

/**
 * 批量取消用户授权角色
 * @param data
 */
export async function authUserCancelAll(data: { roleId: Key, userIds: Key[] }) {
  return request('/system/role/authUser/cancelAll', {
    method: 'PUT',
    params: data
  });
}

/**
 * 授权用户选择
 * @param data
 */
export async function authUserSelectAll(data: { roleId: Key, userIds: Key[] }) {
  return request('/system/role/authUser/selectAll', {
    method: 'PUT',
    params: data
  });
}

/**
 * 根据角色ID查询部门树结构
 * @param roleId
 */
export async function deptTreeSelect(roleId: Key) {
  return request<{
    checkedKeys: Key[];
    halfCheckedKeys: Key[];
    depts: TreeDeptItem[];
  }>('/system/role/deptTree/' + roleId, {
    method: 'GET',
  });
}
