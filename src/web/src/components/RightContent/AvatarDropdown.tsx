import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { logout } from '@/services/frame/login';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { auth } from "@/utils";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await logout();
  auth.removeToken();
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.nickName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}
          items={(() => {
            const items = [];
            if (menu) {
              items.push({ key: 'center', label: '个人中心', title: '个人中心', icon: <UserOutlined /> });
              items.push({ key: 'settings', label: '个人设置', title: '个人设置', icon: <SettingOutlined /> });
              items.push({ key: 'divider', type: 'divider' });
            }
            items.push({ key: 'logout', label: '退出登录', title: '退出登录', icon: <LogoutOutlined /> });
            return items;
          })()}
    />
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar ? REACT_APP_BASE_API + currentUser.avatar : require('@/assets/images/avatar.png')} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.nickName}[{currentUser.userName}]</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
