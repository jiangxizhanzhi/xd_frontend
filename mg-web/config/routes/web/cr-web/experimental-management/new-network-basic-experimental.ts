export default [
  {
    name: 'new-network-basic-experimental',
    path: '/cr/new-network-basic-experimental',
    title: 'routes.new-network-basic-experimental',
    meta: {
      breadcrumb: true,
      isThird: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'new-network-basic-experimental-train',
    path: '/cr/new-network-basic-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-experimental',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'new-network-basic-experimental-template-detail',
    path: '/cr/new-network-basic-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-experimental',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'new-network-basic-experimental-create',
    path: '/cr/new-network-basic-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-experimental',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'new-network-basic-experimental-add',
    path: '/cr/new-network-basic-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'new-network-basic-experimental',
      },
    },
    component: './frame',
  },
];
