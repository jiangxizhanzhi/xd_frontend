export default [
  {
    name: 'cluster-management',
    path: '/admin/cluster-management',
    title: 'routes.cluster-management',
    component: './pages/cms/system-operation/equipment-status-monitoring/list',
    meta: {
      module: 'cluster-management',
    },
  },
  {
    path: '/admin/cluster-management/create',
    component:
      './pages/cms/system-operation/equipment-status-monitoring/create',
    name: 'cluster-management-add',
    title: 'mgRoutes.add',
    meta: {
      breadcrumb: {
        parentName: 'cluster-management',
      },
      module: 'cluster-management',
    },
  },
  {
    path: '/admin/cluster-management/edit/:id',
    component: './pages/cms/system-operation/equipment-status-monitoring/edit',
    name: 'cluster-management-edit',
    title: 'mgRoutes.edit',
    meta: {
      breadcrumb: {
        parentName: 'cluster-management',
      },
      module: 'cluster-management',
    },
  },
];
