// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { NoticeItem, NoticeList } from "./data";

/**
 * 查询公告列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listNotice(params: NoticeItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: NoticeItem & {
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
  const result = await request<NoticeList>('/system/notice/list', {
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
 * 查询公告详细
 * @param noticeId
 */
export async function getNotice(noticeId: Key) {
  const result = await request<{ data: NoticeItem; }>('/system/notice/' + noticeId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 新增公告
 * @param data
 */
export async function addNotice(data: NoticeItem) {
  return request<RuoYiApi.BaseRestResult>('/system/notice', {
    method: 'POST',
    data: data,
  });
}

/**
 * 修改公告
 * @param data
 */
export async function updateNotice(data: NoticeItem) {
  return request<RuoYiApi.BaseRestResult>('/system/notice', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除公告
 * @param noticeIds
 */
export async function delNotice(noticeIds: Key[]) {
  return request<RuoYiApi.BaseRestResult>('/system/notice/' + noticeIds, {
    method: 'DELETE',
  });
}
