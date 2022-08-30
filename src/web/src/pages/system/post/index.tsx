import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useEffect, useRef, useState } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Table } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import { dict, download, modal } from "@/utils";
import type { PostItem } from "./data";
import { delPost, listPost } from "./service";
import { PostEditor } from "./components";

/** 删除 */
const handleDelete = (postIds: Key[], tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认删除岗位编号为"' + postIds + '"的数据项？'
    , async () => {
      try {
        await delPost(postIds);
        tableActionRef?.current?.clearSelected?.();
        message.success('删除成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

/** 导出 */
const handleExport = async (tableFormRef: MutableRefObject<ProFormInstance | undefined>) => {
  await download.commonDownload(
    '/system/post/export',
    { ...tableFormRef?.current?.getFieldsFormatValue?.() },
    `post_${new Date().getTime()}.xlsx`
  );
}

const Post: FC = () => {
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

  // 表格获取信息列表
  const getList = (params: PostItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    return listPost(params, sort, filter);
  };

  // 表格列配置
  const columns: ProColumns<PostItem>[] = [
    {
      title: '岗位编号',
      dataIndex: 'postId',
      width: 50,
      hideInSearch: true,
      sorter: true,
      defaultSortOrder: 'ascend',
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      width: 50,
      sorter: true,
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
      width: 70,
      sorter: true,
    },
    {
      title: '岗位排序',
      dataIndex: 'postSort',
      width: 50,
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
          dict.selectDictLabel(dicts.sys_normal_disable, entity.status as string)
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
      title: '操作',
      width: 100,
      align: "center",
      key: 'option',
      valueType: 'option',
      fixed: "right",
      render: (dom, entity) => [
        <Access accessible={access['system:post:edit']} key="update">
          <PostEditor postId={entity.postId} icon={<EditOutlined />} disabled={false} type="link" content="修改" title="修改岗位" dicts={dicts}
                      tableActionRef={tableActionRef} />
        </Access>,
        <Access accessible={access['system:post:remove']} key="delete">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleDelete([entity.postId as Key], tableActionRef);
                    }
                  }>删除</Button>
        </Access>,
      ],
    }
  ];

  // 选择功能的配置
  const tableRowSelection = {
    onChange: (selectedRowKeys: Key[]) => {
      setIds(selectedRowKeys);
    },
  };

  return (
    <PageContainer>
      <ProTable<PostItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-post-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="岗位信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="postId"
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
          <Access accessible={access['system:post:add']} key="add">
            <PostEditor icon={<PlusOutlined />} disabled={false} type="primary" content="新增" title="添加岗位" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:post:edit']} key="update">
            <PostEditor postId={ids[0]} icon={<EditOutlined />} disabled={ids.length !== 1} type="primary" content="修改" title="修改岗位" dicts={dicts}
                        tableActionRef={tableActionRef} />
          </Access>,
          <Access accessible={access['system:post:remove']} key="delete">
            <Button icon={<DeleteOutlined />} size="small" type="primary" danger disabled={ids.length <= 0}
                    onClick={() => {
                      handleDelete(ids, tableActionRef);
                    }}>
              删除
            </Button>
          </Access>,
          <Access accessible={access['system:post:export']} key="export">
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

export default Post;
