export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: '登陆',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: '注册',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/home',
    name: '主页',
    icon: 'home',
    component: './home',
  },
  {
    name: '个人页',
    icon: 'user',
    path: '/account',
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: '个人中心',
        icon: 'smile',
        path: '/account/center',
        component: './system/user/center',
      },
      {
        name: '个人设置',
        icon: 'smile',
        path: '/account/settings',
        component: './system/user/settings',
      },
    ],
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'setting',
    routes: [
      {
        path: '/system/user',
        name: '用户管理',
        icon: 'smile',
        component: './system/user',
        access: 'system:user:list',
      },
      {
        path: '/system/role',
        name: '角色管理',
        icon: 'smile',
        component: './system/role',
        access: 'system:role:list',
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        icon: 'smile',
        component: './system/menu',
        access: 'system:menu:list',
      },
      {
        path: '/system/dept',
        name: '部门管理',
        icon: 'smile',
        component: './system/dept',
        access: 'system:dept:list',
      },
      {
        path: '/system/post',
        name: '岗位管理',
        icon: 'smile',
        component: './system/post',
        access: 'system:post:list',
      },
      {
        path: '/system/dict',
        name: '字典管理',
        icon: 'smile',
        component: './system/dict',
        access: 'system:dict:list',
      },
      {
        path: '/system/config',
        name: '参数设置',
        icon: 'smile',
        component: './system/config',
        access: 'system:config:list',
      },
      {
        path: '/system/notice',
        name: '通知公告',
        icon: 'smile',
        component: './system/notice',
        access: 'system:notice:list',
      },
      {
        path: '/system/log',
        name: '日志管理',
        icon: 'smile',
        routes: [
          {
            path: '/system/log/operlog',
            name: '操作日志',
            icon: 'smile',
            component: './monitor/operlog',
            access: 'monitor:operlog:list',
          },
          {
            path: '/system/log/logininfor',
            name: '登录日志',
            icon: 'smile',
            component: './monitor/logininfor',
            access: 'monitor:logininfor:list',
          },
        ],
      },
    ],
  },
  {
    path: '/monitor',
    name: '系统监控',
    icon: 'monitor',
    routes: [
      {
        path: '/monitor/online',
        name: '在线用户',
        icon: 'smile',
        component: './monitor/online',
        access: 'monitor:online:list',
      },
      {
        path: '/monitor/job',
        name: '定时任务',
        icon: 'smile',
        component: './monitor/job',
        access: 'monitor:job:list',
      },
      {
        path: '/monitor/druid',
        name: '数据监控',
        icon: 'smile',
        component: './monitor/druid',
        access: 'monitor:druid:list',
      },
      {
        path: '/monitor/server',
        name: '服务监控',
        icon: 'smile',
        component: './monitor/server',
        access: 'monitor:server:list',
      },
      {
        path: '/monitor/cache',
        name: '缓存监控',
        icon: 'smile',
        component: './monitor/cache',
        access: 'monitor:cache:list',
      },
      {
        path: '/monitor/cacheList',
        name: '缓存列表',
        icon: 'smile',
        component: './monitor/cache/cacheList',
        access: 'monitor:cache:list',
      },
    ]
  },
  {
    path: '/tool',
    name: '系统工具',
    icon: 'tool',
    routes: [
      {
        path: '/tool/swagger',
        name: '系统接口',
        icon: 'smile',
        component: './tool/swagger',
        access: 'tool:swagger:list',
      },
    ]
  },
  {
    path: '/xFlow',
    name: 'xFlow',
    icon: 'tool',
    routes: [
      {
        path: '/xFlow',
        name: 'xFlow',
        icon: 'smile',
        component: './xFlow/index',
        access: 'xFlow:test',
      },
      {
        path: '/xFlow/basic',
        name: 'basic',
        icon: 'smile',
        component: './xFlow/basic/index',
        access: 'xFlow:basic',
      },
      {
        path: '/xFlow/dynamic-ports',
        name: 'dynamic-ports',
        icon: 'smile',
        component: './xFlow/dynamic-ports/index',
        access: 'xFlow:dynamic-ports',
      },
      {
        path: '/xFlow/layout',
        name: 'layout',
        icon: 'smile',
        component: './xFlow/layout/index',
        access: 'xFlow:layout',
      },
      {
        path: '/xFlow/port-config',
        name: 'port-config',
        icon: 'smile',
        component: './xFlow/port-config/index',
        access: 'xFlow:port-config',
      },
    ]
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
        access: 'isAdmin',
      },
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './exception/403',
        access: 'isAdmin',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './exception/404',
        access: 'isAdmin',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './exception/500',
        access: 'isAdmin',
      },
    ],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: '404',
  },
];
