export default [
  {
    name: 'ct-cfs-question-list',
    path: '/admin/ct/admin/cfs-question',
    title: 'routes.ct-cfs-question-list',
    component: './frame',
  },
  {
    name: 'ct-cfs-question-add',
    path: '/admin/ct/admin/cfs-question/add',
    title: 'ctRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-cfs-question-list',
      },
    },
  },
  {
    name: 'ct-cfs-question-edit',
    path: '/admin/ct/admin/cfs-question/edit/:resource_id',
    title: 'ctRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-cfs-question-list',
      },
    },
  },
  {
    name: 'ct-cfs-question-test',
    path: '/admin/ct/admin/cfs-question/test/:resource_id/',
    title: 'ctRoutes.test',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-cfs-question-list',
      },
    },
  },
];
