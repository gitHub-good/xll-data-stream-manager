import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface DeptItem {
  deptId?: Key;
  parentId?: Key;
  deptName?: string;
  orderNum?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
}

export interface DeptList extends BaseRestResult {
  data: DeptItem[];
  total: number;
}

export interface TreeDeptItem {
  id: Key;
  label: string;
  children?: TreeDeptItem;
}
