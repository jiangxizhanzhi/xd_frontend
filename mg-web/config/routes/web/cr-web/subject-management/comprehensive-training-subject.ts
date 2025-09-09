export default [
  {
    name: 'comprehensive-training-subject',
    path: '/cr/comprehensive-training-subject',
    title: 'routes.comprehensive-training-subject',
    meta: {
      breadcrumb: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'comprehensive-training-subject-train',
    path: '/cr/comprehensive-training-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'comprehensive-training-subject-template-detail',
    path: '/cr/comprehensive-training-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'comprehensive-training-subject-create',
    path: '/cr/comprehensive-training-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'comprehensive-training-subject-add',
    path: '/cr/comprehensive-training-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'comprehensive-training-subject',
      },
    },
    component: './frame',
  },
];
