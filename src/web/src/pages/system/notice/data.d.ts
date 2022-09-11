import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface NoticeItem {
  noticeId?: Key;
  noticeTitle?: string;
  noticeType?: string;
  noticeContent?: string;
  status?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
}

export interface NoticeList extends BaseRestResult {
  rows: NoticeItem[];
  total: number;
}
