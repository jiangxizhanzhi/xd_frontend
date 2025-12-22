export default [
  {
    name: 'cr-individual-training',
    path: '/admin/cr/admin/event/list-train-single',
    // title: 'mgRoutes.singleTrain',
    title: 'routes.cr-individual-training',
    component: './frame',
    meta: {
      iconfont: 'icon-yonghufupan',
    },
  },
  {
    path: '/admin/cr/admin/event/single/create',
    title: '新增',
    component: './frame',
    name: 'cr-event-train-single-create',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
    },
  },
  {
    path: '/admin/cr/admin/event/single/:id',
    component: './frame',
    name: 'cr-event-train-single-edit',
    title: '编辑',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
    },
  },
  {
    name: 'event-auth-single',
    path: '/admin/cr/admin/event/single/:eventId/auth/:resourceId',
    component: './frame',
    title: 'mgRoutes.authorizedGrant',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
    },
  },
  {
    path: '/admin/cr/admin/scene/single/config/:id/test',
    component: './frame',
    name: 'scene-config-test-single',
    title: 'mgRoutes.scenarioTest',
    meta: {
      breadcrumb: {
        parentName: 'cr-individual-training',
      },
    },
  },
];
