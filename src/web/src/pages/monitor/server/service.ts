// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { ServerInfo } from "./data";

/**
 * 获取服务信息
 */
export async function getServer() {
  const result = await request<{ data: ServerInfo }>('/monitor/server', {
    method: 'GET',
  });
  return result.data;
}
