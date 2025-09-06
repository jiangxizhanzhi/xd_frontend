export default [
  // 夺旗赛
  {
    name: 'ct-flag-list',
    path: '/admin/ct/admin/flag/list',
    title: 'routes.ct-flag-list',
    component: './frame',
  },
  {
    name: 'ct-flag-add',
    path: '/admin/ct/admin/flag/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-flag-list',
      },
    },
  },
  {
    name: 'ct-flag-edit',
    path: '/admin/ct/admin/flag/edit/:resource_id',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-flag-list',
      },
    },
  },
  {
    name: 'ct-flag-operation',
    path: '/admin/ct/admin/flag/contest/:resource_id',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-flag-list',
      },
    },
  },
  {
    name: 'ct-flag-subject-edit',
    path: '/admin/ct/admin/flag/contest/subject/edit/:resource_id/:topicId',
    component: './frame',
    title: 'ctRoutes.topicOperations',
    meta: {
      breadcrumb: {
        parentName: 'ct-flag-operation',
      },
    },
  },
];
