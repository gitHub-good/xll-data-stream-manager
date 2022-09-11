// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { JobLogItem, JobLogList } from "./data";

/**
 * 查询调度日志列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listJobLog(params: JobLogItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: JobLogItem & {
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
  const result = await request<JobLogList>('/monitor/jobLog/list', {
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
 * 删除调度日志
 * @param jobLogIds
 */
export async function delJobLog(jobLogIds: Key[]) {
  return request<FrameApi.BaseRestResult>('/monitor/jobLog/' + jobLogIds, {
    method: 'DELETE',
  });
}

/**
 * 清空调度日志
 */
export async function cleanJobLog() {
  return request<FrameApi.BaseRestResult>('/monitor/jobLog/clean', {
    method: 'DELETE',
  });
}
