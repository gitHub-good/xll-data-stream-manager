// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { MenuEditorInfo, MenuItem, MenuList, TreeMenuItem } from "./data";

/**
 * 查询菜单列表
 * @param params params中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
 * @param sort
 * @param filter
 */
export async function listMenu(params: MenuItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: MenuItem & {
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
  const result = await request<MenuList>('/system/menu/list', {
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
 * 查询菜单详细
 * @param menuId
 */
export async function getMenu(menuId: Key) {
  const result = await request<MenuEditorInfo>('/system/menu/' + menuId, {
    method: 'GET'
  });
  return result.data;
}

/**
 * 查询菜单下拉树结构
 */
export async function treeselect() {
  return request<{ data: TreeMenuItem[]; }>('/system/menu/treeselect', {
    method: 'GET'
  });
}

/**
 * 根据角色ID查询菜单下拉树结构
 * @param roleId
 */
export async function roleMenuTreeselect(roleId: Key) {
  return request<{
    checkedKeys: Key[];
    halfCheckedKeys: Key[];
    menus: TreeMenuItem[];
  }>('/system/menu/roleMenuTreeselect/' + roleId, {
    method: 'GET'
  });
}

/**
 * 新增菜单
 * @param data
 */
export async function addMenu(data: MenuItem) {
  return request<FrameApi.BaseRestResult>('/system/menu', {
    method: 'POST',
    data: data
  });
}

/**
 * 修改菜单
 * @param data
 */
export async function updateMenu(data: MenuItem) {
  return request<FrameApi.BaseRestResult>('/system/menu', {
    method: 'PUT',
    data: data
  });
}

/**
 * 删除菜单
 * @param menuId
 */
export async function delMenu(menuId: Key) {
  return request<FrameApi.BaseRestResult>('/system/menu/' + menuId, {
    method: 'DELETE'
  });
}
