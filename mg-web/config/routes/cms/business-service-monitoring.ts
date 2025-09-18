export default [
  {
    name: 'business-service-monitoring',
    path: '/admin/system-operation/business-service-monitoring',
    title: 'routes.business-service-monitoring',
    component:
      './pages/cms/system-operation/business-service-monitoring/index.vue',
    meta: {
      module: 'business-service-monitoring',
      iconfont: 'icon-daohanglan-ziyuan',
    },
  },
  {
    name: 'business-service-monitoring-add',
    path: '/admin/system-operation/business-service-monitoring/add',
    title: 'mgRoutes.add',
    component:
      './pages/cms/system-operation/business-service-monitoring/add.vue',
    meta: {
      breadcrumb: {
        parentName: 'business-service-monitoring',
      },
      module: 'business-service-monitoring',
    },
  },
  {
    name: 'business-service-monitoring-edit',
    path: '/admin/system-operation/business-service-monitoring/edit/:id',
    title: 'mgRoutes.edit',
    component:
      './pages/cms/system-operation/business-service-monitoring/edit.vue',
    meta: {
      breadcrumb: {
        parentName: 'business-service-monitoring',
      },
      module: 'business-service-monitoring',
    },
  },
];
