export default [
  // 首页
  {
    name: 'vulnerability-library',
    path: '/vuln/vulnerability-library',
    title: 'routes.vulnerability-library',
    meta: {
      breadcrumb: false,
      // hideInMenu: true,
    },
    component: './pages/web/vuln-mgr/index.vue',
  },
  {
    name: 'vuln-list',
    path: '/vuln/list',
    component: './pages/web/vuln-list/index.vue',
    title: 'vulnRoutes.vuln-list',
    meta: {
      breadcrumb: {
        parentName: 'vulnerability-library',
      },
    },
  },
  {
    name: 'vuln-detail',
    path: '/vuln/detail/:resource_id',
    component: './pages/web/vuln-detail/index.vue',
    title: 'vulnRoutes.vuln-detail',
    meta: {
      breadcrumb: {
        parentName: 'vuln-list',
      },
    },
  },
];
