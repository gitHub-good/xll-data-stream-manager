// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { DeptItem, DeptList } from "./data";

/**
 * 查询部门列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listDept(params: DeptItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: DeptItem & {
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
  const result = await request<DeptList>('/system/dept/list', {
    method: 'GET',
    params: _params,
  });
  return {
    data: result.data,
    success: result.code === 200,
    total: result.total,
  };
}

/**
 * 查询部门列表（排除节点）
 * @param deptId
 */
export async function listDeptExcludeChild(deptId: Key) {
  return request<DeptList>('/system/dept/list/exclude/' + deptId, {
    method: 'GET',
  });
}

/**
 * 查询部门详细
 * @param deptId
 */
export async function getDept(deptId: Key) {
  const result = await request<{ data: DeptItem }>('/system/dept/' + deptId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 新增部门
 * @param data
 */
export async function addDept(data: DeptItem) {
  return request<RuoYiApi.BaseRestResult>('/system/dept', {
    method: 'POST',
    data: data
  });
}

/**
 * 修改部门
 * @param data
 */
export async function updateDept(data: DeptItem) {
  return request<RuoYiApi.BaseRestResult>('/system/dept', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除部门
 * @param deptId
 */
export async function delDept(deptId: Key) {
  return request<RuoYiApi.BaseRestResult>('/system/dept/' + deptId, {
    method: 'DELETE',
  });
}
