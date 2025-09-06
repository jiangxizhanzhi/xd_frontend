export default [
  {
    name: 'ct-ad-question-list',
    path: '/admin/ct/admin/ad-question',
    title: 'routes.ct-ad-question-list',
    component: './frame',
  },
  {
    name: 'ct-ad-question-add',
    path: '/admin/ct/admin/ad-question/add',
    title: 'ctRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-ad-question-list',
      },
    },
  },
  {
    name: 'ct-ad-question-edit',
    path: '/admin/ct/admin/ad-question/edit/:resource_id',
    title: 'ctRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-ad-question-list',
      },
    },
  },
];
