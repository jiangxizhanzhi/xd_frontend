export default [
  {
    name: 'ct-ai-question-list',
    path: '/admin/ct/admin/ai-question',
    title: 'routes.ct-ai-question-list',
    component: './frame',
  },
  {
    name: 'ct-ai-question-add',
    path: '/admin/ct/admin/ai-question/add',
    title: 'ctRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-question-list',
      },
    },
  },
  {
    name: 'ct-ai-question-edit',
    path: '/admin/ct/admin/ai-question/edit/:resource_id',
    title: 'ctRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-question-list',
      },
    },
  },
  {
    name: 'ct-ai-question-test',
    path: '/admin/ct/admin/ai-question/test/:resource_id',
    title: 'ctRoutes.test',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-ai-question-list',
      },
    },
  },
];
