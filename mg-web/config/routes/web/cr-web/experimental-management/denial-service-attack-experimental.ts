export default [
  {
    name: 'denial-service-attack-experimental',
    path: '/cr/denial-service-attack-experimental',
    title: 'routes.denial-service-attack-experimental',
    meta: {
      breadcrumb: true,
      isThird: true,
      // iconfont: 'icon-zhishidianku',
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'denial-service-attack-experimental-train',
    path: '/cr/denial-service-attack-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      module: 'denial-service-attack-experimental',
      breadcrumb: {
        parentName: 'denial-service-attack-experimental',
      },
    },
    component: './frame',
  },
  // 综合演训训练模板详情页
  {
    name: 'denial-service-attack-experimental-template-detail',
    path: '/cr/denial-service-attack-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      module: 'denial-service-attack-experimental',
      breadcrumb: {
        parentName: 'denial-service-attack-experimental',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'denial-service-attack-experimental-create',
    path: '/cr/denial-service-attack-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      module: 'denial-service-attack-experimental',
      breadcrumb: {
        parentName: 'denial-service-attack-experimental',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'denial-service-attack-experimental-add',
    path: '/cr/denial-service-attack-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      module: 'denial-service-attack-experimental',
      breadcrumb: {
        parentName: 'denial-service-attack-experimental',
      },
    },
    component: './frame',
  },
];
