import { ClusterOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row } from 'antd';
import React, { useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import type { RouteChildrenProps } from 'react-router';
import styles from './Center.less';
import { getUserProfile } from "../service";

type tabKeyType = 'tab1' | 'tab2' | 'tab3';

const operationTabList = [
  {
    key: 'tab1',
    tab: (
      <span>
        Tab1 <span style={{ fontSize: 14 }}>(0)</span>
      </span>
    ),
  },
  {
    key: 'tab2',
    tab: (
      <span>
        Tab2 <span style={{ fontSize: 14 }}>(0)</span>
      </span>
    ),
  },
  {
    key: 'tab3',
    tab: (
      <span>
        Tab3 <span style={{ fontSize: 14 }}>(0)</span>
      </span>
    ),
  },
];

const Center: React.FC<RouteChildrenProps> = () => {
  const [tabKey, setTabKey] = useState<tabKeyType>('tab1');

  //  获取用户信息
  const { data: userInfo, loading } = useRequest(() => {
    return getUserProfile();
  });

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: tabKeyType) => {
    if (tabValue === 'tab1') {
      return null;
    }
    if (tabValue === 'tab2') {
      return null;
    }
    if (tabValue === 'tab3') {
      return null;
    }
    return null;
  };

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={loading}>
            {!loading && userInfo && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={userInfo.data.avatar ? REACT_APP_BASE_API + userInfo.data.avatar : require('@/assets/images/avatar.png')} />
                  <div className={styles.name}>{userInfo.data.nickName}[{userInfo.data.userName}]</div>
                </div>
                <div className={styles.detail}>
                  <p>
                    <ClusterOutlined
                      style={{
                        marginRight: 8,
                      }}
                    />
                    {userInfo.data.dept?.deptName}
                  </p>
                  <p>
                    <UserOutlined
                      style={{
                        marginRight: 8,
                      }}
                    />
                    {userInfo.postGroup}
                  </p>
                  <p>
                    <TeamOutlined
                      style={{
                        marginRight: 8,
                      }}
                    />
                    {userInfo.roleGroup}
                  </p>
                </div>
                <Divider dashed />
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={(_tabKey: string) => {
              setTabKey(_tabKey as tabKeyType);
            }}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};
export default Center;
