import type { FC, Key, MutableRefObject, ReactText } from "react";
import { useRef } from "react";
import { Access, useAccess } from "umi";
import { PageContainer } from "@ant-design/pro-layout";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { ProFormInstance } from "@ant-design/pro-form";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import type { SortOrder } from "antd/lib/table/interface";
import lodash from 'lodash';
import { modal, tools } from "@/utils";
import type { OnlineItem } from "./data";
import { forceLogout, listOnline } from "./service";

/** 强退 */
const handleForceLogout = (tokenId: Key, userName: string, tableActionRef: MutableRefObject<ActionType | undefined>) => {
  const _modal = modal.confirm(
    '是否确认强退名称为"' + userName + '"的用户？'
    , async () => {
      try {
        await forceLogout(tokenId);
        tableActionRef?.current?.clearSelected?.();
        message.success('强退成功');
      } catch (e) {
        _modal.destroy();
      }
      tableActionRef?.current?.reload?.();
    }
  );
}

const Online: FC = () => {

  // 获取权限相关信息
  const access = useAccess();
  // Table action 的引用，便于自定义触发
  const tableActionRef = useRef<ActionType>();
  // Table Form 的引用，便于自定义触发
  const tableFormRef = useRef<ProFormInstance>();

  // 表格获取信息列表
  const getList = async (params: OnlineItem & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  }, sort: Record<string, SortOrder>, filter: Record<string, ReactText[] | null>,) => {
    const _params = lodash.cloneDeep(params);
    const result = await listOnline(params, sort, filter);
    const _result = lodash.cloneDeep(result);
    _result.data.sort((a: OnlineItem, b: OnlineItem) => {
      return (b.loginTime ?? 0) - (a.loginTime ?? 0);
    });
    _result.data = _result.data.slice((_params.current as number - 1) * (_params.pageSize as number), (_params.current as number) * (_params.pageSize as number));
    return _result;
  };

  // 表格列配置
  const columns: ProColumns<OnlineItem>[] = [
    {
      title: '会话编号',
      dataIndex: 'tokenId',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '登录名称',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '主机',
      dataIndex: 'ipaddr',
      width: 100,
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      width: 110,
      hideInSearch: true,
      render: (dom, entity) => {
        return tools.parseTime(entity.loginTime as number);
      },
    },
    {
      title: '操作',
      width: 50,
      align: "center",
      key: 'option',
      valueType: 'option',
      render: (dom, entity) => [
        <Access accessible={access['monitor:online:forceLogout']} key="forceLogout">
          <Button icon={<DeleteOutlined />} size="small" type="link"
                  onClick={
                    () => {
                      handleForceLogout(entity.tokenId as Key, entity.userName as string, tableActionRef);
                    }
                  }>强退</Button>
        </Access>,
      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<OnlineItem>
        actionRef={tableActionRef}
        formRef={tableFormRef}
        bordered={true}
        columns={columns}
        columnsState={{
          persistenceKey: 'system-online-table-columns-state',
          persistenceType: 'localStorage',
        }}
        dateFormatter="string"
        form={{ name: 'searchForm' }}
        headerTitle="在线用户信息"
        defaultSize={"small"}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={getList}
        rowKey="tokenId"
        search={{
          labelWidth: 'auto',
        }}
      />
    </PageContainer>
  );
};

export default Online;
