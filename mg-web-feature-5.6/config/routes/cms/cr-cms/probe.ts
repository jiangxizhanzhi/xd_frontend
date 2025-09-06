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
        title: 'mgRoutes.add',
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
        title: 'mgRoutes.edit',
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
        title: 'mgRoutes.add',
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
        title: 'mgRoutes.edit',
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
      //   title: 'mgRoutes.add',
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
      //   title: 'mgRoutes.edit',
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
