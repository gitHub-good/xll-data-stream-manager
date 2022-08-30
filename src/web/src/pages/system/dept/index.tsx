import type { FC, MutableRefObject, ReactText , Key} from 'react';
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dataFormat, dict, modal } from "@/utils";
import type { DeptItem } from "./data";
import { delDept, listDept } from "./service";
import { DeptEditor } from "./components";

/** 删除 */
const handleDelete = (deptId: Key, tableActionRef: MutableRefObject<ActionType | undefined>, deptName: string) => {
  const _modal = modal.confirm(
    '是否确认删除名称为"' + deptName + '"的数据项？'
    , async () => {
      try {
        await delDept(deptId);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

const Dept: FC = () => {
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
  const getList = (params: DeptItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listDept(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<DeptItem>[] = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      width: 200,
    },
    {
      title: '部门ID',
      dataIndex: 'deptId',
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
        <Access accessible={access['system:dept:edit']} key="update">
          <DeptEditor deptId={entity.deptId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改部门" dicts={dicts}
                      tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:dept:add']} key="add">
          <DeptEditor parentId={entity.deptId} icon={<PlusOutlined />} disabled={false} type="link" content="新增" title="添加部门" dicts={dicts}
                      tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:dept:remove'] && entity.parentId !== 0} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete(entity.deptId as Key, tableActionRef, entity.deptName as string);
                    }
                  }>删除</Button>
        </Access>,
      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<DeptItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-dept-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="部门信息"
        defaultSize={"small"}
        pagination={false}
        request={getList}
        postData={(data) => dataFormat.listToTree(data, 'deptId')}
        rowKey="deptId"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Access accessible={access['system:dept:add']} key="add">
            <DeptEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加部门" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
        ]}
      />
    </PageContainer>
  );
};

export default Dept;
