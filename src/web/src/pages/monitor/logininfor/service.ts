// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { LoginInfoItem, LoginInfoList } from "./data";

/**
 * 查询登录日志列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listLoginInfo(params: LoginInfoItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: LoginInfoItem & {
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
  const result = await request<LoginInfoList>('/monitor/logininfor/list', {
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
 * 删除登录日志
 * @param infoIds
 */
export async function delLoginInfo(infoIds: Key[]) {
  return request<RuoYiApi.BaseRestResult>('/monitor/logininfor/' + infoIds, {
    method: 'DELETE',
  });
}

/**
 * 解锁用户登录状态
 * @param userName
 */
export async function unlockLogininfor(userName: string) {
  return request<RuoYiApi.BaseRestResult>('/monitor/logininfor/unlock/' + userName, {
    method: 'GET',
  });
}

/**
 * 清空登录日志
 */
export async function cleanLoginInfo() {
  return request<RuoYiApi.BaseRestResult>('/monitor/logininfor/clean', {
    method: 'DELETE',
  });
}
