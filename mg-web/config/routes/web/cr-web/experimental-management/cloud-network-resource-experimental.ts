export default [
  {
    name: 'cloud-network-resource-experimental',
    path: '/cr/cloud-network-resource-experimental',
    title: 'routes.cloud-network-resource-experimental',
    meta: {
      breadcrumb: true,
      isThird: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'cloud-network-resource-experimental-train',
    path: '/cr/cloud-network-resource-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component: './frame',
  },
  // 综合演训训练模板详情页
  {
    name: 'cloud-network-resource-experimental-template-detail',
    path: '/cr/cloud-network-resource-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-network-resource-experimental-create',
    path: '/cr/cloud-network-resource-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-network-resource-experimental-add',
    path: '/cr/cloud-network-resource-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-experimental',
      },
    },
    component: './frame',
  },
];
