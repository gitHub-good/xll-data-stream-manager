// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { DictTypeItem, DictTypeList } from "./data";

/**
 * 查询字典类型列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listType(params: DictTypeItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: DictTypeItem & {
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
  const result = await request<DictTypeList>('/system/dict/type/list', {
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
 * 查询字典类型详细
 * @param dictId
 */
export async function getType(dictId: Key) {
  const result = await request<{ data: DictTypeItem }>('/system/dict/type/' + dictId, {
    method: 'GET'
  });
  return result.data;
}

/**
 * 新增字典类型
 * @param data
 */
export async function addType(data: DictTypeItem) {
  return request<RuoYiApi.BaseRestResult>('/system/dict/type', {
    method: 'POST',
    data: data
  });
}

/**
 * 修改字典类型
 * @param data
 */
export async function updateType(data: DictTypeItem) {
  return request<RuoYiApi.BaseRestResult>('/system/dict/type', {
    method: 'PUT',
    data: data
  });
}

/**
 * 删除字典类型
 * @param dictIds
 */
export async function delType(dictIds: Key[]) {
  return request<RuoYiApi.BaseRestResult>('/system/dict/type/' + dictIds, {
    method: 'DELETE'
  });
}

/**
 * 刷新字典缓存
 */
export async function refreshCache() {
  return request<RuoYiApi.BaseRestResult>('/system/dict/type/refreshCache', {
    method: 'DELETE'
  });
}

/**
 * 获取字典选择框列表
 */
export async function optionselect() {
  return request<DictTypeList>('/system/dict/type/optionselect', {
    method: 'GET'
  });
}
