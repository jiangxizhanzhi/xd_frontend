/* 指标体系 */
export default [
  {
    // 指标体系管理
    name: 'assessment-indicators',
    path: '/admin/cr/admin/assessment-indicators',
    title: 'routes.assessment-indicators',
    component: './frame',
  },
  {
    // 指标体系新增
    name: 'assessment-indicators-create',
    path: '/admin/cr/admin/assessment-indicators/create',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'assessment-indicators',
      },
    },
  },
  {
    // 指标体系编辑
    name: 'assessment-indicators-edit',
    path: '/admin/cr/admin/assessment-indicators/edit/:resource_id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'assessment-indicators',
      },
    },
  },
];
