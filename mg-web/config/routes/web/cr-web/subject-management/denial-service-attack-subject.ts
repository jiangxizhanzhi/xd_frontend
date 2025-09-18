export default [
  {
    name: 'denial-service-attack-subject',
    path: '/cr/denial-service-attack-subject',
    title: 'routes.denial-service-attack-subject',
    meta: {
      breadcrumb: true,
      isThird: true,
      // iconfont: 'icon-lianxitiku',
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'denial-service-attack-subject-train',
    path: '/cr/denial-service-attack-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'denial-service-attack-subject',
      },
    },
    component: './frame',
  },
  // 综合演训训练模板详情页
  {
    name: 'denial-service-attack-subject-template-detail',
    path: '/cr/denial-service-attack-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'denial-service-attack-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'denial-service-attack-subject-create',
    path: '/cr/denial-service-attack-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'denial-service-attack-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'denial-service-attack-subject-add',
    path: '/cr/denial-service-attack-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'denial-service-attack-subject',
      },
    },
    component: './frame',
  },
];
