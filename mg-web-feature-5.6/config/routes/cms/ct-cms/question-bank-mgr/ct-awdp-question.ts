export default [
  {
    name: 'ct-awdp-question-list',
    path: '/admin/ct/admin/awdp-question',
    title: 'routes.ct-awdp-question-list',
    component: './frame',
  },
  {
    name: 'ct-awdp-question-add',
    path: '/admin/ct/admin/awdp-question/add',
    title: 'ctRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-question-list',
      },
    },
  },
  {
    name: 'ct-awdp-question-edit',
    path: '/admin/ct/admin/awdp-question/edit/:resource_id',
    title: 'ctRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-question-list',
      },
    },
  },
  {
    name: 'ct-awdp-question-test',
    path: '/admin/ct/admin/awdp-question/test/:resource_id',
    title: 'ctRoutes.test',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-awdp-question-list',
      },
    },
  },
];
