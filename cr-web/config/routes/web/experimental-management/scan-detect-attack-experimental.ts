export default [
  {
    name: 'scan-detect-attack-experimental',
    path: '/scan-detect-attack-experimental',
    title: 'routes.scan-detect-attack-experimental',
    meta: {
      auth: false,
      breadcrumb: true,
      isThird: true,
    },
    component: './pages/web/experimental-management/list.vue',
  },
  // 我的训练详情页
  {
    name: 'scan-detect-attack-experimental-train',
    path: '/scan-detect-attack-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component: './pages/web/experimental-management/teachers/teacher_home.vue',
  },
  // 团队训练训练模板详情页
  {
    name: 'scan-detect-attack-experimental-template-detail',
    path: '/scan-detect-attack-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/templates-detail.vue',
  },
  // 训练训练列表点击创建训练
  {
    name: 'scan-detect-attack-experimental-create',
    path: '/scan-detect-attack-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
  // 训练模板详情点击创建训练
  {
    name: 'scan-detect-attack-experimental-add',
    path: '/scan-detect-attack-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      auth: false,
      breadcrumb: {
        parentName: 'scan-detect-attack-experimental',
      },
    },
    component:
      './pages/web/experimental-management/components/train-create.vue',
  },
];
