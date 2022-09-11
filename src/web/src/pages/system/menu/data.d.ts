import BaseRestResult = FrameApi.BaseRestResult;
import type { Key } from "react";

export interface MenuItem {
  menuId?: Key;
  menuName?: string;
  parentId?: Key;
  orderNum?: number;
  menuType?: string;
  status?: string;
  perms?: string;
  createTime?: string;
  updateTime?: string;
}

export interface MenuList extends BaseRestResult {
  data: MenuItem[];
  total: number;
}

export interface TreeMenuItem {
  id: Key;
  label: string;
  children?: TreeMenuItem;
}

export interface MenuEditorInfo extends BaseRestResult {
  data: MenuItem;
}
