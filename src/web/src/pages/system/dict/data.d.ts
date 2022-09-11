import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface DictTypeItem {
  dictId?: Key;
  dictName?: string;
  dictType?: string;
  status?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

export interface DictTypeList extends BaseRestResult {
  rows: DictTypeItem[];
  total: number;
}
