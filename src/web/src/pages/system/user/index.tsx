import type { FC, Key, MutableRefObject, ReactText } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Access, useAccess } from "umi";
import { Button, Col, Input, message, Popconfirm, Row, Switch, Table, Tooltip, Tree } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import type { DataNode } from "rc-tree/lib/interface";
import type { DefaultOptionType } from "rc-tree-select/lib/TreeSelect";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable, { TableDropdown } from "@ant-design/pro-table";
import type { ProFormInstance } from '@ant-design/pro-form';
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import styles from './index.less'
import { changeUserStatus, delUser, deptTreeSelect, listUser } from "./service";
import type { UserItem } from "./data";
import { RestPassword, ImportUser, AssignRole, UserEditor } from "./components";
import { dict, download, modal, dataFormat } from '@/utils';

/** 删除 */
const handleDelete = (userIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除用户编号为"' + userIds + '"的数据项？'
    , async () => {
      try {
        await delUser(userIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  )
}

/** 导出 */
const handleExport = async (tableFormRef: MutableRefObject<ProFormInstance | undefined>) => {
  await download.commonDownload(
    '/system/user/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `user_${new Date().getTime()}.xlsx`
  );
}

/** 修改用户状态 */
const handleStatusChange = (checked: boolean, entity: UserItem, tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const text = entity.status === "0" ? "停用" : "启用";
  const _status = entity.status === "0" ? "1" : "0";
  const _modal = modal.confirm(
    '确认要"' + text + '""' + entity.userName + '"用户吗？',
    async () => {
      try {
        await changeUserStatus(entity.userId as Key, _status);
        message.success(text + '成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    },
  );
}

const User: FC = () => {
  // 字典State
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
  // 表格多选框State
  const [ids, setIds] = useState<Key[]>([]);
  // 部门TreeSelect数据
  const [deptTreeSelectData, setDeptTreeSelectData] = useState<DefaultOptionType[]>([]);
  // 部门Tree数据
  const [deptTreeData, setDeptTreeData] = useState<DataNode[]>([]);
  // 部门Tree当前选中节点id
  const [deptTreeSelectedId, setDeptTreeSelectedId] = useState<Key>();
  // （受控）展开指定的树节点
  const [deptTreeExpandedKeys, setDeptTreeExpandedKeys] = useState<Key[]>([]);
  // 是否自动展开父节点
  const [deptTreeAutoExpandParent, setDeptTreeAutoExpandParent] = useState<boolean>(true);
  // 部门树搜索值
  const [deptTreeSearchValue, setDeptTreeSearchValue] = useState<string>('');

  // Table action 的引用，便于自定义触发
  const tableActionRef = useRef<ActionType>();
  // Table Form 的引用，便于自定义触发
  const tableFormRef = useRef<ProFormInstance>();

  // 初始化字典数据、部门树数据、部门树展开节点
  useEffect(() => {
    (async () => {
      const _dicts = await dict.getDicts(['sys_normal_disable', 'sys_user_sex']);
      const _deptTreeData = await deptTreeSelect();
      const __deptTreeData = dataFormat.treeDataFormat(_deptTreeData.data);
      const __deptTreeSelectData = dataFormat.treeSelectDataFormat(_deptTreeData.data);
      const _deptTreeExpandedKeys = dataFormat.treeToList(__deptTreeData)
        // 获取所有key
        .map(values => values.key)
        // 获取key的父节点key
        .map((value) => {
          return dataFormat.getParentKey(value, __deptTreeData) as Key
        })
        // 过滤掉undefined、null值，并去重
        .filter((item, i, self) => item !== null && typeof item !== 'undefined' && self.indexOf(item) === i);
      setDicts(_dicts);
      setDeptTreeData(__deptTreeData);
      setDeptTreeSelectData(__deptTreeSelectData);
      setDeptTreeExpandedKeys(_deptTreeExpandedKeys);
    })();
  }, []);

  const access = useAccess();

  // 展开/收起节点时触发
  const onExpandDeptTree = (expandedKeys: Key[]) => {
    setDeptTreeExpandedKeys(expandedKeys);
    setDeptTreeAutoExpandParent(false);
  }

  // 部门Tree搜索方法
  const onSearchDeptTree = (value: string) => {
    const _expandedParentKeys = dataFormat.treeToList(deptTreeData)
      // 获取匹配项的父节点key数组
      .map(item => {
        if ((item?.title as string)?.indexOf(value) > -1) {
          return dataFormat.getParentKey(item.key, deptTreeData as DataNode[]);
        }
        return null;
      })
      // 过滤掉undefined、null值，并去重
      .filter((item, i, self) => item !== null && typeof item !== 'undefined' && self.indexOf(item) === i);
    setDeptTreeExpandedKeys(_expandedParentKeys as Key[]);
    setDeptTreeAutoExpandParent(true);
    setDeptTreeSearchValue(value);
  };

  // 部门树数据循环渲染
  const deptTreeDataLoop = (data: DataNode[]): DataNode[] => {
    return data.map(item => {
      const index = (item?.title as string)?.indexOf(deptTreeSearchValue);
      const beforeStr = (item?.title as string)?.substring(0, index - 1);
      const afterStr = (item?.title as string)?.substring(index + deptTreeSearchValue.length);
      const title =
        index > -1 ? (
          <Tooltip placement="bottomLeft" mouseEnterDelay={0} mouseLeaveDelay={0} title={item.title}>
            <span>
            {beforeStr}
              <span className={styles.siteTreeSearchValue}>{deptTreeSearchValue}</span>
              {afterStr}
          </span>
          </Tooltip>
        ) : (
          <Tooltip placement="bottomLeft" mouseEnterDelay={0} mouseLeaveDelay={0} title={item.title}>
            <span>{item.title}</span>
          </Tooltip>
        );
      if (item.children) {
        return { title, key: item.key, children: deptTreeDataLoop(item.children) };
      }
      return {
        title,
        key: item.key,
      };
    });
  }

  // 部门Tree点击树节点触发
  const onSelectDeptTree = (selectedKeys: Key[]) => {
    setDeptTreeSelectedId(selectedKeys[0]);
    tableActionRef?.current?.reload();
  };

  // 表格获取用户信息列表
  const getList = (params: UserItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    if (deptTreeSelectedId) {
      params.deptId = deptTreeSelectedId;
    } else {
      delete params.deptId;
    }
    return listUser(params, sort, filter);
  };

  // 表格列的配置描述
  const columns: ProColumns<UserItem>[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      width: 50,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      width: 50,
      sorter: true,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      width: 100,
      sorter: true,
    },
    {
      title: '部门',
      dataIndex: ['dept', 'deptName'],
      width: 100,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      width: 50,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 25,
      valueType: 'select',
      sorter: true,
      fieldProps: { options: dicts.sys_normal_disable || [] },
      render: (dom, entity) => {
        return (
          <Switch checked={entity.status === '0'} disabled={entity.userId === 1} onChange={
            (checked: boolean) => {
              handleStatusChange(checked, entity, tableActionRef);
            }
          } />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 110,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            params: {
              beginTime: value?.[0],
              endTime: value?.[1],
            },
          };
        },
      },
    },
    {
      title: '操作',
      width: 100,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => entity.userId !== 1 &&
        [
          <Access accessible={access['system:user:edit']} key="update">
            <UserEditor userId={entity.userId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改用户" dicts={dicts}
                        deptTreeSelectData={deptTreeSelectData} tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:user:remove']} key="delete">
            <Button icon={<DeleteOutlined />} type="link" size='small' onClick={
              () => {
                handleDelete([entity.userId as Key], tableActionRef);
              }
            }>删除</Button>
          </Access>,
          <Access accessible={access['system:user:edit'] || access['system:user:resetPwd']} key="more">
            <TableDropdown
              menus={(() => {
                const _menus = [];
                if (access['system:user:resetPwd']) {
                  _menus.push({
                    key: 'resetPwd',
                    name: (
                      <RestPassword {...entity} />
                    ),
                  });
                }
                if (access['system:user:edit']) {
                  _menus.push({
                    key: 'assignRole',
                    name: (
                      <AssignRole userId={entity.userId as Key} />
                    ),
                  });
                }
                return _menus;
              })()}
            >
              <Button type="link" size="small"><DoubleRightOutlined />更多</Button>
            </TableDropdown>
          </Access>
        ],
    },
  ];

  // 选择功能的配置
  const tableRowSelection = {
    onChange: (selectedRowKeys: Key[]) => {
      setIds(selectedRowKeys);
    },
    getCheckboxProps: (record: UserItem) => ({
      disabled: record.userId === 1,
    }),
  };

  return (
    <PageContainer>
      <Row gutter={20}>
        <Col xl={4} xs={24}>
          <div>
            <Input.Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" allowClear={true} onSearch={onSearchDeptTree} />
            <Tree
              height={500}
              treeData={deptTreeDataLoop(deptTreeData)}
              onSelect={onSelectDeptTree}
              onExpand={onExpandDeptTree}
              expandedKeys={deptTreeExpandedKeys}
              autoExpandParent={deptTreeAutoExpandParent}
            />
          </div>
        </Col>
        <Col xl={20} xs={24}>
          <ProTable<UserItem>
            actionRef={tableActionRef}
            formRef={tableFormRef}
            bordered={true}
            columns={columns}
            columnsState={{
              persistenceKey: 'system-user-table-columns-state',
              persistenceType: 'localStorage',
            }}
            dateFormatter="string"
            form={{ name: 'searchForm' }}
            headerTitle="用户信息"
            defaultSize={"small"}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
              showQuickJumper: true,
              showSizeChanger: true,
            }}
            request={getList}
            rowKey="userId"
            rowSelection={{
              type: 'checkbox',
              columnWidth: '30px',
              fixed: true,
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              ...tableRowSelection,
            }}
            search={{
              labelWidth: 'auto',
            }}
            scroll={{ x: 1600 }}
            toolBarRender={() => [
              <Access accessible={access['system:user:add']} key="add">
                <UserEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加用户" dicts={dicts} deptTreeSelectData={deptTreeSelectData}
                            tableActionRef={tableActionRef} />
              </Access>,
              <Access accessible={access['system:user:edit']} key="update">
                <UserEditor userId={ids[0]} icon={<EditOutlined />} disabled={ids.length !== 1} type="primary" content="修改" title="修改用户" dicts={dicts}
                            deptTreeSelectData={deptTreeSelectData} tableActionRef={tableActionRef} />
              </Access>,
              <Access accessible={access['system:user:remove']} key="delete">
                <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                        onClick={() => {
                          handleDelete(ids, tableActionRef);
                        }}>
                  删除
                </Button>
              </Access>,
              <Access accessible={access['system:user:import']} key="import">
                <ImportUser tableActionRef={tableActionRef} />
              </Access>,
              <Access accessible={access['system:user:export']} key="export">
                <Popconfirm
                  title="请确认操作"
                  onConfirm={async () => {
                    await handleExport(tableFormRef);
                  }}
                >
                  <Button icon={<ExportOutlined />} size="small" type="primary">
                    导出
                  </Button>
                </Popconfirm>
              </Access>,
            ]}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default User;
