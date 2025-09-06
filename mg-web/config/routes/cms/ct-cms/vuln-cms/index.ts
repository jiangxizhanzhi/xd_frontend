export default [
  {
    name: 'vulnerability',
    path: '/admin/vuln/admin/list',
    title: 'routes.vulnerability',
    meta: {},
    component: './pages/cms/vuln-mgr/index.vue',
  },
  {
    name: 'vuln-mgr-add',
    path: '/admin/vuln/admin/add',
    title: 'vulnRoutes.add',
    component: './pages/cms/vuln-mgr/vuln-add.vue',
    meta: {
      breadcrumb: {
        parentName: 'vulnerability',
      },
    },
  },
  {
    name: 'vuln-mgr-edit',
    path: '/admin/vuln/admin/edit/:resource_id',
    title: 'vulnRoutes.edit',
    component: './pages/cms/vuln-mgr/vuln-edit.vue',
    meta: {
      breadcrumb: {
        parentName: 'vulnerability',
      },
    },
  },
  {
    name: 'vuln-higher-info',
    path: '/admin/vuln/admin/higher-info/:resource_id',
    component: './pages/cms/higher-info/index.vue',
    title: 'vulnRoutes.vuln-higher-info',
    meta: {
      breadcrumb: {
        parentName: 'vulnerability',
      },
    },
  },
  // paper管理
  {
    name: 'vuln-paper-mgr',
    path: '/admin/vuln/admin/paper-mgr/list/:resource_id',
    component: './pages/cms/paper-mgr/index.vue',
    title: 'vulnRoutes.vuln-paper-mgr',
    meta: {
      breadcrumb: {
        parentName: 'vulnerability',
      },
    },
  },
  {
    name: 'vuln-paper-add',
    path: '/admin/vuln/admin/paper-mgr/add/:resource_id',
    component: './pages/cms/paper-mgr/paper-add.vue',
    title: 'vulnRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'vuln-paper-mgr',
      },
    },
  },
  {
    name: 'vuln-paper-edit',
    path: '/admin/vuln/admin/paper-mgr/edit/:resource_id/:paper_id',
    component: './pages/cms/paper-mgr/paper-edit.vue',
    title: 'vulnRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'vuln-paper-mgr',
      },
    },
  },
];
