import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface PostItem {
  postId?: Key;
  postCode?: string;
  postName?: string;
  postSort?: number;
  status?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
}

export interface PostList extends BaseRestResult {
  rows: PostItem[];
  total: number;
}
