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
    title: '网络管理',
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
    title: '新增拓扑',
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
    title: '编辑拓扑',
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
