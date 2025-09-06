/* 背景流量 */
export default [
  {
    name: 'static-traffic-list',
    path: '/admin/cr/admin/traffic/background',
    // title: 'mgRoutes.backgroundTraffic',
    title: 'routes.static-traffic-list',
    component: './frame',
    meta: {},
  },
  {
    name: 'static-traffic-create',
    path: '/admin/cr/admin/traffic/background/create',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'static-traffic-list',
      },
    },
  },
  {
    name: 'static-traffic-update',
    path: '/admin/cr/admin/traffic/background/edit/:resource_id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'static-traffic-list',
      },
    },
  },
  {
    // 背景流量-类型管理
    path: '/admin/cr/admin/traffic/background/type_list',
    component: './frame',
    name: 'static-traffic-type-list',
    title: 'routes.traffic-type-list',
    meta: {
      breadcrumb: {
        parentName: 'static-traffic-list',
      },
    },
  },
  {
    // 背景流量-类型新增
    path: '/admin/cr/admin/traffic/background/type_list/add',
    component: './frame',
    name: 'static-traffic-type-add',
    title: 'mgRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'static-traffic-type-list',
      },
    },
  },
  {
    // 背景流量-类型编辑
    path: '/admin/cr/admin/traffic/background/type_list/edit',
    component: './frame',
    name: 'static-traffic-type-edit',
    title: 'mgRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'static-traffic-type-list',
      },
    },
  },
];
