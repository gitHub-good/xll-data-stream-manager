// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { ConfigItem, ConfigList } from "./data";

/**
 * 查询参数列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listConfig(params: ConfigItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: ConfigItem & {
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
  const result = await request<ConfigList>('/system/config/list', {
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
 * 查询参数详细
 * @param configId
 */
export async function getConfig(configId: Key) {
  const result = await request<{ data: ConfigItem; }>('/system/config/' + configId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 根据参数键名查询参数值
 * @param configKey
 */
export async function getConfigKey(configKey: string) {
  const result = await request<FrameApi.BaseRestResult>('/system/config/configKey/' + configKey, {
    method: 'GET',
  });
  return result.msg;
}

/**
 * 新增参数配置
 * @param data
 */
export async function addConfig(data: ConfigItem) {
  return request<FrameApi.BaseRestResult>('/system/config', {
    method: 'POST',
    data: data,
  });
}

/**
 * 修改参数配置
 * @param data
 */
export async function updateConfig(data: ConfigItem) {
  return request<FrameApi.BaseRestResult>('/system/config', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除参数配置
 * @param configIds
 */
export async function delConfig(configIds: Key[]) {
  return request<FrameApi.BaseRestResult>('/system/config/' + configIds, {
    method: 'DELETE',
  });
}

/**
 * 刷新参数缓存
 */
export async function refreshCache() {
  return request<FrameApi.BaseRestResult>('/system/config/refreshCache', {
    method: 'DELETE',
  });
}
