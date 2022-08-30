import { useEffect, useRef, useState } from "react";
import type { FC, Key, MutableRefObject, ReactText } from 'react';
import { Access, useAccess } from "umi";
import { Button, message, Popconfirm, Switch, Table, } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { PageContainer } from "@ant-design/pro-layout";
import type { ProFormInstance } from "@ant-design/pro-form";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable, { TableDropdown } from "@ant-design/pro-table";
import { DeleteOutlined, DoubleRightOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { dict, download, modal } from '@/utils';
import type { RoleItem } from "./data";
import { changeRoleStatus, delRole, listRole } from "./service";
import { AssignUser, DeptDataScope, RoleEditor } from "./components";

/** 修改角色状态 */
const handleStatusChange = (checked: boolean, entity: RoleItem, tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const text = entity.status === "0" ? "停用" : "启用";
  const _status = entity.status === "0" ? "1" : "0";
  const _modal = modal.confirm(
    '确认要"' + text + '""' + entity.roleName + '"角色吗？',
    async () => {
      try {
        await changeRoleStatus(entity.roleId as Key, _status);
        message.success(text + '成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    },
  );
}

/** 导出 */
const handleExport = async (tableFormRef: MutableRefObject<ProFormInstance | undefined>) => {
  await download.commonDownload(
    '/system/role/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `role_${new Date().getTime()}.xlsx`
  );
}

/** 删除 */
const handleDelete = (roleIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除角色编号为"' + roleIds + '"的数据项？'
    , async () => {
      try {
        await delRole(roleIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  )
}

const Role: FC = () => {
  // 获取权限相关信息
  const access = useAccess();
  // 字典State
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
  // 表格多选框State
  const [ids, setIds] = useState<Key[]>([]);
  // Table action 的引用，便于自定义触发
  const tableActionRef = useRef<ActionType>();
  // Table Form 的引用，便于自定义触发
  const tableFormRef = useRef<ProFormInstance>();

  useEffect(() => {
    (async () => {
      const _dicts = await dict.getDicts(['sys_normal_disable']);
      setDicts(_dicts);
    })();
  }, []);

  // 表格获取用户信息列表
  const getList = (params: RoleItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listRole(params, sort, filter);
  };

  // 表格列的配置描述
  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      width: 30,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 50,
      sorter: true,
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      width: 50,
      sorter: true,
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
      width: 30,
      hideInSearch: true,
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
          <Switch checked={entity.status === '0'} disabled={entity.roleId === 1} onChange={
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
      render: (dom, entity) => entity.roleId !== 1 &&
        [
          <Access accessible={access['system:role:edit']} key="update">
            <RoleEditor roleId={entity.roleId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改角色" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:role:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="link"
                    onClick={
                      () => {
                        handleDelete([entity.roleId as Key], tableActionRef);
                      }
                    }>删除</Button>
          </Access>,
          <Access accessible={access['system:role:edit']} key="more">
            <TableDropdown
              menus={(() => {
                const _menus = [];
                if (access['system:role:edit']) {
                  _menus.push({
                    key: 'deptDataScope',
                    name: (
                      <DeptDataScope roleId={entity.roleId as Key} />
                    ),
                  });
                }
                if (access['system:role:edit']) {
                  _menus.push({
                    key: 'assignUser',
                    name: (
                      <AssignUser roleId={entity.roleId as Key} />
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
    getCheckboxProps: (record: RoleItem) => ({
      disabled: record.roleId === 1,
    }),
  };

  return (
    <PageContainer>
      <ProTable<RoleItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-role-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="角色信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="roleId"
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
        scroll={{ x: 1400 }}
        toolBarRender={() => [
          <Access accessible={access['system:role:add']} key="add">
            <RoleEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加角色" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:role:edit']} key="update">
            <RoleEditor icon={<EditOutlined />} disabled={ids.length !== 1} type="primary" content="修改" title="修改角色" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:role:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>删除</Button>
          </Access>,
          <Access accessible={access['system:role:export']} key="export">
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
    </PageContainer>
  );
};

export default Role;
