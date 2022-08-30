import BaseRestResult = RuoYiApi.BaseRestResult;
import type { Key } from "react";

export interface DictDataItem {
  dictCode?: Key;
  dictSort?: number;
  dictLabel?: string;
  dictValue?: string;
  dictType?: string;
  cssClass?: string;
  listClass?: string;
  status?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}

export interface DictDataList extends BaseRestResult {
  rows: DictDataItem[];
  total: number;
}
