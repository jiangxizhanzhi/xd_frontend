export default [
  // 夺旗赛
  {
    name: 'ct-ai-list',
    path: '/admin/ct/admin/ai/list',
    title: 'routes.ct-ai-list',
    component: './frame',
  },
  {
    name: 'ct-ai-add',
    path: '/admin/ct/admin/ai/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-list',
      },
    },
  },
  {
    name: 'ct-ai-copy',
    path: '/admin/ct/admin/ai/copy/:copyId',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-list',
      },
    },
  },
  {
    name: 'ct-ai-edit',
    path: '/admin/ct/admin/ai/edit/:resource_id',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-list',
      },
    },
  },
  {
    name: 'ct-ai-operation',
    path: '/admin/ct/admin/ai/contest/:resource_id',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-list',
      },
    },
  },
  {
    name: 'ct-ai-subject-edit',
    path: '/admin/ct/admin/ai/contest/subject/edit/:resource_id/:topicId',
    component: './frame',
    title: 'ctRoutes.topicOperations',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-operation',
      },
    },
  },
];
