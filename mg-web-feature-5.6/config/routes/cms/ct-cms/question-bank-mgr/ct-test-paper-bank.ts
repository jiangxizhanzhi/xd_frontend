export default [
  {
    name: 'ct-test-paper-bank-list',
    path: '/admin/ct/admin/test-paper-bank',
    title: 'routes.ct-test-paper-bank-list',
    component: './frame',
  },
  {
    name: 'ct-test-paper-bank-add',
    path: '/admin/ct/admin/test-paper-bank/add',
    title: 'ctRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-test-paper-bank-list',
      },
    },
  },
  {
    name: 'ct-test-paper-bank-edit',
    path: '/admin/ct/admin/test-paper-bank/edit/:resource_id',
    title: 'ctRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'ct-test-paper-bank-list',
      },
    },
  },
];
