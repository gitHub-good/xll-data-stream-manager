// @ts-ignore
/* eslint-disable */
import { Key, ReactText } from "react";
import { request } from 'umi';
import { SortOrder } from "antd/lib/table/interface";
import { PostItem, PostList } from "./data";

/**
 * 查询岗位列表
 * @param params
 * @param sort
 * @param filter
 */
export async function listPost(params: PostItem & {
  pageSize?: number;
  current?: number;
  keyword?: string;
}, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) {
  const _params: PostItem & {
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
  const result = await request<PostList>('/system/post/list', {
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
 * 查询岗位详细
 * @param postId
 */
export async function getPost(postId: Key) {
  const result = await request<{ data: PostItem }>('/system/post/' + postId, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 新增岗位
 * @param data
 */
export async function addPost(data: PostItem) {
  return request<FrameApi.BaseRestResult>('/system/post', {
    method: 'POST',
    data: data
  });
}

/**
 * 修改岗位
 * @param data
 */
export async function updatePost(data: PostItem) {
  return request<FrameApi.BaseRestResult>('/system/post', {
    method: 'PUT',
    data: data,
  });
}

/**
 * 删除岗位
 * @param postIds
 */
export async function delPost(postIds: Key[]) {
  return request<FrameApi.BaseRestResult>('/system/post/' + postIds, {
    method: 'DELETE',
  });
}
