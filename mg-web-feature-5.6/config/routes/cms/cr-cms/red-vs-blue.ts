export default [
  // {
  //   path: '',
  //   // title: 'mgRoutes.redVsBlue',
  //   title: 'routes.red-vs-blue-folder',
  //   name: 'red-vs-blue-folder',
  //   meta: {
  //     iconfont: 'icon-honglanduikang',
  //   },
  //   children: [
  {
    path: '/admin/cr/admin/event/list-red-blue',
    // title: 'mgRoutes.redVsBlue',
    title: 'routes.red-vs-blue-folder',
    name: 'red-blue',
    component: './frame',
    meta: {
      // hideInMenu: true,
      iconfont: 'icon-honglanduikang',
      breadcrumb: false,
    },
  },
  {
    path: '/admin/cr/admin/event/red_vs_blue/create',
    component: './frame',
    title: 'mgRoutes.add',
    name: 'cr-event-red-vs-blue-create',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
    },
  },
  {
    path: '/admin/cr/admin/event/red_vs_blue/:id',
    component: './frame',
    title: 'mgRoutes.edit',
    name: 'cr-event-red-vs-blue-edit',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
    },
  },
  {
    name: 'event-auth-red-blue',
    path: '/admin/cr/admin/event/red-vs-blue/:eventId/auth/:resourceId',
    component: './frame',
    title: 'mgRoutes.authorizedGrant',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
    },
  },
  {
    path: '/admin/cr/admin/scene/red-blue/config/:id/test',
    component: './frame',
    name: 'scene-config-test-red-blue',
    title: 'mgRoutes.scenarioTest',
    meta: {
      breadcrumb: {
        parentName: 'red-blue',
      },
    },
  },
  //   ],
  // },
];
