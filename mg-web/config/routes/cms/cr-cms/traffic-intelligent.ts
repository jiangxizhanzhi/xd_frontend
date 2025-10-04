/* 攻击流量 */
export default [
  {
    name: 'dynamic-traffic-list',
    path: '/admin/cr/admin/traffic/intelligent',
    // title: 'mgRoutes.attackTraffic',
    title: 'routes.dynamic-traffic-list',
    component: './frame',
    meta: {},
  },
  {
    path: '/admin/cr/admin/traffic/intelligent/create',
    component: './frame',
    name: 'dynamic-traffic-create',
    title: '新增',
    meta: {
      breadcrumb: {
        parentName: 'dynamic-traffic-list',
      },
    },
  },
  {
    path: '/admin/cr/admin/traffic/intelligent/edit/:resource_id',
    component: './frame',
    name: 'dynamic-traffic-update',
    title: '编辑',
    meta: {
      breadcrumb: {
        parentName: 'dynamic-traffic-list',
      },
    },
  },
  {
    // 攻击流量-类型管理
    path: '/admin/cr/admin/traffic/intelligent/type_list',
    component: './frame',
    name: 'dynamic-traffic-type-list',
    title: 'routes.traffic-type-list',
    meta: {
      breadcrumb: {
        parentName: 'dynamic-traffic-list',
      },
    },
  },
  {
    // 攻击流量-类型新增
    path: '/admin/cr/admin/traffic/intelligent/type_list/add',
    component: './frame',
    name: 'dynamic-traffic-type-add',
    title: '新增',
    meta: {
      breadcrumb: {
        parentName: 'dynamic-traffic-type-list',
      },
    },
  },
  {
    // 攻击流量-类型编辑
    path: '/admin/cr/admin/traffic/intelligent/type_list/edit',
    component: './frame',
    name: 'dynamic-traffic-type-edit',
    title: '编辑',
    meta: {
      breadcrumb: {
        parentName: 'dynamic-traffic-type-list',
      },
    },
  },
];
