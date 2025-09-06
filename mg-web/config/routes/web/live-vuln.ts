export default [
  {
    name: 'living-vulnerability',
    path: '',
    title: 'routes.living-vulnerability',
    meta: {
      breadcrumb: false,
    },
    children: [
      {
        name: 'living-vulnerability-overview',
        path: '/vuln/live-vulnerability-overview',
        component: './pages/web/vuln-list/overview',
        title: 'routes.living-vulnerability-overview',
      },
      {
        name: 'living-vulnerability-intelligence',
        path: '/vuln/live-vulnerability-intelligence',
        component: './pages/web/vuln-list/intelligence/index.vue',
        title: 'routes.living-vulnerability-intelligence',
      },
      {
        name: 'living-vulnerability-env',
        path: '/vuln/live-vulnerability-env',
        component: './pages/web/vuln-list/environment/index.vue',
        title: 'routes.living-vulnerability-env',
      },
      {
        name: 'living-vulnerability-exploitation',
        path: '/vuln/live-vulnerability-exploitation',
        component: './pages/web/vuln-list/exploitation/index.vue',
        title: 'routes.living-vulnerability-exploitation',
      },
      {
        name: 'living-vulnerability-analysis',
        path: '/vuln/live-vulnerability-analysis',
        component: './pages/web/vuln-list/analysis/index.vue',
        title: 'routes.living-vulnerability-analysis',
      },
    ],
  },
  {
    name: 'living-vuln-detail',
    path: '/vuln/living-detail/:resource_id',
    component: './pages/web/vuln-list/analysis/detail.vue',
    title: 'vulnRoutes.vuln-detail',
    meta: {
      breadcrumb: {
        parentName: 'living-vulnerability',
      },
    },
  },
  {
    name: 'living-vuln-analysis-detail',
    path: '/vuln/living-analysis-detail/:resource_id',
    component: './pages/web/vuln-list/analysis/detail.vue',
    title: 'vulnRoutes.vuln-detail',
    meta: {
      breadcrumb: {
        parentName: 'living-vulnerability-analysis',
      },
    },
  },
  {
    name: 'living-vuln-exp-detail',
    path: '/vuln/living-exp-detail/:resource_id',
    component: './pages/web/vuln-list/exploitation/detail.vue',
    title: 'vulnRoutes.vuln-detail',
    meta: {
      breadcrumb: {
        parentName: 'living-vulnerability-exploitation',
      },
    },
  },
  {
    name: 'vuln-intelligence-detail',
    path: '/vuln/living-intelligence-detail/:resource_id',
    component: './pages/web/vuln-list/intelligence/detail.vue',
    title: 'vulnRoutes.vuln-detail',
    meta: {
      breadcrumb: {
        parentName: 'living-vulnerability-intelligence',
      },
    },
  },
  {
    name: 'vuln-env-detail',
    path: '/vuln/living-env-detail/:resource_id',
    component: './pages/web/vuln-list/environment/detail.vue',
    title: 'vulnRoutes.vuln-detail',
    meta: {
      breadcrumb: {
        parentName: 'living-vulnerability-env',
      },
    },
  },
];
