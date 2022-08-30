/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  currentUser?: RuoYiApi.CurrentUser;
  roles?: RuoYiApi.Roles;
  permissions?: RuoYiApi.Permissions;
} | undefined) {
  const { permissions } = initialState ?? {};
  const all_permission = "*:*:*";
  const isAdmin = (permissions ? permissions : [] as string[]).includes(all_permission);

  const hasPermission = (permission: string) => {
    return isAdmin || (permissions ? permissions : [] as string[]).includes(permission);
  };

  // [系统管理]目录下菜单权限
  const system = {
    'system:user:list': hasPermission('system:user:list'),
    'system:user:query': hasPermission('system:user:query'),
    'system:user:add': hasPermission('system:user:add'),
    'system:user:edit': hasPermission('system:user:edit'),
    'system:user:remove': hasPermission('system:user:remove'),
    'system:user:export': hasPermission('system:user:export'),
    'system:user:import': hasPermission('system:user:import'),
    'system:user:resetPwd': hasPermission('system:user:resetPwd'),
    'system:role:list': hasPermission('system:role:list'),
    'system:role:query': hasPermission('system:role:query'),
    'system:role:add': hasPermission('system:role:add'),
    'system:role:edit': hasPermission('system:role:edit'),
    'system:role:remove': hasPermission('system:role:remove'),
    'system:role:export': hasPermission('system:role:export'),
    'system:menu:list': hasPermission('system:menu:list'),
    'system:menu:query': hasPermission('system:menu:query'),
    'system:menu:add': hasPermission('system:menu:add'),
    'system:menu:edit': hasPermission('system:menu:edit'),
    'system:menu:remove': hasPermission('system:menu:remove'),
    'system:dept:list': hasPermission('system:dept:list'),
    'system:dept:query': hasPermission('system:dept:query'),
    'system:dept:add': hasPermission('system:dept:add'),
    'system:dept:edit': hasPermission('system:dept:edit'),
    'system:dept:remove': hasPermission('system:dept:remove'),
    'system:post:list': hasPermission('system:post:list'),
    'system:post:query': hasPermission('system:post:query'),
    'system:post:add': hasPermission('system:post:add'),
    'system:post:edit': hasPermission('system:post:edit'),
    'system:post:remove': hasPermission('system:post:remove'),
    'system:post:export': hasPermission('system:post:export'),
    'system:dict:list': hasPermission('system:dict:list'),
    'system:dict:query': hasPermission('system:dict:query'),
    'system:dict:add': hasPermission('system:dict:add'),
    'system:dict:edit': hasPermission('system:dict:edit'),
    'system:dict:remove': hasPermission('system:dict:remove'),
    'system:dict:export': hasPermission('system:dict:export'),
    'system:config:list': hasPermission('system:config:list'),
    'system:config:query': hasPermission('system:config:query'),
    'system:config:add': hasPermission('system:config:add'),
    'system:config:edit': hasPermission('system:config:edit'),
    'system:config:remove': hasPermission('system:config:remove'),
    'system:config:export': hasPermission('system:config:export'),
    'system:notice:list': hasPermission('system:notice:list'),
    'system:notice:query': hasPermission('system:notice:query'),
    'system:notice:add': hasPermission('system:notice:add'),
    'system:notice:edit': hasPermission('system:notice:edit'),
    'system:notice:remove': hasPermission('system:notice:remove'),
    'monitor:operlog:list': hasPermission('monitor:operlog:list'),
    'monitor:operlog:query': hasPermission('monitor:operlog:query'),
    'monitor:operlog:remove': hasPermission('monitor:operlog:remove'),
    'monitor:operlog:export': hasPermission('monitor:operlog:export'),
    'monitor:logininfor:list': hasPermission('monitor:logininfor:list'),
    'monitor:logininfor:query': hasPermission('monitor:logininfor:query'),
    'monitor:logininfor:remove': hasPermission('monitor:logininfor:remove'),
    'monitor:logininfor:export': hasPermission('monitor:logininfor:export'),
    'monitor:logininfor:unlock': hasPermission('monitor:logininfor:unlock'),
  };

  // [系统监控]目录下菜单权限
  const monitor = {
    'monitor:online:list': hasPermission('monitor:online:list'),
    'monitor:online:query': hasPermission('monitor:online:query'),
    'monitor:online:batchLogout': hasPermission('monitor:online:batchLogout'),
    'monitor:online:forceLogout': hasPermission('monitor:online:forceLogout'),
    'monitor:job:list': hasPermission('monitor:job:list'),
    'monitor:job:query': hasPermission('monitor:job:query'),
    'monitor:job:add': hasPermission('monitor:job:add'),
    'monitor:job:edit': hasPermission('monitor:job:edit'),
    'monitor:job:remove': hasPermission('monitor:job:remove'),
    'monitor:job:changeStatus': hasPermission('monitor:job:changeStatus'),
    'monitor:job:export': hasPermission('monitor:job:export'),
    'monitor:druid:list': hasPermission('monitor:druid:list'),
    'monitor:server:list': hasPermission('monitor:server:list'),
    'monitor:cache:list': hasPermission('monitor:cache:list'),
  };

  // [系统工具]目录下菜单权限
  const tool = {
    'tool:swagger:list': hasPermission('tool:swagger:list'),
  };

  return {
    isAdmin,
    ...system,
    ...monitor,
    ...tool,
  };
}
