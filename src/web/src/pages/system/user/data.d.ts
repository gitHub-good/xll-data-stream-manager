import type { Key } from "react";
import BaseRestResult = FrameApi.BaseRestResult;
import type { RoleItem } from "../role/data";
import type { PostItem } from "../post/data";
import type { DeptItem } from "../dept/data";

export interface UserList extends BaseRestResult {
  rows: UserItem[];
  total: number;
}

export interface UserItem {
  userId?: Key;
  userName?: string;
  nickName?: string;
  deptName?: string;
  phonenumber?: string;
  status?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  roles?: RoleItem[];
  deptId?: Key;
  dept?: DeptItem;
  password?: string;
  email?: string;
  sex?: string;
  avatar?: string;
  remark?: string;
  postIds?: Key[];
  roleIds?: Key[];
}

export interface UserRoleInfo extends BaseRestResult {
  roles: RoleItem[];
  user: UserItem;
}

export interface UserEditorInfo extends BaseRestResult {
  data: UserItem;
  postIds: Key[];
  roleIds: Key[];
  posts: PostItem[];
  roles: RoleItem[];
}

export interface UserProfile extends BaseRestResult {
  data: UserItem;
  postGroup: string;
  roleGroup: string;
}
