import BaseRestResult = RuoYiApi.BaseRestResult;
import type { Key } from "react";

export interface OperLogItem {
  operId?: Key;
  title?: string;
  businessType?: string;
  method?: string;
  requestMethod?: string;
  operatorType?: number;
  operName?: string;
  deptName?: string;
  operUrl?: string;
  operIp?: string;
  operLocation?: string;
  operParam?: string;
  jsonResult?: string;
  status?: string;
  errorMsg?: string;
  operTime?: string;
}

export interface OperLogList extends BaseRestResult {
  rows: OperLogItem[];
  total: number;
}
