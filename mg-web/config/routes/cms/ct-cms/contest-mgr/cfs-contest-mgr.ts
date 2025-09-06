export default [
  {
    name: 'ct-cfs-list',
    path: '/admin/ct/admin/cfs/list',
    title: 'routes.ct-cfs-list',
    component: './frame',
  },
  {
    name: 'ct-cfs-add',
    path: '/admin/ct/admin/cfs/add',
    component: './frame',
    title: 'ctRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'ct-cfs-list',
      },
    },
  },
  {
    name: 'ct-cfs-edit',
    path: '/admin/ct/admin/cfs/edit/:resource_id',
    component: './frame',
    title: 'ctRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'ct-cfs-list',
      },
    },
  },
  {
    name: 'ct-contest-cfs',
    path: '/admin/ct/admin/cfs/contest/:resource_id',
    component: './frame',
    title: 'ctRoutes.contestOperation',
    meta: {
      breadcrumb: {
        parentName: 'ct-cfs-list',
      },
    },
  },
];
