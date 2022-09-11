// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { DictDataItem, DictDataList } from "./data";

/**
 * 查询字典数据列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listData(params: DictDataItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: DictDataItem & {
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
  const result = await request<DictDataList>('/system/dict/data/list', {
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
 * 查询字典数据详细
 * @param dictCode
 */
export async function getData(dictCode: Key) {
  const result = await request<{ data: DictDataItem }>('/system/dict/data/' + dictCode, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 根据字典类型查询字典数据信息
 * @param dictType
 */
export async function getDicts(dictType: string) {
  return request<{ data: DictDataItem[] }>('/system/dict/data/type/' + dictType, {
    method: 'GET',
  });
}

/**
 * 新增字典数据
 * @param data
 */
export async function addData(data: DictDataItem) {
  return request<FrameApi.BaseRestResult>('/system/dict/data', {
    method: 'POST',
    data: data,
  });
}

/**
 * 修改字典数据
 * @param data
 */
export async function updateData(data: DictDataItem) {
  return request<FrameApi.BaseRestResult>('/system/dict/data', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除字典数据
 * @param dictCodes
 */
export async function delData(dictCodes: Key[]) {
  return request<FrameApi.BaseRestResult>('/system/dict/data/' + dictCodes, {
    method: 'DELETE',
  });
}
