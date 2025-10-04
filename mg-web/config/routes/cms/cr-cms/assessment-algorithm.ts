/* 评估算法 */
export default [
  {
    // 评估算法管理
    name: 'assessment-algorithm',
    path: '/admin/cr/admin/assessment-algorithm',
    title: 'routes.assessment-algorithm',
    component: './frame',
  },
  {
    // 评估算法新增
    name: 'assessment-algorithm-create',
    path: '/admin/cr/admin/assessment-algorithm/create',
    title: '新增',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'assessment-algorithm',
      },
    },
  },
  {
    // 评估算法编辑
    name: 'assessment-algorithm-edit',
    path: '/admin/cr/admin/assessment-algorithm/edit/:resource_id',
    title: '编辑',
    component: './frame',
    meta: {
      breadcrumb: {
        parentName: 'assessment-algorithm',
      },
    },
  },
];
