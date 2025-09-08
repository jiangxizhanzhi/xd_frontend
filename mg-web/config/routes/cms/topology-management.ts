export default [
  // {
  //   name: 'topology-management-folder',
  //   path: '',
  //   title: 'routes.topology-management-folder',
  //   meta: {
  //     iconfont: 'icon-tuopu',
  //   },
  //   children: [
  {
    name: 'topology-management',
    path: '/admin/topology-management',
    title: 'routes.topology-management',
    component: './pages/cms/topology-management/index.vue',
    meta: {
      // hideInMenu: true,
      iconfont: 'icon-tuopu',
      breadcrumb: false,
      module: 'topology-management',
    },
  },
  {
    name: 'topology-management-add',
    path: '/admin/topology-management/add',
    title: 'mgRoutes.add',
    component: './pages/cms/topology-management/topology-add.vue',
    meta: {
      breadcrumb: {
        parentName: 'topology-management',
      },
      module: 'topology-management',
    },
  },
  {
    name: 'topology-management-edit',
    path: '/admin/topology-management/edit/:id',
    title: 'mgRoutes.edit',
    component: './pages/cms/topology-management/topology-edit.vue',
    meta: {
      breadcrumb: {
        parentName: 'topology-management',
      },
      module: 'topology-management',
    },
  },
  //   ],
  // },
];
