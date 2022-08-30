import BaseRestResult = RuoYiApi.BaseRestResult;
import type { Key } from "react";

export interface OnlineItem {
  tokenId?: Key;
  userName?: string;
  deptName?: string;
  ipaddr?: string;
  loginLocation?: string;
  browser?: number;
  os?: string;
  loginTime?: number;
}

export interface OnlineList extends BaseRestResult {
  rows: OnlineItem[];
  total: number;
}
