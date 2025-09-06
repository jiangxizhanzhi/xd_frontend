export default [
  {
    name: 'ct-operation-list',
    path: '/admin/ct/admin/operation/list',
    title: 'routes.ct-operation-list',
    component: './frame',
  },
  {
    name: 'ct-operation-add',
    path: '/admin/ct/admin/operation/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-operation-list',
      },
    },
  },
  {
    name: 'ct-operation-edit',
    path: '/admin/ct/admin/operation/edit/:resource_id',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-operation-list',
      },
    },
  },
  {
    name: 'ct-contest-operation',
    path: '/admin/ct/admin/operation/contest/:resource_id',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-operation-list',
      },
    },
  },
];
