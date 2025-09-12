export default [
  {
    name: 'scan-detect-attack-experimental',
    path: '/cr/scan-detect-attack-experimental',
    title: 'routes.scan-detect-attack-experimental',
    meta: {
      breadcrumb: true,
      isThird: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'scan-detect-attack-experimental-train',
    path: '/cr/scan-detect-attack-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'scan-detect-attack-experimental-template-detail',
    path: '/cr/scan-detect-attack-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'scan-detect-attack-experimental-create',
    path: '/cr/scan-detect-attack-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'scan-detect-attack-experimental-add',
    path: '/cr/scan-detect-attack-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component: './frame',
  },
];
