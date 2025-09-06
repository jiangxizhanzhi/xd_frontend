export default [
  // {
  //   name: 'index',
  //   path: '',
  //   title: 'dashboard.dashboard',
  //   meta: {
  //     iconfont: 'icon-yibiaopan',
  //   },
  //   children: [
  {
    name: 'dashboard',
    path: '/admin/dashboard',
    title: 'routes.index',
    component: './pages/cms/dashboard/list',
    meta: {
      iconfont: 'icon-yibiaopan',
      // hideInMenu: true,
      breadcrumb: false,
      module: 'dashboard',
    },
  },
  {
    name: 'user-operation-monitor',
    path: '/admin/dashboard/user-operation-monitor/:id/:user',
    component: './pages/cms/dashboard/components/user-operation-monitor.vue',
    title: 'dashboard.userMonitor',
    meta: {
      breadcrumb: {
        parentName: 'dashboard',
      },
      module: 'dashboard',
    },
  },
  //   ],
  // },
];
