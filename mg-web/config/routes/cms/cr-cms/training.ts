export default [
  {
    name: 'cr-training-list-folder',
    path: '',
    // title: 'mgRoutes.combinedTrain',
    title: 'routes.cr-training-list-folder',
    meta: {
      iconfont: 'icon-zonghexunlian',
    },
    children: [
      {
        name: 'cr-individual-training',
        path: '/admin/cr/admin/event/list-train-single',
        // title: 'mgRoutes.singleTrain',
        title: 'routes.cr-individual-training',
        component: './frame',
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
      {
        name: 'cr-team-training',
        path: '/admin/cr/admin/event/list-train-team',
        // title: 'mgRoutes.teamTrain',
        title: 'routes.cr-team-training',
        component: './frame',
      },
      {
        path: '/admin/cr/admin/event/team/create',
        component: './frame',
        name: 'cr-event-train-team-create',
        title: '新增',
        meta: {
          breadcrumb: {
            parentName: 'cr-team-training',
          },
        },
      },
      {
        path: '/admin/cr/admin/event/team/:id',
        component: './frame',
        name: 'cr-event-train-team-edit',
        title: '编辑',
        meta: {
          breadcrumb: {
            parentName: 'cr-team-training',
          },
        },
      },
      {
        name: 'event-auth-team',
        path: '/admin/cr/admin/event/team/:eventId/auth/:resourceId',
        component: './frame',
        title: 'mgRoutes.authorizedGrant',
        meta: {
          breadcrumb: {
            parentName: 'cr-team-training',
          },
        },
      },
      {
        path: '/admin/cr/admin/scene/team/config/:id/test',
        component: './frame',
        name: 'scene-config-test-team',
        title: 'mgRoutes.scenarioTest',
        meta: {
          breadcrumb: {
            parentName: 'cr-team-training',
          },
        },
      },
    ],
  },
];
