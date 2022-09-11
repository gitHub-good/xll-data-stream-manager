import BaseRestResult = FrameApi.BaseRestResult;

export interface RedisCache {
  commandStats?: RedisCommandStatsItem[];
  info?: RedisServerInfo;
  dbSize?: number;
}

export interface RedisCommandStatsItem {
  name?: string;
  value?: number;
}

export interface RedisServerInfo {
  redis_version?: string;
  redis_mode?: string;
  tcp_port?: string;
  connected_clients?: string;
  uptime_in_days?: string;
  used_memory_human?: string;
  used_cpu_user_children?: string;
  maxmemory_human?: string;
  aof_enabled?: string;
  rdb_last_bgsave_status?: string;
  instantaneous_input_kbps?: string;
  instantaneous_output_kbps?: string;
}

export interface ReidsCacheItem {
  cacheName?: string;
  cacheKey?: string;
  cacheValue?: string;
  remark?: string;
}

export interface ReidsCacheList extends BaseRestResult{
  data: ReidsCacheItem[];
}

export interface ReidsCacheKeyList extends BaseRestResult{
  data: string[];
}
