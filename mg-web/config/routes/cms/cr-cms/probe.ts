export default [
  {
    path: '',
    // title: 'mgRoutes.probeManagement',
    title: 'routes.cr-collection-system-folder',
    name: 'cr-collection-system-folder',
    meta: {
      iconfont: 'icon-tanzhenguanli',
    },
    children: [
      {
        path: '/admin/cr/admin/probe/universal-probe',
        title: 'routes.universal-probe',
        name: 'universal-probe',
        component: './frame',
      },
      {
        path: '/admin/cr/admin/probe/custom-probe',
        title: 'routes.custom-probe',
        name: 'custom-probe',
        component: './frame',
      },
      {
        path: '/admin/cr/admin/probe/custom-probe/create',
        component: './frame',
        title: '新增',
        name: 'custom-probe-create',
        meta: {
          breadcrumb: {
            parentName: 'custom-probe',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/custom-probe/edit/:id',
        component: './frame',
        title: '编辑',
        name: 'custom-probe-edit',
        meta: {
          breadcrumb: {
            parentName: 'custom-probe',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/collection-template',
        title: 'routes.collection-template',
        name: 'collection-template',
        component: './frame',
      },
      {
        path: '/admin/cr/admin/probe/collection-template/create',
        component: './frame',
        title: '新增',
        name: 'collection-template-create',
        meta: {
          breadcrumb: {
            parentName: 'collection-template',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/collection-template/edit/:id',
        component: './frame',
        title: '编辑',
        name: 'collection-template-edit',
        meta: {
          breadcrumb: {
            parentName: 'collection-template',
          },
        },
      },
      {
        path: '/admin/cr/admin/probe/collection-analyse',
        name: 'collection-analyse',
        title: 'routes.collection-analyse',
        component: './frame',
      },
      // {
      //   path: 'cr/admin/probe/probe',
      //   // title: 'mgRoutes.probeManagement',
      //   title: 'routes.cr-collection-system-folder',
      //   name: 'collection-system',
      //   component: './frame',
      //   meta: {
      //     hideInMenu: true,
      //   },
      //   children: [],
      // },
      // {
      //   path: 'cr/admin/probe/create',
      //   component: './frame',
      //   title: '新增',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'collection-system',
      //     },
      //   },
      //   name: 'probe-create',
      // },
      // {
      //   path: 'cr/admin/probe/:id',
      //   component: './frame',
      //   title: '编辑',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'collection-system',
      //     },
      //   },
      //   name: 'probe-edit',
      // },
    ],
  },
];
