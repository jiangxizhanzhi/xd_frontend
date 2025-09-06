/* 指标项管理 */
export default [
  {
    // 指标项管理
    name: 'assessment-model',
    path: '/admin/cr/admin/assessment-model',
    title: 'routes.assessment-model',
    component: './frame',
  },
  {
    // 指标项新增
    name: 'assessment-model-create',
    path: '/admin/cr/admin/assessment-model/create',
    title: 'mgRoutes.add',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'assessment-model',
      },
    },
  },
  {
    // 指标项编辑
    name: 'assessment-model-edit',
    path: '/admin/cr/admin/assessment-model/edit/:resource_id',
    title: 'mgRoutes.edit',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'assessment-model',
      },
    },
  },
];
