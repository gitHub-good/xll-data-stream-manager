import type { FC, ReactText, Key, MutableRefObject } from 'react';
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import {
  ProFormInstance, ActionType, ProColumns, PageContainer, ProTable
} from '@ant-design/pro-components';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dataFormat, dict, modal } from "@/utils";
import type { MenuItem } from "./data";
import { delMenu, listMenu } from "./service";
import { MenuEditor } from "./components";

/** 删除 */
const handleDelete = (menuId: Key, tableActionRef: MutableRefObject<ActionType | undefined>, menuName: string) => {
  const _modal = modal.confirm(
    '是否确认删除名称为"' + menuName + '"的数据项？'
    , async () => {
      try {
        await delMenu(menuId);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

const Menu: FC = () => {
  // 获取权限相关信息
  const access = useAccess();
  // 字典State
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
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

  // 表格获取信息列表
  const getList = (params: MenuItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listMenu(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<MenuItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      width: 200,
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 50,
      valueType: 'select',
      fieldProps: { options: dicts.sys_normal_disable || [] },
      render: (dom, entity) => {
        return (
          dict.selectDictLabel(dicts.sys_normal_disable, entity.status as string)
        );
      },
    },
    {
      title: '菜单编号',
      dataIndex: 'menuId',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 50,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 100,
      align: "center",
      key: 'option',
      valueType: 'option',
      render: (dom, entity) => [
        <Access accessible={access['system:menu:edit']} key="update">
          <MenuEditor menuId={entity.menuId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改菜单" dicts={dicts}
                      tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:menu:add']} key="add">
          <MenuEditor parentId={entity.menuId} icon={<PlusOutlined />} disabled={false} type="link" content="新增" title="添加菜单" dicts={dicts}
                      tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:menu:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete(entity.menuId as Key, tableActionRef, entity.menuName as string);
                    }
                  }>删除</Button>
        </Access>,
      ],
    }
  ];

  return (
    <PageContainer content={`Ant Design Pro中，
    Pro 中默认会读取 config/config.tsx 中的 routes 配置作为 ProLayout 的菜单数据来生成菜单，并且配合 plugin-access 还可以很方便的进行菜单的权限管理。
    本系统菜单、路由采用这种配置式路由方式，【菜单管理】用于配置菜单的"权限标识"，用于权限管理。`}>
      <ProTable<MenuItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-menu-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="菜单信息"
        defaultSize={"small"}
        pagination={false}
        request={getList}
        postData={(data) => dataFormat.listToTree(data, 'menuId')}
        rowKey="menuId"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Access accessible={access['system:menu:add']} key="add">
            <MenuEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加菜单" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
        ]}
      />
    </PageContainer>
  );
};

export default Menu;
