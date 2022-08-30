// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { OperLogItem, OperLogList } from "./data";

/**
 * 查询操作日志列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listOperlog(params: OperLogItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: OperLogItem & {
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
  const result = await request<OperLogList>('/monitor/operlog/list', {
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
 * 删除操作日志
 * @param operIds
 */
export async function delOperlog(operIds: Key[]) {
  return request<RuoYiApi.BaseRestResult>('/monitor/operlog/' + operIds, {
    method: 'DELETE',
  });
}

/**
 * 清空操作日志
 */
export async function cleanOperlog() {
  return request<RuoYiApi.BaseRestResult>('/monitor/operlog/clean', {
    method: 'DELETE',
  });
}
