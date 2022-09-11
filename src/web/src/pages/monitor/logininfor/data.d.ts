import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface LoginInfoItem {
  infoId?: Key;
  userName?: string;
  ipaddr?: string;
  loginLocation?: string;
  browser?: string;
  os?: string;
  status?: string;
  msg?: string;
  loginTime?: string;
}

export interface LoginInfoList extends BaseRestResult {
  rows: LoginInfoItem[];
  total: number;
}
