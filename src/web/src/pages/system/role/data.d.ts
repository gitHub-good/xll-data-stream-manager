import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface RoleList extends BaseRestResult {
  rows: RoleItem[];
  total: number;
}

export interface RoleItem {
  roleId?: Key;
  roleName?: string;
  roleKey?: string;
  roleSort?: number;
  dataScope?: string;
  menuCheckStrictly?: boolean;
  deptCheckStrictly?: boolean;
  status?: string;
  flag?: boolean;
  menuIds?: Key[];
  menuHalfCheckedIds?: Key[];
  deptIds?: Key[];
  deptHalfCheckedIds?: Key[];
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
  admin?: boolean;
}
