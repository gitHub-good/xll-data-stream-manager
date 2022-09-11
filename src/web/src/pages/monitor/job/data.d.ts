import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface JobItem {
  jobId?: Key;
  jobName?: string;
  jobGroup?: string;
  invokeTarget?: string;
  cronExpression?: string;
  misfirePolicy?: string;
  concurrent?: string;
  status?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
  nextValidTime?: string;
}

export interface JobList extends BaseRestResult {
  rows: JobItem[];
  total: number;
}
