export default [
  {
    name: 'scan-detect-attack-subject',
    path: '/cr/scan-detect-attack-subject',
    title: 'routes.scan-detect-attack-subject',
    meta: {
      breadcrumb: true,
      isThird: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'scan-detect-attack-subject-train',
    path: '/cr/scan-detect-attack-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-subject',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'scan-detect-attack-subject-template-detail',
    path: '/cr/scan-detect-attack-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'scan-detect-attack-subject-create',
    path: '/cr/scan-detect-attack-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'scan-detect-attack-subject-add',
    path: '/cr/scan-detect-attack-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-subject',
      },
    },
    component: './frame',
  },
];
