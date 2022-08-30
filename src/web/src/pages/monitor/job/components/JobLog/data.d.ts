import BaseRestResult = RuoYiApi.BaseRestResult;
import type { Key } from "react";

export interface JobLogItem {
  jobLogId?: Key;
  jobName?: string;
  jobGroup?: string;
  invokeTarget?: string;
  jobMessage?: string;
  exceptionInfo?: string;
  startTime?: string;
  stopTime?: string;
  status?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface JobLogList extends BaseRestResult {
  rows: JobLogItem[];
  total: number;
}
