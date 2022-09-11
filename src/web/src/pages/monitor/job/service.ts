// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { JobItem, JobList } from "./data";

/**
 * 查询定时任务调度列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listJob(params: JobItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: JobItem & {
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
  const result = await request<JobList>('/monitor/job/list', {
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
 * 查询定时任务调度详细
 * @param jobId
 */
export async function getJob(jobId: Key) {
  const result = await request<{ data: JobItem; }>('/monitor/job/' + jobId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 新增定时任务调度
 * @param data
 */
export async function addJob(data: JobItem) {
  return request<FrameApi.BaseRestResult>('/monitor/job', {
    method: 'POST',
    data: data,
  });
}

/**
 * 修改定时任务调度
 * @param data
 */
export async function updateJob(data: JobItem) {
  return request<FrameApi.BaseRestResult>('/monitor/job', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除定时任务调度
 * @param jobIds
 */
export async function delJob(jobIds: Key[]) {
  return request<FrameApi.BaseRestResult>('/monitor/job/' + jobIds, {
    method: 'DELETE',
  });
}

/**
 * 任务状态修改
 * @param jobId
 * @param status
 */
export async function changeJobStatus(jobId: Key, status: string) {
  const data = {
    jobId,
    status
  };
  return request<FrameApi.BaseRestResult>('/monitor/job/changeStatus', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 定时任务立即执行一次
 * @param jobId
 * @param jobGroup
 */
export async function runJob(jobId: Key, jobGroup: string) {
  const data = {
    jobId,
    jobGroup
  };
  return request<FrameApi.BaseRestResult>('/monitor/job/run', {
    method: 'PUT',
    data: data,
  });
}
