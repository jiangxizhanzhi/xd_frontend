export default [
  {
    name: 'cloud-computing-resource-experimental',
    path: '/cr/cloud-computing-resource-experimental',
    title: 'routes.cloud-computing-resource-experimental',
    meta: {
      breadcrumb: true,
      isThird: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'cloud-computing-resource-experimental-train',
    path: '/cr/cloud-computing-resource-experimental-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-experimental',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'cloud-computing-resource-experimental-template-detail',
    path: '/cr/cloud-computing-resource-experimental/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-experimental',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-computing-resource-experimental-create',
    path: '/cr/cloud-computing-resource-experimental/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-experimental',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-computing-resource-experimental-add',
    path: '/cr/cloud-computing-resource-experimental/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-computing-resource-experimental',
      },
    },
    component: './frame',
  },
];
