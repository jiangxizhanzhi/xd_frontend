export default [
  {
    name: 'cloud-network-resource-subject',
    path: '/cr/cloud-network-resource-subject',
    title: 'routes.cloud-network-resource-subject',
    meta: {
      breadcrumb: true,
      isThird: true,
    },
    component: './frame',
  },
  // 我的训练详情页
  {
    name: 'cloud-network-resource-subject-train',
    path: '/cr/cloud-network-resource-subject-train/:resource_id',
    title: 'm.details',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component: './frame',
  },
  // 团队训练训练模板详情页
  {
    name: 'cloud-network-resource-subject-template-detail',
    path: '/cr/cloud-network-resource-subject/template-detail/:resource_id/:template_id',
    title: '训练模板详情',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component: './frame',
  },
  // 训练训练列表点击创建训练
  {
    name: 'cloud-network-resource-subject-create',
    path: '/cr/cloud-network-resource-subject/create/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component: './frame',
  },
  // 训练模板详情点击创建训练
  {
    name: 'cloud-network-resource-subject-add',
    path: '/cr/cloud-network-resource-subject/add/:resource_id/:template_id/:templateId/:business_template_id',
    title: '创建训练',
    meta: {
      breadcrumb: {
        parentName: 'cloud-network-resource-subject',
      },
    },
    component: './frame',
  },
];
