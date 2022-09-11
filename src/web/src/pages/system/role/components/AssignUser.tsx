import { useEffect, useRef, useState } from 'react';
import type { FC, Key } from "react";
import { Drawer, Button } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import {
  ProCard, ActionType
} from '@ant-design/pro-components';
import { dict } from '@/utils';
import AssignUserUnAllocatedTable from "./AssignUserUnAllocatedTable";
import AssignUserAllocatedTable from "./AssignUserAllocatedTable";

const AssignUser: FC<{ roleId: Key; }> = (props) => {

  const [visible, setVisible] = useState(false);
  const [dicts, setDicts] = useState<Record<string, { label: string, value: string }[]>>({});
  // 对话框是否打开过
  const [opened, setOpened] = useState(false);

  // 已授权用户table引用
  const allocatedTableActionRef = useRef<ActionType>();
  // 未授权用户table引用
  const unAllocatedTableActionRef = useRef<ActionType>();

  // 刷新所有表格
  const refreshAllTables = () => {
    allocatedTableActionRef?.current?.clearSelected?.();
    unAllocatedTableActionRef?.current?.clearSelected?.();
    allocatedTableActionRef?.current?.reload?.();
    unAllocatedTableActionRef?.current?.reload?.();
  }

  useEffect(() => {
    if (visible) {
      (async () => {
        const _dicts = await dict.getDicts(['sys_normal_disable']);
        setDicts(_dicts);
        if (!opened) {
          setOpened(true);
        } else {
          refreshAllTables();
        }
      })();
    }
  }, [visible]);

  return (
    <>
      <Button icon={<UserOutlined />} type="text" size='small' onClick={() => setVisible(true)}>
        分配用户
      </Button>
      <Drawer
        title="分配用户"
        destroyOnClose={true}
        keyboard={false}
        closable={true}
        maskClosable={false}
        visible={visible}
        width={1200}
        footer={
          <Button type="default" size='small' onClick={() => setVisible(false)}>
            关闭
          </Button>
        }
      >
        {visible && (
          <ProCard split="vertical">
            <ProCard colSpan={12} ghost>
              <AssignUserAllocatedTable roleId={props.roleId} allocatedTableActionRef={allocatedTableActionRef} refreshAllTables={refreshAllTables} dicts={dicts} />
            </ProCard>
            <ProCard colSpan={12} ghost>
              <AssignUserUnAllocatedTable roleId={props.roleId} unAllocatedTableActionRef={unAllocatedTableActionRef} refreshAllTables={refreshAllTables} dicts={dicts} />
            </ProCard>
          </ProCard>
        )}
      </Drawer>
    </>
  );
};

export default AssignUser;
