export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
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
        name: 'register',
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
    name: 'home',
    icon: 'home',
    component: './home',
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/system/user',
        name: 'user',
        icon: 'smile',
        component: './system/user',
        access: 'system:user:list',
      },
      {
        path: '/system/role',
        name: 'role',
        icon: 'smile',
        component: './system/role',
        access: 'system:role:list',
      },
      {
        path: '/system/menu',
        name: 'menu',
        icon: 'smile',
        component: './system/menu',
        access: 'system:menu:list',
      },
      {
        path: '/system/dept',
        name: 'dept',
        icon: 'smile',
        component: './system/dept',
        access: 'system:dept:list',
      },
      {
        path: '/system/post',
        name: 'post',
        icon: 'smile',
        component: './system/post',
        access: 'system:post:list',
      },
      {
        path: '/system/dict',
        name: 'dict',
        icon: 'smile',
        component: './system/dict',
        access: 'system:dict:list',
      },
      {
        path: '/system/config',
        name: 'config',
        icon: 'smile',
        component: './system/config',
        access: 'system:config:list',
      },
      {
        path: '/system/notice',
        name: 'notice',
        icon: 'smile',
        component: './system/notice',
        access: 'system:notice:list',
      },
      {
        path: '/system/log',
        name: 'log',
        icon: 'smile',
        routes: [
          {
            path: '/system/log/operlog',
            name: 'operlog',
            icon: 'smile',
            component: './monitor/operlog',
            access: 'monitor:operlog:list',
          },
          {
            path: '/system/log/logininfor',
            name: 'logininfor',
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
    name: 'monitor',
    icon: 'monitor',
    routes: [
      {
        path: '/monitor/online',
        name: 'online',
        icon: 'smile',
        component: './monitor/online',
        access: 'monitor:online:list',
      },
      {
        path: '/monitor/job',
        name: 'job',
        icon: 'smile',
        component: './monitor/job',
        access: 'monitor:job:list',
      },
      {
        path: '/monitor/druid',
        name: 'druid',
        icon: 'smile',
        component: './monitor/druid',
        access: 'monitor:druid:list',
      },
      {
        path: '/monitor/server',
        name: 'server',
        icon: 'smile',
        component: './monitor/server',
        access: 'monitor:server:list',
      },
      {
        path: '/monitor/cache',
        name: 'cache',
        icon: 'smile',
        component: './monitor/cache',
        access: 'monitor:cache:list',
      },
      {
        path: '/monitor/cacheList',
        name: 'cacheList',
        icon: 'smile',
        component: './monitor/cache/cacheList',
        access: 'monitor:cache:list',
      },
    ]
  },
  {
    path: '/tool',
    name: 'tool',
    icon: 'tool',
    routes: [
      {
        path: '/tool/swagger',
        name: 'swagger',
        icon: 'smile',
        component: './tool/swagger',
        access: 'tool:swagger:list',
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
