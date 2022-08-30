// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { RedisCache, RedisCommandStatsItem, ReidsCacheItem, ReidsCacheKeyList, ReidsCacheList } from "./data";

/**
 * 查询缓存详细
 */
export async function getCache() {
  const result = await request<{ data: RedisCache }>('/monitor/cache', {
    method: 'GET',
  });
  for (const item of result?.data?.commandStats ?? []) {
    item.value = Number(item.value);
  }
  result.data.commandStats = result?.data?.commandStats?.sort((a: RedisCommandStatsItem, b: RedisCommandStatsItem) => {
    return (b.value as number) - (a.value as number);
  });
  return result.data;
}

/**
 * 查询缓存名称列表
 */
export async function listCacheName() {
  const result = await request<ReidsCacheList>('/monitor/cache/getNames', {
    method: 'GET',
  });
  return {
    data: result.data,
    success: result.code === 200,
    total: result.data.length,
  };
}

/**
 * 查询缓存键名列表
 * @param cacheName
 */
export async function listCacheKey(cacheName: string) {
  const result = await request<ReidsCacheKeyList>('/monitor/cache/getKeys/' + cacheName, {
    method: 'GET',
  });
  const _data = [];
  for (const cacheKey of result.data) {
    _data.push({ cacheName, cacheKey });
  }
  return {
    data: _data,
    success: result.code === 200,
    total: result.data.length,
  };
}

/**
 * 查询缓存内容
 * @param cacheName
 * @param cacheKey
 */
export async function getCacheValue(cacheName: string, cacheKey: string) {
  const result = await request<{ data: ReidsCacheItem }>('/monitor/cache/getValue/' + cacheName + '/' + cacheKey, {
    method: 'GET',
  });
  return result.data;
}

/**
 * 清理指定名称缓存
 * @param cacheName
 */
export async function clearCacheName(cacheName: string) {
  return request<RuoYiApi.BaseRestResult>('/monitor/cache/clearCacheName/' + cacheName, {
    method: 'DELETE',
  });
}

/**
 * 清理指定键名缓存
 * @param cacheKey
 */
export async function clearCacheKey(cacheKey: string) {
  return request<RuoYiApi.BaseRestResult>('/monitor/cache/clearCacheKey/' + cacheKey, {
    method: 'DELETE',
  });
}

/**
 * 清理全部缓存
 */
export async function clearCacheAll() {
  return request<RuoYiApi.BaseRestResult>('/monitor/cache/clearCacheAll', {
    method: 'DELETE',
  });
}
