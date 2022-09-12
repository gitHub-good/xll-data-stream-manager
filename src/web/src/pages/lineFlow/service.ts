// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { FlowItem, FlowList } from "./data";

/**
 * 查询列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listFlow(params: FlowItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: FlowItem & {
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
  const result = await request<FlowList>('/lineFlow/list', {
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
 * 查询
 * @param flowId
 */
export async function getFlow(flowId: Key) {
  const result = await request<{ data: FlowItem }>('/lineFlow/' + flowId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 新增
 * @param data
 */
export async function addFlow(data: FlowItem) {
  return request<FrameApi.BaseRestResult>('/lineFlow/', {
    method: 'POST',
    data: data,
  });
}

/**
 * 修改
 * @param data
 */
export async function updateFlow(data: FlowItem) {
  return request<FrameApi.BaseRestResult>('/lineFlow/', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除
 * @param noticeIds
 */
export async function delFlow(noticeIds: Key[]) {
  return request<FrameApi.BaseRestResult>('/lineFlow/' + noticeIds, {
    method: 'DELETE',
  });
}
