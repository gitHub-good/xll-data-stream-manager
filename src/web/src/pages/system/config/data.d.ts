import BaseRestResult = RuoYiApi.BaseRestResult;
import type { Key } from "react";

export interface ConfigItem {
  configId?: Key;
  configName?: string;
  configKey?: string;
  configValue?: string;
  configType?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
}

export interface ConfigList extends BaseRestResult {
  rows: ConfigItem[];
  total: number;
}
