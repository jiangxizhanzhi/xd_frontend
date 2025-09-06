export default [
  {
    name: 'ct-operation-question-list',
    path: '/admin/ct/admin/operation-question',
    title: 'routes.ct-operation-question-list',
    component: './frame',
  },
  {
    name: 'ct-operation-question-add',
    path: '/admin/ct/admin/operation-question/add',
    title: 'ctRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-operation-question-list',
      },
    },
  },
  {
    name: 'ct-operation-question-edit',
    path: '/admin/ct/admin/operation-question/edit/:resource_id',
    title: 'ctRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-operation-question-list',
      },
    },
  },
  {
    name: 'ct-operation-question-test',
    path: '/admin/ct/admin/operation-question/test/:resource_id/:scene_config_id',
    title: 'ctRoutes.test',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-operation-question-list',
      },
    },
  },
];
