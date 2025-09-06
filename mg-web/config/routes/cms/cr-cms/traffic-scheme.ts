/* 流量集合 */
export default [
  {
    name: 'traffic-scheme-list',
    path: '/admin/cr/admin/traffic/scheme',
    title: 'routes.traffic-scheme-list',
    component: './frame',
    meta: {},
  },
  {
    path: '/admin/cr/admin/traffic/scheme/create',
    component: './frame',
    name: 'traffic-scheme-create',
    title: 'mgRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'traffic-scheme-list',
      },
    },
  },
  {
    path: '/admin/cr/admin/traffic/scheme/edit/:resource_id',
    component: './frame',
    name: 'traffic-scheme-edit',
    title: 'mgRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'traffic-scheme-list',
      },
    },
  },
  {
    // 流量详情安排
    path: '/admin/cr/admin/traffic/scheme/traffic/:resource_id',
    component: './frame',
    name: 'traffic-scheme-traffic-list',
    title: 'routes.traffic-detail-list',
    // title: 'routes.traffic-manage-folder',
    meta: {
      breadcrumb: {
        parentName: 'traffic-scheme-list',
      },
    },
  },
  {
    // 流量集合-类型管理
    path: '/admin/cr/admin/traffic/scheme/type_list',
    component: './frame',
    name: 'scheme-traffic-type-list',
    title: 'routes.traffic-type-list',
    meta: {
      breadcrumb: {
        parentName: 'traffic-scheme-list',
      },
    },
  },
  {
    // 流量集合-类型新增
    path: '/admin/cr/admin/traffic/scheme/type_list/add',
    component: './frame',
    name: 'scheme-traffic-type-add',
    title: 'mgRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'scheme-traffic-type-list',
      },
    },
  },
  {
    // 流量集合-类型编辑
    path: '/admin/cr/admin/traffic/scheme/type_list/edit',
    component: './frame',
    name: 'scheme-traffic-type-edit',
    title: 'mgRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'scheme-traffic-type-list',
      },
    },
  },
];
