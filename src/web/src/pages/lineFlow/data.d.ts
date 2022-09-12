import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface FlowItem {
  flowId?: Key;
  flowCode?: string;
  flowName?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
}

export interface FlowList extends BaseRestResult {
  rows: FlowItem[];
  total: number;
}
