// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { OnlineItem, OnlineList } from "./data";

/**
 * 查询在线用户列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listOnline(params: OnlineItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  delete params.current;
  delete params.pageSize;
  const result = await request<OnlineList>('/monitor/online/list', {
    method: 'GET',
    params: params,
  });
  return {
    data: result.rows,
    success: result.code === 200,
    total: result.total,
  };
}

/**
 * 强退用户
 * @param tokenId
 */
export async function forceLogout(tokenId: Key) {
  return request<FrameApi.BaseRestResult>('/monitor/online/' + tokenId, {
    method: 'DELETE',
  });
}
