import vulnWeb from './vuln-web';
export default [
  {
    path: '',
    // title: 'route.resourceCenter',
    title: 'routes.recourse-center-folder',
    name: 'recourse-center-folder',
    children: [
      {
        name: 'tool-magazine',
        path: '/cr/tool_magazine',
        // title: 'route.toolLibrary',
        title: 'routes.tool-magazine',
        meta: {},
        component: './frame',
      },
      //工具库详情
      {
        name: 'tool-magazine-details',
        path: '/cr/tool_magazine_details/:id',
        title: 'route.toolLibraryDetail',
        meta: {
          breadcrumb: {
            parentName: 'tool-magazine',
          },
        },
        component: './frame',
      },
      // 活体漏洞
      // {
      //   name: 'vulnerability-library',
      //   path: '/cr/vulnerability_library',
      //   // title: 'route.vulnerabilityDatabase',
      //   title: 'routes.vulnerability-library',
      //   meta: {},
      //   component: './frame',
      // },
      // {
      //   name: 'vulnerability-library-detail',
      //   path: '/cr/vulnerability_library_detail',
      //   title: 'route.VulnerabilityLibraryDetails',
      //   meta: {
      //     breadcrumb: {
      //       parentName: 'vulnerability-library',
      //     },
      //   },
      //   component: './frame',
      // },
      ...vulnWeb,
      {
        name: 'tool-exp',
        path: '/vuln/tool_exp',
        // title: 'route.EXPdatabase',
        title: 'routes.tool-exp',
        meta: {},
        component: './pages/web/tool-exp/index.vue',
      },
      {
        name: 'tool-exp-details',
        path: '/vuln/tool_exp_details/:id',
        title: 'route.EXPDetails',
        meta: {
          breadcrumb: {
            parentName: 'tool-exp',
          },
        },
        component: './pages/web/tool-exp/tool_exp_details.vue',
      },

      {
        name: 'tool-shell',
        path: '/vuln/tool_shell',
        // title: 'route.ShellCodeDatabase',
        title: 'routes.tool-shell',
        meta: {},
        component: './pages/web/tool-shell/index.vue',
      },
      {
        name: 'tool-shell-details',
        path: '/vuln/tool_shell_details/:id',
        title: 'route.ShellCodeDatabaseDetail',
        meta: {
          breadcrumb: {
            parentName: 'tool-shell',
          },
        },
        component: './pages/web/tool-shell/tool_shell_details.vue',
      },
      {
        name: 'ghdb-library',
        path: '/vuln/ghdb_library',
        // title: 'route.GHDBDatabase',
        title: 'routes.ghdb-library',
        meta: {},
        component: './pages/web/ghdb-library/index.vue',
      },
      {
        name: 'ghdb-library-detail',
        path: '/vuln/ghdb_library_detail/:id',
        title: 'route.GHDBDatabaseDetail',
        meta: {
          breadcrumb: {
            parentName: 'ghdb-library',
          },
        },
        component: './pages/web/ghdb-library/ghdb_library_detail.vue',
      },
    ],
  },
];
