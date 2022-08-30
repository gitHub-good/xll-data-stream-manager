import type { ReactNode } from "react";
import type { DataNode } from "rc-tree/lib/interface";
import type { Key } from "rc-tree/lib/interface";
import type { DefaultOptionType } from "rc-tree-select/lib/TreeSelect";
import type { RawValueType } from "rc-tree-select/lib/TreeSelect";
import lodash from 'lodash';

// antd Tree树形数据字段名称转换
export function treeDataFormat(nodes: Record<string, any>[], titlePropName: string = 'label', keyPorpName: string = 'id', childrenPropName: string = 'children'): DataNode[] {
  const cloneDeepNodes = lodash.cloneDeep(nodes);
  const _nodes: DataNode[] = [];
  for (const node of cloneDeepNodes) {
    const _node: DataNode = {
      ...node,
      title: node[titlePropName],
      key: node[keyPorpName]
    };
    if (titlePropName !== 'title') {
      delete _node[titlePropName];
    }
    if (keyPorpName !== 'key') {
      delete _node[keyPorpName];
    }
    if (node[childrenPropName] && node[childrenPropName].length) {
      _node.children = treeDataFormat(node[childrenPropName], titlePropName, keyPorpName, childrenPropName);
      if (childrenPropName !== 'children') {
        delete _node[childrenPropName];
      }
    }
    _nodes.push(_node)
  }
  return _nodes;
}

// 树形结构数据转列表
export function treeToList(treeData: DataNode[], dataList: DataNode[] = []) {
  const cloneDeepTreeData = lodash.cloneDeep(treeData);
  for (const node of cloneDeepTreeData) {
    dataList.push(node);
    if (node.children) {
      treeToList(node.children, dataList);
      delete node.children;
    }
  }
  return dataList;
}

// 获取树形结构数据中指定节点key的父节点key
export function getParentKey(key: Key, tree: DataNode[]): string | number | undefined {
  let parentKey;
  for (const node of tree) {
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
}

// antd TreeSelect树形下拉选择数据字段名称转换
export function treeSelectDataFormat(nodes: Record<string, any>[], titlePropName: string = 'label', valuePorpName: string = 'id', childrenPropName: string = 'children'): DefaultOptionType[] {
  const cloneDeepNodes = lodash.cloneDeep(nodes);
  const _nodes: DefaultOptionType[] = [];
  for (const node of cloneDeepNodes) {
    const _node: DefaultOptionType = {
      ...node,
      title: node[titlePropName],
      value: node[valuePorpName]
    };
    if (titlePropName !== 'title') {
      delete _node[titlePropName];
    }
    if (valuePorpName !== 'value') {
      delete _node[valuePorpName];
    }
    if (node[childrenPropName] && node[childrenPropName].length) {
      _node.children = treeSelectDataFormat(node[childrenPropName], titlePropName, valuePorpName, childrenPropName);
      if (childrenPropName !== 'children') {
        delete _node[childrenPropName];
      }
    }
    _nodes.push(_node)
  }
  return _nodes;
}

// antd Select、Radio数据字段名称转换 { label, value }[]
export function optionsDataFormat(nodes: Record<string, any>[], labelPropName: string, valuePorpName: string,): { value: RawValueType; label: ReactNode; }[] {
  const cloneDeepNodes = lodash.cloneDeep(nodes);
  const _nodes: { value: RawValueType; label: ReactNode; }[] = [];
  for (const node of cloneDeepNodes) {
    const _node = {
      label: node[labelPropName],
      value: node[valuePorpName]
    };
    _nodes.push(_node);
  }
  return _nodes;
}

/**
 * 构造树型结构数据，列表转树形结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function listToTree(data: Record<string, any>[], id: string = 'id', parentId: string = 'parentId', children: string = 'children') {
  const config: { id: string, parentId: string, childrenList: string } = {
    id,
    parentId,
    childrenList: children,
  };

  const childrenListMap = {};
  const nodeIds = {};
  const tree = [];

  for (const d of data) {
    const _parentId = d[config.parentId];
    if (!childrenListMap[_parentId]) {
      childrenListMap[_parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[_parentId].push(d);
  }

  for (const d of data) {
    const _parentId = d[config.parentId];
    if (!nodeIds[_parentId]) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: Record<string, any>) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  return tree;
}
